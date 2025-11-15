import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("Box10Module", (m) => {
  const box10 = m.contract("Box10");

  return { box10 };
});
