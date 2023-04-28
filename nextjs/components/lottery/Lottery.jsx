import { useState, useEffect, useRef } from 'react';
import { useMoralis, useWeb3Contract } from 'react-moralis';
import { ethers } from 'ethers';
import raffleAbi from '../../constants/abi.json';
import styles from '../../styles/Home.module.css';

// rinkeby: 0x0296Ab7e0AF274e81964275257e0E63025640299
//          0x085d4E65D451fD35DE42c124c4C47d373b42cfA8
// goerli: 0xd25271cFdF593E4bc16E34118333171CFB27c801
//         0x530c3072935cefF646c0E9Db5B0C5E4FFF2183f0
const CONTRACT_ADDRESS = '0xeD5F7D3B8bDe22c8dCcAcEF86ADBc25948BEa4e7';

const SEPOLIA_TESTNET_CHAIN_ID = 11155111;

function unixToDateTime(unixTimestamp) {
  const monthsArr = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const date = new Date(unixTimestamp * 1000);
  const dd = date.getDate();
  const mmm = monthsArr[date.getMonth()];
  const yyyy = date.getFullYear();
  const h = date.getHours();
  const m = date.getMinutes();
  const s = date.getSeconds();
  return `${dd}-${mmm}-${yyyy}, ${String(h).padStart(2, '0')}:${String(
    m
  ).padStart(2, '0')}:${String(s).padStart(2, '0')} UTC +5:30`;
}

