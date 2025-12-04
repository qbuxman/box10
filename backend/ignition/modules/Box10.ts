import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("Box10Module", (m) => {
    const adminWallet = '0x2C3F167288903caB856138845B9B3065684CF0D9';

    const distributorWallet = '0x948DB68A78b03aa8399E28Fb4D78D109D33d32CF';

    const box10 = m.contract("Box10", [distributorWallet, adminWallet, distributorWallet]);

    return { box10 };
});
