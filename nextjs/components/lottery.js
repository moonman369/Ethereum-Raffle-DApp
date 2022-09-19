import { useState, useEffect } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import raffleAbi from "../constants/abi.json";

// rinkeby: 0x0296Ab7e0AF274e81964275257e0E63025640299
//          0x085d4E65D451fD35DE42c124c4C47d373b42cfA8
const CONTRACT_ADDRESS = "0x085d4E65D451fD35DE42c124c4C47d373b42cfA8";

export default function LotteryEntrance() {
  const [recentWinner, setRecentWinner] = useState("0");
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

  useEffect(() => {
    async function updateUi() {
      let recentWinnerFromCall = await getRecentWinner();
      setRecentWinner(recentWinnerFromCall);
      console.log(recentWinnerFromCall);
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
      <div>The Recent Winner is: {recentWinner}</div>
    </div>
  );
}
