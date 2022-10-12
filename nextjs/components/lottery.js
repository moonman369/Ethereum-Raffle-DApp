import { useState, useEffect } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import raffleAbi from "../constants/abi.json";

// rinkeby: 0x0296Ab7e0AF274e81964275257e0E63025640299
//          0x085d4E65D451fD35DE42c124c4C47d373b42cfA8
const CONTRACT_ADDRESS = "0xd25271cFdF593E4bc16E34118333171CFB27c801";

export default function LotteryEntrance() {
  const [recentWinner, setRecentWinner] = useState("0");
  const [entryFee, setEntryFee] = useState("0");
  const [playerCount, setPlayerCount] = useState(0);
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

  useEffect(() => {
    async function updateUi() {
      let recentWinnerFromCall = await getRecentWinner();
      setRecentWinner(recentWinnerFromCall);
      console.log(recentWinnerFromCall);

      let entranceFeeFromCall = await getEntranceFee();
      setEntryFee(parseInt(entranceFeeFromCall._hex, 16));
      console.log(entranceFeeFromCall);

      let playerCountFromCall = await getPlayerCount();
      setPlayerCount(parseInt(playerCountFromCall._hex, 16));
      console.log(playerCountFromCall);
    }
    if (isWeb3Enabled) {
      updateUi();
    }
  }, [isWeb3Enabled]);

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
      <div>Entry Fee: {entryFee}</div>
      <div>Current Participation Count: {playerCount}</div>
      <div>The Previous Winner was: {recentWinner}</div>
    </div>
  );
}
