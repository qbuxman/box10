import hre from "hardhat";
const { ethers } = await hre.network.connect();

/**
 * Script pour obtenir des USDC en local via le fork du mainnet
 * Ce script "impersonate" un gros détenteur d'USDC et transfère des tokens une adresse
 */
async function main() {
  // Adresse d'un gros détenteur d'USDC (Circle ici)
  const USDC_WHALE = "0x55FE002aefF02F77364de339a1292923A15844B8";

  // Adresse USDC sur mainnet
  const USDC_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

  // Votre adresse (peut être passée en paramètre lors du lancement)
  // Par défaut, on utilise le premier compte Hardhat
  const YOUR_ADDRESS = process.env.ADDRESS || "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

  console.log(`🎯 Adresse cible: ${YOUR_ADDRESS}`);
  console.log(`💰 Funding ${YOUR_ADDRESS} avec de l'USDC...`);

  // Impersonate le whale USDC
  await ethers.provider.send("hardhat_impersonateAccount", [USDC_WHALE]);

  const whaleSigner = await ethers.getSigner(USDC_WHALE);

  // Récupérer le contrat USDC
  const usdcContract = await ethers.getContractAt(
    [
      "function transfer(address to, uint256 amount) returns (bool)",
      "function balanceOf(address account) view returns (uint256)",
      "function decimals() view returns (uint8)"
    ],
    USDC_ADDRESS,
    whaleSigner
  );

  // Montant à transférer (10,000 USDC)
  const amount = ethers.parseUnits("10000", 6); // USDC a 6 décimales

  // Vérifier le solde du whale
  const whaleBalance = await usdcContract.balanceOf(USDC_WHALE);
  console.log(`💼 Solde du whale: ${ethers.formatUnits(whaleBalance, 6)} USDC`);

  if (whaleBalance < amount) {
    console.error("❌ Le whale n'a pas assez d'USDC");
    process.exit(1);
  }
    // Financer aussi en ETH pour les gas fees
    console.log(`⛽ Funding ${YOUR_ADDRESS} avec de l'ETH pour les gas...`);
    const [deployer] = await ethers.getSigners();
    const feeData = await ethers.provider.getFeeData();
    const ethTx = await deployer.sendTransaction({
        to: YOUR_ADDRESS,
        value: ethers.parseEther("10"), // 10 ETH
        maxFeePerGas: feeData.maxFeePerGas! * 2n, // Double the suggested fee
        maxPriorityFeePerGas: feeData.maxPriorityFeePerGas! * 2n,
    });
    await ethTx.wait();

    const ethBalance = await ethers.provider.getBalance(YOUR_ADDRESS);
    console.log(`✅ Nouveau solde ETH: ${ethers.formatEther(ethBalance)} ETH`);

  // Transférer l'USDC
    const currentBalance = await usdcContract.balanceOf(YOUR_ADDRESS);

    console.log(`BALANCE ACTUELLE de ${ethers.formatUnits(currentBalance, 6)} USDC...`);
    console.log(`📤 Transfert de ${ethers.formatUnits(amount, 6)} USDC...`);
  const tx = await usdcContract.transfer(YOUR_ADDRESS, amount);
  await tx.wait();

  // Vérifier le nouveau solde
  const newBalance = await usdcContract.balanceOf(YOUR_ADDRESS);
  console.log(`✅ Nouveau solde: ${ethers.formatUnits(newBalance, 6)} USDC`);


  // Stop impersonating
  await ethers.provider.send("hardhat_stopImpersonatingAccount", [USDC_WHALE]);

  console.log("\n🎉 Funding terminé avec succès!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
