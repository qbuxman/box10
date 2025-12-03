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

        contract = await ethers.deployContract("Box10", [admin.address, criticalDistributor, distributor.address]);
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
            ).to.be.revertedWithCustomError(contract, "AccessControlUnauthorizedAccount");
        });
    });

    describe("addDistributor", () => {
        it("Should add distributor", async () => {
            await expect(contract.connect(admin).addDistributor(firstUser.address))
                .to.emit(contract, "NewDistributorAdded")
                .withArgs(admin.address, firstUser.address);

            expect(await contract.isDistributor(firstUser.address)).to.be.true;
        });

        it("Should revert id non admin try to add distributor", async () => {
            await expect(
                contract.connect(firstUser).addDistributor(secondUser.address)
            ).revertedWithCustomError(contract, "AccessControlUnauthorizedAccount");

            expect(await contract.isDistributor(secondUser.address)).to.be.false;
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

        it("Should revert id non admin try to remove distributor", async () => {
            await expect(
                contract.connect(firstUser).removeDistributor(secondUser.address)
            ).revertedWithCustomError(contract, "AccessControlUnauthorizedAccount");

            expect(await contract.isDistributor(secondUser.address)).to.be.false;
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
        })
    })
});