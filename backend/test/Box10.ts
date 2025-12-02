import { expect } from "chai";
import hre from "hardhat";

const { ethers } = await hre.network.connect();

describe("Box10", function () {
    let contract: any;

    before(async () => {
        const [deployer] = await ethers.getSigners();

        contract = await ethers.deployContract("Box10", [deployer.address]);
    })

    it("Should mint correctly supply of token", async () => {
        let balance = await contract.availableSupply();

        await expect(balance).to.eq(1000000000n);
    });
});