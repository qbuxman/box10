import { expect } from "chai";
import hre from "hardhat";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

const { ethers } = await hre.network.connect();

describe("Box10", function () {
    let contract: any;
    let deployer: SignerWithAddress;
    let firstUser: SignerWithAddress;
    let secondUser: SignerWithAddress;
    let actions = {
        subscription: 'subscription',
        completedQuiz: 'completedQuiz',
        selectStategy: 'selectStategy',
    }
    const zeroAddress = '0x0000000000000000000000000000000000000000';

    before(async () => {
        [deployer, firstUser, secondUser] = await ethers.getSigners();

        contract = await ethers.deployContract("Box10", [deployer.address]);
    })

    it("Should mint correctly supply of token", async () => {
        let balance = await contract.availableSupply();

        expect(balance).to.eq(1000000000n);
    });

    describe("Distribute", () => {
        it("Should owner distribute token", async () => {
            const amount = 100n;

            await contract.connect(deployer).distribute(firstUser.address, amount, actions.subscription);

            const firstUserBalance: bigint = await contract.balanceOf(firstUser.address);
            expect(firstUserBalance).to.equal(ethers.parseUnits(amount.toString(), 18));
        });

        it("Should ONLY owner distribute token", async () => {
            await expect(
                contract.connect(firstUser).distribute(secondUser.address, 100n, actions.completedQuiz)
            ).to.be.revertedWithCustomError(contract, "OwnableUnauthorizedAccount");
        });
    });

    describe("_update", () => {
        it("Should owner burn correctly", async () => {
            const amount = 100n;
            let totalSupplyBefore = await contract.totalSupply();

            await contract.connect(firstUser).burn(amount);

            let totalSupplyAfter = await contract.totalSupply();

            expect(totalSupplyAfter).to.be.lessThan(totalSupplyBefore);
        });
    });
});