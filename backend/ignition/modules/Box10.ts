import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("Box10Module", (m) => {
    const deployAddress = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266'

    const box10 = m.contract("Box10", [deployAddress]);

    return { box10 };
});
