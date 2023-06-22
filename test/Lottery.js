const { expect } = require("chai");

describe("Lottery System", function () {
  let Lottery;
  let lottery;
  let Owner;
  let addr1;
  let addr2;
  let addr3;
  //beforeEach is a hook which is provided by mocha framework by using it these functions are call on each case
  beforeEach(async function () {
    Lottery = await ethers.getContractFactory("Lottery"); //get contract factory
    [Owner, addr1, addr2, addr3, ...addrs] = await ethers.getSigners(); //get signers it means addresses
    lottery = await Lottery.deploy(); //here we deploy our token
  });

  describe("Check Owner", function () {
    it("Should set the right Owner", async function () {
      expect(await lottery.Manager()).to.equal(Owner.address); //check is contract make the right owner
    });
  });

  describe("Buy Lottery", function () {
    it("should Buy Lottery by sending 1 Ether of amount", async function () {
      const initialBalance = await addr1.getBalance();
      console.log(initialBalance);
      const ticketPrice = ethers.utils.parseEther("1.0");
      await lottery.connect(addr1).BuyLottery({ value: ticketPrice });

      expect(await lottery.participants(0)).to.equal(addr1.address);
    });

    it("Should give error if we send amount less than 1 Ether", async function () {
      const ticketPrice = ethers.utils.parseEther("0.5");
      await expect(
        lottery.connect(addr1).BuyLottery({ value: ticketPrice })
      ).to.be.revertedWith("minimum entry price is one ether");
    });

    it("Should give error if we send amount greater than 1 Ether", async function () {
      const ticketPrice = ethers.utils.parseEther("2.0");
      await expect(
        lottery.connect(addr1).BuyLottery({ value: ticketPrice })
      ).to.be.revertedWith("minimum entry price is one ether");
    });
  });

  describe("Should Choose a winner and transfer the prize", function () {
    it("Should amount is added to the lottery system", async function () {
      const ticketPrice = ethers.utils.parseEther("1.0");
      await lottery.connect(addr1).BuyLottery({ value: ticketPrice });
      await lottery.connect(addr2).BuyLottery({ value: ticketPrice });
      const balance = await lottery.connect(Owner).getBalance();

      expect(balance).to.equal(ethers.utils.parseEther("2.0")); //check is contract make the right owner
    });

    it("Should have atleast 3 Lottery holders to start lottery", async function () {
      const ticketPrice = ethers.utils.parseEther("1.0");
      await lottery.connect(addr1).BuyLottery({ value: ticketPrice });
      await lottery.connect(addr2).BuyLottery({ value: ticketPrice });

      await expect(lottery.connect(Owner).choose_winner()).to.be.revertedWith(
        "you can only choose winner after 3 members"
      );
    });
  });

  it("Should the price is equal to the total number of lottery holders", async function () {
    // Here we are buying tickets from 3 accounts
    const ticketPrice = ethers.utils.parseEther("1.0");
    await lottery.connect(addr1).BuyLottery({ value: ticketPrice });
    await lottery.connect(addr2).BuyLottery({ value: ticketPrice });
    await lottery.connect(addr3).BuyLottery({ value: ticketPrice });
    const Contractbalance = await lottery.connect(Owner).getBalance();
    // Call the choose_winner function as the owner
    await lottery.connect(Owner).choose_winner();
    const afterContractbalance = await lottery.connect(Owner).getBalance();

    // Assert that the owner's balance has increased by the total prize amount
    const prizeAmount = ticketPrice.mul(3); // Assuming 2 players bought tickets
    expect(Contractbalance).to.equal(prizeAmount);
  });

  it("Should prize is transffered from lottery system", async function () {
    const ticketPrice = ethers.utils.parseEther("1.0");
    await lottery.connect(addr1).BuyLottery({ value: ticketPrice });
    await lottery.connect(addr2).BuyLottery({ value: ticketPrice });
    await lottery.connect(addr3).BuyLottery({ value: ticketPrice });
    const Contractbalance = await lottery.connect(Owner).getBalance();
    console.log(Contractbalance);
    // Call the choose_winner function as the owner
    await lottery.connect(Owner).choose_winner();
    const afterContractbalance = await lottery.connect(Owner).getBalance();
    // Assert that the owner's balance has increased by the total prize amount
    expect(afterContractbalance).to.equal(0);
  });

  it("Should transfer prize to the Winner", async function () {
    const ticketPrice = ethers.utils.parseEther("1.0");

    await lottery.connect(addr1).BuyLottery({ value: ticketPrice });
    await lottery.connect(addr2).BuyLottery({ value: ticketPrice });
    await lottery.connect(addr3).BuyLottery({ value: ticketPrice });

    const addr1Balance = await addr1.getBalance();
    const addr2Balance = await addr2.getBalance();
    const addr3Balance = await addr3.getBalance();

    const participants = [addr1, addr2, addr3];

    // Call the choose_winner function as the owner
    await lottery.connect(Owner).choose_winner();

    const afterAddr1Balance = await addr1.getBalance();
    const afterAddr2Balance = await addr2.getBalance();
    const afterAddr3Balance = await addr3.getBalance();

    let actualWinnerBalance;
    for (let i = 0; i < participants.length; i++) {
      const participant = participants[i];
      const initialBalance =
        i === 0 ? addr1Balance : i === 1 ? addr2Balance : addr3Balance;
      const afterBalance =
        i === 0
          ? afterAddr1Balance
          : i === 1
          ? afterAddr2Balance
          : afterAddr3Balance;

      if (afterBalance.gt(initialBalance)) {
        actualWinnerBalance = afterBalance.sub(initialBalance);
        break;
      }
    }

    // Assert that the winner's balance has increased by the total prize amount
    expect(actualWinnerBalance).to.equal(ethers.utils.parseEther("3.0"));
  });
});