export default function LotteryEntrance() {
  const [recentWinner, setRecentWinner] = useState('');
  const [recentWinnerDisp, setRecentWinnerDisp] = useState('Fetching...');
  const [entryFee, setEntryFee] = useState('Fetching...');
  const [playerCount, setPlayerCount] = useState('Fetching...');
  const [raffleState, setRaffleState] = useState('Fetching...');
  const [lastTimestamp, setLastTimestamp] = useState('Fetching...');
  const [startTimestamp, setStartTimestamp] = useState('Fetching...');
  const [unixStartTimestamp, setUnixStartTimestamp] = useState(0);
  // const [timeLeft, setTimeLeft] = useState(300)
  const { isWeb3Enabled } = useMoralis();

  const [msg, setMsg] = useState('');
  const enterBtn = useRef(null);

  const switchToSepolia = async () => {
    try {
      await window?.ethereum?.request({
        method: 'wallet_switchEthereumChain',
        params: [
          {
            chainId: `0x${SEPOLIA_TESTNET_CHAIN_ID.toString(16)}`,
          },
        ],
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await window?.ethereum?.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${SEPOLIA_TESTNET_CHAIN_ID.toString(16)}`,
                chainName: 'Sepolia Testnet',
                nativeCurrency: {
                  name: 'Ether',
                  symbol: 'ETH',
                  decimals: 18,
                },
                rpcUrls: [
                  'https://ethereum-sepolia.blockpi.network/v1/rpc/public',
                ],
                blockExplorerUrls: ['https://sepolia.etherscan.io/'],
              },
            ],
          });
        } catch (addError) {
          console.error(addError);
        }
      }
    }
  };

  useEffect(() => {
    console.log(`0x${SEPOLIA_TESTNET_CHAIN_ID.toString(16)}`);
    if (
      window?.ethereum?.chainId !== `0x${SEPOLIA_TESTNET_CHAIN_ID.toString(16)}`
    ) {
      switchToSepolia();
    }
  }, [window?.ethereum?.chainId]);

  // Enter Lottery Button
  const { runContractFunction: enterRaffle } = useWeb3Contract({
    abi: raffleAbi,
    contractAddress: CONTRACT_ADDRESS,
    functionName: 'enterRaffle',
    msgValue: '10000000000000000',
    params: {},
  });

  // View Functions
  const { runContractFunction: getRecentWinner } = useWeb3Contract({
    abi: raffleAbi,
    contractAddress: CONTRACT_ADDRESS,
    functionName: 'getRecentWinner',
    params: {},
  });

  const mediaHandler = (val) => {
    if (window.innerWidth < 795) {
      setRecentWinnerDisp(`${val?.slice(0, 23)}...`);
    } else {
      setRecentWinnerDisp(val);
    }
  };

  const { runContractFunction: getEntranceFee } = useWeb3Contract({
    abi: raffleAbi,
    contractAddress: CONTRACT_ADDRESS,
    functionName: 'getEntranceFee',
    params: {},
  });

  const { runContractFunction: getPlayerCount } = useWeb3Contract({
    abi: raffleAbi,
    contractAddress: CONTRACT_ADDRESS,
    functionName: 'getNumberOfPlayers',
    params: {},
  });

  const { runContractFunction: getRaffleState } = useWeb3Contract({
    abi: raffleAbi,
    contractAddress: CONTRACT_ADDRESS,
    functionName: 'getRaffleState',
    params: {},
  });

  const { runContractFunction: getLastTimestamp } = useWeb3Contract({
    abi: raffleAbi,
    contractAddress: CONTRACT_ADDRESS,
    functionName: 'getLastTimeStamp',
    params: {},
  });

  const { runContractFunction: getStartTimestamp } = useWeb3Contract({
    abi: raffleAbi,
    contractAddress: CONTRACT_ADDRESS,
    functionName: 'getRaffleStartTimestamp',
    params: {},
  });

  async function updateUi() {
    // console.log(ethereum.selectedAddress)

    let account = ethereum.selectedAddress;
    setMsg(
      `Hello ${account.slice(0, 9)}...${account.slice(
        account.length - 9,
        account.length - 1
      )}. Welcome to Ethereum Raffle.`
    );

    console.log(enterBtn.current.disabled);

    let recentWinnerFromCall = await getRecentWinner();
    setRecentWinner(recentWinnerFromCall);
    mediaHandler(recentWinnerFromCall);

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
      ? setRaffleState('Open')
      : setRaffleState('Closed');
    if (raffleStateFromCall != 0) {
      enterBtn.current.disabled = true;
    }
    console.log(raffleStateFromCall);

    let lastTimstampFromCall = await getLastTimestamp();
    const unixTimestamp1 = parseInt(lastTimstampFromCall._hex, 16);
    setLastTimestamp(unixToDateTime(unixTimestamp1));

    let startTimestampFromCall = await getStartTimestamp();
    console.log(startTimestampFromCall);
    const unixTimestamp2 = parseInt(startTimestampFromCall._hex, 16);
    setUnixStartTimestamp(unixTimestamp2);
    setStartTimestamp(unixToDateTime(unixTimestamp2));
  }

  useEffect(() => {
    if (
      isWeb3Enabled &&
      window?.ethereum?.chainId === `0x${SEPOLIA_TESTNET_CHAIN_ID.toString(16)}`
    ) {
      updateUi();
    }
  }, [isWeb3Enabled, window?.ethereum?.chainId]);

  // useEffect(() => {
  //   console.log(unixStartTimestamp + 300 * 1000)
  //   if (Date.now() < unixStartTimestamp + 300 * 1000 && timeLeft > 0) {
  //     setTimeout(() => {}, 1000)
  //     getRaffleState().then((state) => {
  //       state == 0
  //       ? setRaffleState('Open')
  //       : setRaffleState('Closed')
  //     })
  //     setTimeLeft(timeLeft - 1)
  //     console.log('in')
  //   }
  //   console.log('out')
  // }, [playerCount, timeLeft])

  window.addEventListener('resize', () => {
    mediaHandler(recentWinner);
  });

  const handleEnterRaffle = async () => {
    try {
      if ((await getRaffleState()) == 1) {
        console.log(
          Math.floor(Date.now() / 1000),
          parseInt((await getStartTimestamp())._hex, 16)
        );
        const tx = await enterRaffle();
        const res = await tx.wait();
        await updateUi();
        let timeElapsed =
          Math.floor(Date.now() / 1000) -
          parseInt((await getStartTimestamp())._hex, 16);
        console.log(timeElapsed);
        setMsg(
          `Successfully entered raffle!!! Raffle will remain open for ${
            300 - timeElapsed
          } seconds.`
        );
        // for(let i=45; i>=0; i--) {
        //   setTimeout(async() => {}, 1000)
        // }
        // setMsg('You can enter now!!')
      } else {
        setMsg('Raffle is no longer open. Calculating results.');
        await updateUi();
        return;
      }
    } catch (error) {
      console.log(error.message);
      setMsg('Could not enter raffle successfully. Please try again.');
      return;
    }
  };

  // prettier-ignore
  return (
    <div className={styles.main__body}><br/>
      <br />
      <br />
      <div className={styles.info__section}>
      <div className={styles.content__box}>
      <div>Raffle Entry Fee: <span className={styles.spl__text}>{entryFee}</span></div>
      <br />
      {/* <div>Contract Address: <a className={styles.link} href="https://goerli.etherscan.io/address/0x530c3072935ceff646c0e9db5b0c5e4fff2183f0" target="_blank" rel="noopener noreferrer" color="blue">0x530c3072935cefF646c0E9Db5B0C5E4FFF2183f0</a></div> */}
      <div>Current Participation Count: <span className={styles.spl__text}>{playerCount}</span></div>
      <br />
      <div>Raffle State: <span className={styles.spl__text}>{raffleState}</span></div>
      <br />
      <div>Most Recent Raffle Starting Time: <span className={styles.spl__text}>{startTimestamp}</span></div>
      <br/>
      <div>Most Recent Winner: <span className={styles.spl__text}><a
          className={styles.link}
          href={`https://goerli.etherscan.io/address/${recentWinner}`}
          target="_blank"
          rel="noopener noreferrer"
        >{recentWinnerDisp}</a></span></div><br/>
      <div>Most Recent Win Time: <span className={styles.spl__text}>{lastTimestamp}</span></div>
      </div>
      <div className={styles.content__box}>
      <p>{msg}</p>
      <button
       ref={enterBtn}
        className={styles.enter__btn}
        onClick={handleEnterRaffle}
      >
        Enter Raffle
      </button>
      </div>
      </div>
    </div>
  );
}
