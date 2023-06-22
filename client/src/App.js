import abi from "./contract/Lottery.json";
import { useState } from "react";
import { ethers } from "ethers";
import "./App.css";
import BuyLottery from "./BuyLottery";

function App() {
  const [state, setState] = useState({
    provider: null,
    signer: null,
    contract: null,
  });
  const [account, setAccount] = useState("");

  const connectWallet = async () => {
    const contractAddress = "0xb37d12AF3d9662e6648bE181f737eE8B745ab9B9";
    const contractABI = abi.abi;
    try {
      const { ethereum } = window;

      if (ethereum) {
        const account = await ethereum.request({
          method: "eth_requestAccounts",
        });

        window.ethereum.on("chainChanged", () => {
          window.location.reload();
        });

        window.ethereum.on("accountsChanged", () => {
          window.location.reload();
        });

        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        setAccount(account);
        setState({ provider, signer, contract });
      } else {
        alert("Please install metamask");
      }
    } catch (error) {
      console.log(error);
    }
  };

  

  // console.log(state);
  return (
    <>
      <div
        style={{
          marginLeft: "30px",
          marginTop: "22px",
          color: "gold",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <h1>Lottery DApp</h1>
        <div
          style={{
            height: "100%",
            marginTop: "10px",
            marginRight: "20px",
          }}
        >
          {account === "" ? (
            <button className="btn btn-outline-warning" onClick={connectWallet}>
              Connect
            </button>
          ) : (
            <h6>Connected Account - {account}</h6>
          )}
        </div>
      </div>
      <BuyLottery state={state} account={account} />
    </>
  );
}
export default App;
