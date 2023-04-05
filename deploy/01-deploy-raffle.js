require('dotenv').config();
const { ethers } = require('hardhat');
const ENTRANCE_FEE = ethers.utils.parseEther('0.005');

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const args = [
    process.env.VRF_COO_S,
    process.env.SUB_ID_S,
    process.env.VRF_COO_GAS_LANE_S,
    300,
    ENTRANCE_FEE,
    '2500000',
  ];

  const raffle = await deploy('Raffle', {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: 6,
  });
};
