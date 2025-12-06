import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("Box10Module", (m) => {
    // const adminWallet = '0x2C3F167288903caB856138845B9B3065684CF0D9';
    const adminWallet = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266'; // Account 0 Hardhat

    // const distributorWallet = '0x948DB68A78b03aa8399E28Fb4D78D109D33d32CF'; // Sepolia
    const distributorWallet = '0x70997970c51812dc3a010c7d01b50e0d17dc79c8'; // Account 1 Hardat

    const box10 = m.contract("Box10", [adminWallet, distributorWallet, distributorWallet]);

    return { box10 };
});
