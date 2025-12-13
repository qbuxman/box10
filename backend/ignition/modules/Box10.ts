import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("Box10Module", (m) => {
    const adminWallet = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266';
    const criticalDistributorWallet = '0x90f79bf6eb2c4f870365e785982e1f101e93b906';
    const distributorWallet = '0x70997970c51812dc3a010c7d01b50e0d17dc79c8';

    const box10 = m.contract("Box10", [adminWallet, criticalDistributorWallet, distributorWallet]);

    return { box10 };
});
