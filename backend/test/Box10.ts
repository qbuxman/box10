import { expect } from "chai";
import hre from "hardhat";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

const { ethers } = await hre.network.connect();

describe("Box10", function () {
    let contract: any;
    let admin: SignerWithAddress;
    let distributor: SignerWithAddress;
    let criticalDistributor: SignerWithAddress;
    let firstUser: SignerWithAddress;
    let secondUser: SignerWithAddress;
    let actions = {
        subscription: 'subscription',
        completedQuiz: 'completedQuiz',
        selectStategy: 'selectStategy',
    }
    const zeroAddress = '0x0000000000000000000000000000000000000000';

    before(async () => {
        [admin, criticalDistributor, distributor, firstUser, secondUser] = await ethers.getSigners();

        contract = await ethers.deployContract("Box10", [admin.address, criticalDistributor.address, distributor.address]);
    })

    it("Should mint correctly supply of token", async () => {
        let balance = await contract.availableSupply();

        expect(balance).to.eq(1000000000n);
    });

    describe("Distribute", () => {
        it("Should distributor distribute token", async () => {
            const amount = 100n;

            await contract.connect(distributor).distribute(firstUser.address, amount, actions.subscription);

            const firstUserBalance: bigint = await contract.balanceOf(firstUser.address);
            expect(firstUserBalance).to.equal(ethers.parseUnits(amount.toString(), 18));
        });

        it("Should ONLY distributor distribute token", async () => {
            await expect(
                contract.connect(firstUser).distribute(secondUser.address, 100n, actions.completedQuiz)
            ).to.be.revertedWithCustomError(contract, "OnlyDistributorOrCriticalDistributor");
        });

        it("Should ONLY critical distributor distribute token if amount is superior to threshold", async () => {
            await expect(
                contract.connect(distributor).distribute(secondUser.address, 1001n, actions.completedQuiz)
            ).to.be.revertedWithCustomError(contract, "OnlyCriticalDistributor");
        });

        it("Should revert if trying to distribute to zero address", async () => {
            await expect(
                contract.connect(distributor).distribute(zeroAddress, 100n, actions.subscription)
            ).to.be.revertedWithCustomError(contract, "NonZeroAddress");
        });

        it("Should revert if insufficient balance in contract", async () => {
            const hugeAmount = 2000000000n;
            await expect(
                contract.connect(criticalDistributor).distribute(secondUser.address, hugeAmount, actions.subscription)
            ).to.be.revertedWithCustomError(contract, "InsufficientBalance");
        });
    });

    describe("addDistributor", () => {
        it("Should add distributor", async () => {
            await expect(contract.connect(admin).addDistributor(firstUser.address))
                .to.emit(contract, "NewDistributorAdded")
                .withArgs(admin.address, firstUser.address);

            expect(await contract.isDistributor(firstUser.address)).to.be.true;
        });

        it("Should revert if non admin try to add distributor", async () => {
            await expect(
                contract.connect(firstUser).addDistributor(secondUser.address)
            ).revertedWithCustomError(contract, "AccessControlUnauthorizedAccount");

            expect(await contract.isDistributor(secondUser.address)).to.be.false;
        });

        it("Should revert if trying to add zero address as distributor", async () => {
            await expect(
                contract.connect(admin).addDistributor(zeroAddress)
            ).to.be.revertedWithCustomError(contract, "NonZeroAddress");
        });
    });

    describe("removeDistributor", () => {
        it("Should remove distributor", async () => {
            expect(await contract.isDistributor(firstUser.address)).to.be.true;

            await expect(await contract.connect(admin).removeDistributor(firstUser.address))
                .to.emit(contract, "DistributorRevoked")
                .withArgs(admin.address, firstUser.address);

            expect(await contract.isDistributor(firstUser.address)).to.be.false;
        });

        it("Should revert if non admin try to remove distributor", async () => {
            await expect(
                contract.connect(firstUser).removeDistributor(secondUser.address)
            ).revertedWithCustomError(contract, "AccessControlUnauthorizedAccount");

            expect(await contract.isDistributor(secondUser.address)).to.be.false;
        });

        it("Should revert if trying to remove zero address as distributor", async () => {
            await expect(
                contract.connect(admin).removeDistributor(zeroAddress)
            ).to.be.revertedWithCustomError(contract, "NonZeroAddress");
        });
    });

    describe('isCriticalDistributor', () => {
        it('Should return true if distributor distributor is critical', async () => {
            expect(await contract.isCriticalDistributor(criticalDistributor.address)).to.be.true;
        })
    });

    describe("burn", () => {
        it("Should burn positive amount of token and emit BurnToken event", async () => {
            await expect(contract.connect(firstUser).burnToken(10))
                .to.emit(contract, "BurnToken")
                .withArgs(firstUser.address, 10);
        });

        it("Should revert if trying to burn zero amount", async () => {
            await expect(
                contract.connect(firstUser).burnToken(0)
            ).to.be.revertedWithCustomError(contract, "NonZeroValue");
        });
    });

    describe("Transfer restrictions", () => {
        it("Should revert if user tries to transfer to another user", async () => {
            await expect(
                contract.connect(firstUser).transfer(secondUser.address, 10)
            ).to.be.revertedWithCustomError(contract, "UserCannotTransferToken");
        });

        it("Should revert if trying to transfer zero amount", async () => {
            await expect(
                contract.connect(distributor).distribute(firstUser.address, 0, actions.subscription)
            ).to.be.revertedWithCustomError(contract, "NonZeroValue");
        });

        it("Should allow admin to transfer tokens", async () => {
            const amount = 50n;
            await contract.connect(distributor).distribute(admin.address, amount, actions.subscription);

            const balanceBefore = await contract.balanceOf(secondUser.address);
            await contract.connect(admin).transfer(secondUser.address, ethers.parseUnits(amount.toString(), 18));
            const balanceAfter = await contract.balanceOf(secondUser.address);

            expect(balanceAfter - balanceBefore).to.equal(ethers.parseUnits(amount.toString(), 18));
        });
    });

    describe("Approvals", () => {
        it("Should revert any approval attempt", async () => {
            await expect(
                contract.connect(firstUser).approve(secondUser.address, 100)
            ).revertedWithCustomError(contract, "ApprovalsNotAllowed");
        });
    });

    describe("Pause", () => {
        it("Should revert if other role than DEFAULT_ADMIN_ROLE call function", async () => {
            await expect(contract.connect(firstUser).pause())
                .revertedWithCustomError(contract, "AccessControlUnauthorizedAccount");
        });

        it("Should revert if function called when contract is already in pause", async () => {
            await expect(contract.connect(admin).pause())
                .emit(contract, "Paused");
            await expect(contract.connect(admin).pause())
                .revertedWithCustomError(contract, "EnforcedPause");
        });
    });

    describe("Unpause", () => {
        it("Should revert if other role than DEFAULT_ADMIN_ROLE call function", async () => {
            await expect(contract.connect(firstUser).unpause())
                .revertedWithCustomError(contract, "AccessControlUnauthorizedAccount");
        });

        it("Should revert if function called when contract is not in pause", async () => {
            await expect(contract.connect(admin).unpause()).emit(contract, "Unpaused");
            await expect(contract.connect(admin).unpause()).revertedWithCustomError(contract, "ExpectedPause");
        });
    });
});