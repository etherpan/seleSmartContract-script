import { ethers } from "hardhat";
import dotenv from 'dotenv'
import { BigNumber } from "ethers";

dotenv.config();

async function main() {
  const [owner] = await ethers.getSigners();
  console.log("Deploying contracts with the account: ", owner.address);
  console.log("Account balance: ", (await owner.getBalance()).toString());

  // attach $CRS token
  const Crystal = await ethers.getContractFactory("Crystals");
  const crystal = await Crystal.attach(<string> process.env.CRYSTAL);

  // deploy the Genesis Pool contract
  const startTime = BigNumber.from(process.env.GPOOL_START_TIMESTAMP);
  const taxAddress= <string> process.env.SYNERGY_TREASURY;
  const GPool = await ethers.getContractFactory("GenesisRewardPool");
  const genesisPool = await GPool.deploy(crystal.address, startTime, taxAddress);

  await genesisPool.deployed();
  console.log(`Genesis Pool contract deployed at ${genesisPool.address}`);

  // Distribute $CRS to Genesis Pool contract
  await crystal.distributeReward(genesisPool.address, <string> process.env.SYNERGY_TREASURY);
  console.log(`$CRS reward is distributed to GPool ${genesisPool.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
