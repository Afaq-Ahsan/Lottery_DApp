import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BuyLottery = ({ state, account }) => {
  const [showButton, setShowButton] = useState();
  const [LotteryDone, setLotteryDone] = useState(false);
  const [Winner,setWinners] = useState(0);
  let Winners = 0;

  const [participants, setParticipants] = useState(() => {
    const storedParticipants = sessionStorage.getItem("participants");
    return storedParticipants ? parseInt(storedParticipants) : 0;
  });

  useEffect(() => {
    sessionStorage.setItem("participants", participants.toString());
  }, [participants]);

  useEffect(() => {
    // Function to handle the specific situation
    const handleSituation = () => {
      // Perform necessary checks or conditions
      // Example: If a condition is met, show the button

      if (
        String(account).toLowerCase() ===
        "0x5d0fdbed4b983508436cb24807523558d2b6d851".toLowerCase()
      ) {
        console.log("Owner's account");
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    // Call the handleSituation function
    handleSituation();
  }, [account]); // Specify [account] as the dependency array

  const buyTicket = async () => {
    try {
      const contract = state.contract;
      console.log(contract);
      const amount = { value: ethers.utils.parseEther("0.000000000000000001") };
      const transaction = await contract.BuyLottery(amount);
      await transaction.wait();
      toast.success("Transaction confirmed!");
      setParticipants((prevParticipants) => prevParticipants + 1);
    } catch (error) {
      console.log(error);
      toast.error("Transaction failed");
    }
  };

  const WinnerIs = async () => {
    try {
      const contract = state.contract;
      console.log(contract);
      const result = await contract.choose_winner();
      await result.wait();
      console.log("resulttttt is : ", result);
      toast.success("Transaction confirmed!");
      console.log("winner is : ", result[0]);
      console.log("Amount is : ", result[1]);
      setLotteryDone(true);
      setParticipants(0);
    } catch (error) {
      console.log(error);
      toast.error("Transaction failed");
      setLotteryDone(false);
    }
  };

  useEffect(() => {
    const fetchWinners = async () => {
      const contract = state.contract;
      try {
        const Winners = await contract.Winners_Count();
        console.log("current winner is : ", parseInt(Winners, 16));            
        // Update the state with the fetched winners
        setWinners(parseInt(Winners, 16))
      } catch (error) {
        console.log(error);
      }
    };
    fetchWinners();
  });

  return (
    <>
      <form onSubmit={(e) => e.preventDefault()}>
        <span
          className="badge bg-success"
          style={{
            marginLeft: "0px",
            marginTop: "80px",
            float: "left",
            display: "flex",
          }}
        >
          Lotteries So Far: {Winner}
        </span>

        <button
          style={{ marginLeft: "65px", marginTop: "380px" }}
          className="btn btn-outline-warning"
          onClick={() => buyTicket()}
        >
          Buy Lottery
        </button>
        {showButton && (
          <button
            style={{ marginLeft: "10px", marginTop: "380px" }}
            className="btn btn-outline-warning"
            onClick={() => WinnerIs()}
          >
            Winner
          </button>
        )}
      </form>

      <ToastContainer />
      <span
        className="badge bg-danger"
        style={{ marginLeft: "185px", marginTop: "20px" }}
      >
        Current Lottery Participants: {participants}
      </span>
    </>
  );
};

export default BuyLottery;
