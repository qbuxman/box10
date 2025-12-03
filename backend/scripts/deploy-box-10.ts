
import hre from "hardhat";
const { ethers } = await hre.network.connect();


async function main(): Promise<void> {
    console.log('Deployment in progress...');

    const [admin, distributor] = await ethers.getSigners();

    console.log('ADMIN_ADDRESS', admin.address);
    console.log('DISTRIBUTOR_ADDRESS', admin.address);


    // Deploy with admin address as owner
    const Box10 = await ethers.deployContract("Box10", [admin.address, distributor.address]);


    console.log(`Contract deployed at the address: ${Box10.target}`)

    console.log(await Box10.hasRole(await Box10.DEFAULT_ADMIN_ROLE(), distributor.address));

    // Check contract balance
    const balance = await Box10.balanceOf(Box10.target);
    console.log("Contract balance: ", balance, "BOX10");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
