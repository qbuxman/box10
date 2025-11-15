import { network } from "hardhat";

const { ethers } = await network.connect({
	network: "localhost",
});

async function main(): Promise<void> {
	console.log('Déploiement en cours...');

	const [deployer] = await ethers.getSigners();

	console.log(deployer.address)

	const Box10 = await ethers.deployContract("Box10");

	console.log(`Contract déployé à ${Box10.target}`)

	const tx = await deployer.sendTransaction({
		to: Box10.target,
		value: ethers.parseEther("10.0")
	});

	await tx.wait();

	// Vérifier la balance du contrat
	const contractBalance = await ethers.provider.getBalance(Box10.target);
	console.log("Balance du contrat:", ethers.formatEther(contractBalance), "ETH");

	// Vérifier la balance après déploiement
	const balanceAfter = await ethers.provider.getBalance(deployer.address);
	console.log("Nouvelle balance du deployer:", ethers.formatEther(balanceAfter), "ETH");

}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
