require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */

const INFURA_API_KEY =
  "https://eth-sepolia.g.alchemy.com/v2/nD0xd8CqYU6SUbwACMToQmIEbIH-HEa1";
const PRIVATE_KEY =
  "c4f3ac9854fe79e5f4e151b59f9d23e9a04caf6fd8b4c0428ffdf0dcf37164b0";

module.exports = {
  solidity: "0.8.18",

  networks: {
    sepolia: {
      url: `${INFURA_API_KEY}`,
      accounts: [`${PRIVATE_KEY}`],
    },
  },
};
