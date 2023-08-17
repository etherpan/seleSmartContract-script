import { ethers } from "hardhat";
import dotenv from 'dotenv'
import { BigNumber } from "ethers";

dotenv.config();

async function main() {
  const [owner] = await ethers.getSigners();
  console.log("Deploying contracts with the account: ", owner.address);
  console.log("Account balance: ", (await owner.getBalance()).toString());

  // deploy the Diamond contract
  const startTime = BigNumber.from(process.env.FARM_START_TIMESTAMP);
  const teamAddress = <string> process.env.SYNERGY_TEAM;
  const treasuryAddress = <string> process.env.SYNERGY_TREASURY;

  const Diamond = await ethers.getContractFactory("Diamonds");
  const diamond = await Diamond.deploy(startTime, teamAddress, treasuryAddress);

  await diamond.deployed();
  console.log(`Diamonds contract deployed at ${diamond.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
