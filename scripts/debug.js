const { ethers } = require('hardhat');
require('dotenv').config();
const { abi } = require('../artifacts/contracts/raffle.sol/Raffle.json');

const rpcUrl = process.env.GOERLI_RPC_URL;
const raffleV2Address = process.env.RAFFLE_V2_ADDRESS;
const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
const raffle = new ethers.Contract(raffleV2Address, abi, provider);

// 'http://127.0.0.1:8545'

const sleep = async (ms) => {
    setTimeout(() => {}, ms);
}

const startRaffle = async (duration) => {
    const owner = new ethers.Wallet(process.env.PRIVATE_KEY_G, provider)

    // const owner = await ethers.getSigners()

    

    const tx = await raffle.connect(owner).startRaffle(10).catch(error => console.error(error));
    await tx.wait()


    const tx2 = await raffle.connect(owner).enterRaffle({value: ethers.utils.parseEther('0.01')})
    await tx2.wait()

    console.log(await raffle.getRaffleState());

}

const getRaffleState = async () => {
    const state = await raffle.getRaffleState()
    console.log(state)
}

const main = async () => {
    const tx1 = await getRaffleState();
    
    const tx2 = await startRaffle();

    const tx3 = sleep(15000);

    await getRaffleState();
}

main().catch((error) => {
    console.error(error)
}).then(() => {
    process.exit(0);
})
