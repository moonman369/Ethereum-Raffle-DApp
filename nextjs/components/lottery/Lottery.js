import { useState, useEffect } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { ethers } from "ethers";
import raffleAbi from "../../constants/abi.json";
import styles from '../../styles/Home.module.css';

// rinkeby: 0x0296Ab7e0AF274e81964275257e0E63025640299
//          0x085d4E65D451fD35DE42c124c4C47d373b42cfA8
// goerli: 0xd25271cFdF593E4bc16E34118333171CFB27c801
const CONTRACT_ADDRESS = "0x530c3072935cefF646c0E9Db5B0C5E4FFF2183f0";

function unixToDateTime(unixTimestamp) {
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
  return `${dd}-${mmm}-${yyyy}, ${String(h).padStart(2, "0")}:${String(
    m
  ).padStart(2, "0")}:${String(s).padStart(2, "0")} UTC +5:30`;
}
``;

export default function LotteryEntrance() {
  const [recentWinner, setRecentWinner] = useState("Fetching...");
  const [entryFee, setEntryFee] = useState("Fetching...");
  const [playerCount, setPlayerCount] = useState("Fetching...");
  const [raffleState, setRaffleState] = useState("Fetching...");
  const [lastTimestamp, setLastTimestamp] = useState("Fetching...");
  const [startTimestamp, setStartTimestamp] = useState("Fetching...");
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

  const { runContractFunction: getStartTimestamp } = useWeb3Contract({
    abi: raffleAbi,
    contractAddress: CONTRACT_ADDRESS,
    functionName: "getRaffleStartTimestamp",
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
      const unixTimestamp1 = parseInt(lastTimstampFromCall._hex, 16);
      setLastTimestamp(unixToDateTime(unixTimestamp1));

      let startTimestampFromCall = await getStartTimestamp();
      console.log(startTimestampFromCall);
      const unixTimestamp2 = parseInt(startTimestampFromCall._hex, 16);
      setStartTimestamp(unixToDateTime(unixTimestamp2));

      //   const monthsArr = [
      //     "Jan",
      //     "Feb",
      //     "Mar",
      //     "Apr",
      //     "May",
      //     "Jun",
      //     "Jul",
      //     "Aug",
      //     "Sep",
      //     "Oct",
      //     "Nov",
      //     "Dec",
      //   ];
      //   const date = new Date(unixTimestamp * 1000);
      //   const dd = date.getDate();
      //   const mmm = monthsArr[date.getMonth()];
      //   const yyyy = date.getFullYear();
      //   const h = date.getHours();
      //   const m = date.getMinutes();
      //   const s = date.getSeconds();
      //   setlastTimestamp(
      //     `${dd}-${mmm}-${yyyy}, ${String(h).padStart(2, "0")}:${String(
      //       m
      //     ).padStart(2, "0")}:${String(s).padStart(2, "0")} UTC +5:30`
      //   );
      //   console.log(lastTimstampFromCall);
      // }
    }
    if (isWeb3Enabled) {
      updateUi();
    }
  }, [isWeb3Enabled]);

  // prettier-ignore
  return (
    <div><br/>
      <button
        className={styles.enter__btn}
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
      <div className={styles.content__box}>
      <div>Entry Fee: <span className={styles.spl__text}>{entryFee}</span></div>
      <br />
      {/* <div>Contract Address: <a className={styles.link} href="https://goerli.etherscan.io/address/0x530c3072935ceff646c0e9db5b0c5e4fff2183f0" target="_blank" rel="noopener noreferrer" color="blue">0x530c3072935cefF646c0E9Db5B0C5E4FFF2183f0</a></div> */}
      <div>Current Participation Count: <span className={styles.spl__text}>{playerCount}</span></div>
      <br />
      <div>Raffle State: <span className={styles.spl__text}>{raffleState}</span></div>
      <br />
      <div>Current Raffle Start Timestamp: <span className={styles.spl__text}>{startTimestamp}</span></div>
      <br/>
      <div>Most Recent Winner: <span className={styles.spl__text}>{recentWinner}</span></div><br/>
      <div>Last Win Timestamp: <span className={styles.spl__text}>{lastTimestamp}</span></div>
      </div>
    </div>
  );
}
