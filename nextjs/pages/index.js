import Head from "next/head";
import styles from "../styles/Home.module.css";
import Header from "../components/header";
import { ConnectButton } from "web3uikit";
import LotteryEntrance from "../components/lottery";
import { useMoralis } from "react-moralis";

// export { styles };

export default function Home() {
  const { isWeb3Enabled } = useMoralis();
  return (
    <div className={styles.container}>
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
          href="https://goerli.etherscan.io/address/0x530c3072935ceff646c0e9db5b0c5e4fff2183f0"
          target="_blank"
          rel="noopener noreferrer"
          color="blue"
        >
          0x530c3072935cefF646c0E9Db5B0C5E4FFF2183f0
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
