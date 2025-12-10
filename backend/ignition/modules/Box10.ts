import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("Box10Module", (m) => {
    const adminSafeWallet = '0x2C3F167288903caB856138845B9B3065684CF0D9';
    const adminWallet = '0x948DB68A78b03aa8399E28Fb4D78D109D33d32CF';

    const criticalDistributorWallet = '0x948DB68A78b03aa8399E28Fb4D78D109D33d32CF';
    const distributorWallet = '0xe45437cab72d0139c4d72bf7682f0e1b303bb6b0';

    const box10 = m.contract("Box10", [adminWallet, criticalDistributorWallet, distributorWallet]);

    return { box10 };
});
