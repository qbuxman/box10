import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("Box10Module", (m) => {
    const ownerAddress = '0x2C3F167288903caB856138845B9B3065684CF0D9'

    const box10 = m.contract("Box10", [ownerAddress]);

    return { box10 };
});
