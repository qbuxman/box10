
import hre from "hardhat";
const { ethers } = await hre.network.connect();


async function main(): Promise<void> {
    console.log('Deployment in progress...');

    const [deployer] = await ethers.getSigners();

    console.log(deployer.address)

    // Deploy with deployer address as owner
    const Box10 = await ethers.deployContract("Box10", [deployer.address]);


    console.log(`Contract deployed at the address: ${Box10.target}`)

    // Check contract balance
    const balance = await Box10.balanceOf(Box10.target);
    console.log("Contract balance: ", balance, "BOX10");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
