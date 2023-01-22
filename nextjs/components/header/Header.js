import { ConnectButton } from "web3uikit";

export default function Header() {
  return (
    // <nav className="p-5 border-b-2 flex flex-row">
    <div>
      <h1 className="py-4 px-4 font-bold text-3xl">Decentralized Raffle</h1>
      <br />
      {/* <div className="ml-auto py-2 px-4">
        <ConnectButton moraLisAuth={false} />
      </div> */}
    </div>

    // </nav>
  );
}
