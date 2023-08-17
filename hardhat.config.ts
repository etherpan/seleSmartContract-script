import * as dotenv from 'dotenv'
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-etherscan";

dotenv.config();
const privateKey = process.env.PRIVATE_KEY;

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.17",
        settings: {
          optimizer: {
            enabled: true,
          },
        },
      },
      {
        version: "0.6.12",
        settings: {
          optimizer: {
            enabled: true,
          },
        },
      },
    ]
  },
  networks: {
    mainnet: {
      url: process.env.MAINNET_RPC,
      chainId: 56,
      accounts: privateKey !== undefined ? [privateKey] : []
    },
    testnet: {
      url: process.env.TESTNET_RPC,
      chainId: 97,
      accounts: privateKey !== undefined ? [privateKey] : []
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  etherscan: {
    apiKey: process.env.API_KEY
  }
};

export default config;
