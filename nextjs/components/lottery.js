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
  const [lastTimestamp, setlastTimestamp] = useState("Fetching...");
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

  const { runContractFunction: getLastTimestamp } = useWeb3Contract({
    abi: raffleAbi,
    contractAddress: CONTRACT_ADDRESS,
    functionName: "getLastTimeStamp",
    params: {},
  });

  useEffect(() => {
    async function updateUi() {
      let recentWinnerFromCall = await getRecentWinner();
      setRecentWinner(`  ${recentWinnerFromCall}`);
      console.log(recentWinnerFromCall);

      let entranceFeeFromCall = await getEntranceFee();
      setEntryFee(`${ethers.utils.formatEther(entranceFeeFromCall)} ETH`);
      console.log(
        parseInt(entranceFeeFromCall._hex, 16),
        ethers.utils.formatEther(entranceFeeFromCall)
      );

      let playerCountFromCall = await getPlayerCount();
      setPlayerCount(parseInt(playerCountFromCall._hex, 16));
      console.log(playerCountFromCall);

      let raffleStateFromCall = await getRaffleState();
      raffleStateFromCall == 0
        ? setRaffleState("  Open")
        : setRaffleState("  Closed");
      console.log(raffleStateFromCall);

      let lastTimstampFromCall = await getLastTimestamp();
      const unixTimestamp = parseInt(lastTimstampFromCall._hex, 16);
      const monthsArr = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const date = new Date(unixTimestamp * 1000);
      const dd = date.getDate();
      const mmm = monthsArr[date.getMonth()];
      const yyyy = date.getFullYear();
      const h = date.getHours();
      const m = date.getMinutes();
      const s = date.getSeconds();
      setlastTimestamp(
        `${dd}-${mmm}-${yyyy}, ${String(h).padStart(2, "0")}:${String(
          m
        ).padStart(2, "0")}:${String(s).padStart(2, "0")} UTC +5:30`
      );
      console.log(lastTimstampFromCall);
    }
    if (isWeb3Enabled) {
      updateUi();
    }
  }, [isWeb3Enabled]);

  // prettier-ignore
  return (
    <div><br/>
      <button
        className="rounded ml-auto width-50 height-10 font-bold bg-blue-500"
        onClick={async () => {
          await enterRaffle().catch((error) => {
            console.log(error.message)
          });
        }}
      >
        Enter Raffle
      </button>
      <br />
      <br />
      <div>Entry Fee: {entryFee}</div>
      <br />
      <div>Current Participation Count: {playerCount}</div>
      <br />
      <div>Raffle State: {raffleState}</div>
      <br />
      <div>Most Recent Winner: {recentWinner}</div><br/>
      <div>Last Win Timestamp: {lastTimestamp}</div>
    </div>
  );
}
