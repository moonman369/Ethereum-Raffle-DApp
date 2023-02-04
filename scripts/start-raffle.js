const { ethers } = require('hardhat');
const prompt = require('prompt');
require('dotenv').config();
const { abi } = require('../artifacts/contracts/raffle.sol/Raffle.json');

const rpcUrl = process.env.GOERLI_RPC_URL;
const raffleV2Address = process.env.RAFFLE_V2_ADDRESS_FINAL;
const ownerPvtKey = process.env.PRIVATE_KEY_G;
const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
const raffle = new ethers.Contract(raffleV2Address, abi, provider);

const startRaffle = async (duration) => {
  const signer = new ethers.Wallet(ownerPvtKey, provider);
  const tx = await raffle.connect(signer).startRaffle(duration);
  const res = await tx.wait();
  return res;
};

const main = async () => {
  prompt.start();

  prompt.get(['Duration'], async (error, result) => {
    duration = result.Duration;
    const txResult = await startRaffle(duration);
    console.log(txResult);
  });
};

main()
  .catch((error) => {
    console.error(error);
  })
  .then(() => {
    // process.exit(0);
  });
