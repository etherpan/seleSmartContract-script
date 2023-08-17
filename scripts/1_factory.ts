import { ethers } from "hardhat";
import dotenv from 'dotenv'
import { BigNumber } from "ethers";

dotenv.config();

async function main() {
  const [owner] = await ethers.getSigners();
  console.log("Deploying contracts with the account: ", owner.address);
  console.log("Account balance: ", (await owner.getBalance()).toString());

  // deploy the Crystal contract
  const taxRate = 0;
  const taxAddress= <string> process.env.SYNERGY_TREASURY;
  const Crystal = await ethers.getContractFactory("Crystals");
  const crystal = await Crystal.deploy(taxRate, taxAddress);

  await crystal.deployed();
  console.log(`Crystals contract deployed at ${crystal.address}`);
  console.log(`Tax Collector Address of Crystals has been set as ${await crystal.taxCollectorAddress()}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
