require("dotenv").config();
const { ethers } = require("hardhat");
const ENTRANCE_FEE = ethers.utils.parseEther("0.01");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const args = [
    process.env.VRF_COO_G,
    process.env.SUB_ID_G,
    process.env.VRF_COO_GAS_LANE_G,
    ENTRANCE_FEE,
    "2500000",
  ];

  const raffle = await deploy("Raffle", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: 6,
  });
};
