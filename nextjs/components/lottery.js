import { useState, useEffect } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { ethers } from "ethers";
import raffleAbi from "../constants/abi.json";

// rinkeby: 0x0296Ab7e0AF274e81964275257e0E63025640299
//          0x085d4E65D451fD35DE42c124c4C47d373b42cfA8
const CONTRACT_ADDRESS = "0xd25271cFdF593E4bc16E34118333171CFB27c801";

export default function LotteryEntrance() {
  const [recentWinner, setRecentWinner] = useState("Fetching...");
  const [entryFee, setEntryFee] = useState("Fetching...");
  const [playerCount, setPlayerCount] = useState("Fetching...");
  const [raffleState, setRaffleState] = useState("Fetching...");
  const { isWeb3Enabled } = useMoralis();

  // Enter Lottery Button
  const { runContractFunction: enterRaffle } = useWeb3Contract({
    abi: raffleAbi,
    contractAddress: CONTRACT_ADDRESS,
    functionName: "enterRaffle",
    msgValue: "10000000000000000",
    params: {},
  });

  // View Functions
  const { runContractFunction: getRecentWinner } = useWeb3Contract({
    abi: raffleAbi,
    contractAddress: CONTRACT_ADDRESS,
    functionName: "getRecentWinner",
    params: {},
  });

  const { runContractFunction: getEntranceFee } = useWeb3Contract({
    abi: raffleAbi,
    contractAddress: CONTRACT_ADDRESS,
    functionName: "getEntranceFee",
    params: {},
  });

  const { runContractFunction: getPlayerCount } = useWeb3Contract({
    abi: raffleAbi,
    contractAddress: CONTRACT_ADDRESS,
    functionName: "getNumberOfPlayers",
    params: {},
  });

  const { runContractFunction: getRaffleState } = useWeb3Contract({
    abi: raffleAbi,
    contractAddress: CONTRACT_ADDRESS,
    functionName: "getRaffleState",
    params: {},
  });

  useEffect(() => {
    async function updateUi() {
      let recentWinnerFromCall = await getRecentWinner();
      setRecentWinner(`  ${recentWinnerFromCall}`);
      console.log(recentWinnerFromCall);

      let entranceFeeFromCall = await getEntranceFee();
      setEntryFee(`  ${ethers.utils.formatEther(entranceFeeFromCall)} ETH`);
      console.log(
        parseInt(entranceFeeFromCall._hex, 16),
        ethers.utils.formatEther(entranceFeeFromCall)
      );

      let playerCountFromCall = await getPlayerCount();
      setPlayerCount(`  ${parseInt(playerCountFromCall._hex, 16)}`);
      console.log(playerCountFromCall);

      let raffleStateFromCall = await getRaffleState();
      raffleStateFromCall == 0
        ? setRaffleState("  Inactive")
        : setRaffleState("  Active");
      console.log(raffleStateFromCall);
    }
    if (isWeb3Enabled) {
      updateUi();
    }
  }, [isWeb3Enabled]);

  // prettier-ignore
  return (
    <div>
      <button
        className="rounded ml-auto font-bold bg-green-500"
        onClick={async () => {
          await enterRaffle();
        }}
      >
        Enter Raffle
      </button>
      <br />
      <br />
      <div>Entry Fee:   {entryFee}</div>
      <br />
      <div>Current Participation Count:   {playerCount}</div>
      <br />
      <div>Raffle State:   {raffleState}</div>
      <br />
      <div>The Previous Winner was:   {recentWinner}</div>
    </div>
  );
}
