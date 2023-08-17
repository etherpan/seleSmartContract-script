import { ethers } from "hardhat";
import dotenv from 'dotenv'
import { BigNumber } from "ethers";

dotenv.config();

async function main() {
  const [owner] = await ethers.getSigners();
  console.log("Deploying contracts with the account: ", owner.address);
  console.log("Account balance: ", (await owner.getBalance()).toString());

  // attach $DIA token
  const Diamond = await ethers.getContractFactory("Diamonds");
  const diamond = await Diamond.attach(<string> process.env.DIAMOND);

  // deploy the DIARewardPool contract
  const farmStartTime = BigNumber.from(process.env.FARM_START_TIMESTAMP);
  const DiaPool = await ethers.getContractFactory("DIARewardPool");
  const diaPool = await DiaPool.deploy(diamond.address, farmStartTime, <string> process.env.SYNERGY_TREASURY);

  await diaPool.deployed();
  console.log(`DIARewardPool contract deployed at ${diaPool.address}`);

  // Distribute $DIA to Farm contract
  await diamond.distributeReward(diaPool.address);
  console.log(`$DIA reward is distributed to Farm ${diaPool.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
