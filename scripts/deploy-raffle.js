const { ethers } = require("hardhat");
require("dotenv").config();

async function deploy() {}

// module.exports = async ({ getNamedAccounts, deployments }) => {
//   const { deploy, log } = deployments;
//   const { deployer } = await getNamedAccounts();
//   const args = [
//     "0x6168499c0cFfCaCD319c818142124B7A15E857ab",
//     "4456",
//     "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc",
//     300,
//     ENTRANCE_FEE,
//     "500000",
//   ];

//   const raffle = await deploy("Raffle", {
//     from: deployer,
//     args: args,
//     log: true,
//     waitConfirmations: 6,
//   });
// }
