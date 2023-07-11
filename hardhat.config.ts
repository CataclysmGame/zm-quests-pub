import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";
import "./tasks/signature";
import "./tasks/threshold";
import "./tasks/ipfs";
import "./tasks/supply";
dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.18",
  networks: {
    linea: {
      url: process.env.RPC_URL,
      accounts: [process.env.PRIVATE_KEY ? process.env.PRIVATE_KEY : '']
    }
  },
/*   etherscan: {
    apiKey: {
      polygonMumbai: process.env.ETHERSCAN_KEY ? process.env.ETHERSCAN_KEY : ''
    }
  } */
};

export default config;
