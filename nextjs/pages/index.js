import styles from '../styles/Home.module.css';
import Head from 'next/head';
import Header from '../components/header/Header';
import { ConnectButton } from 'web3uikit';
import LotteryEntrance from '../components/lottery/Lottery';
import { useMoralis } from 'react-moralis';

// export { styles };

export default function Home() {
  const { isWeb3Enabled } = useMoralis();
  return (
    <div className={styles.container}>
      <Head>
        <title>Ethereum Raffle DApp</title>
        <link
          rel="icon"
          href="https://cdn-icons-png.flaticon.com/512/3531/3531226.png"
        />
      </Head>
      <nav className="p-5 border-b-2 flex flex-row">
        <div className={styles.header}>
          <Header />
        </div>
        <div className="ml-auto py-2 px-4">
          <ConnectButton moraLisAuth={false} />
        </div>
        <br />
      </nav>
      <div className="ml-auto">
        Contract Address: &nbsp;
        <a
          className={styles.link}
          href="https://sepolia.etherscan.io/address/0xeD5F7D3B8bDe22c8dCcAcEF86ADBc25948BEa4e7"
          target="_blank"
          rel="noopener noreferrer"
        >
          0xeD5F7D3B8bDe22c8dCcAcEF86ADBc25948BEa4e7
        </a>
      </div>
      <br />
      <br />
      {isWeb3Enabled ? (
        <>
          <LotteryEntrance />
        </>
      ) : (
        <div>No Metamask Detected</div>
      )}
    </div>
  );
}
