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
  const crystal = await Crystal.attach(<string>process.env.CRYSTAL);


  // deploy the Oracle contract
  const period = BigNumber.from(process.env.EPOCH_DURATION);
  const startTime = BigNumber.from(process.env.GPOOL_START_TIMESTAMP);
  const Oracle = await ethers.getContractFactory("Oracle");
  const oracle = await Oracle.deploy(await crystal.busdPair(), period, startTime);

  await oracle.deployed();
  console.log(`Oracle contract deployed at ${oracle.address}`);


  // deploy the TaxOffice contract
  const TaxOffice = await ethers.getContractFactory("TaxOffice");
  const taxOffice = await TaxOffice.deploy(crystal.address);

  await taxOffice.deployed();
  console.log(`TaxOffice contract deployed at ${taxOffice.address}`);


  // deploy the Zap contract
  const Zap = await ethers.getContractFactory("Zap");
  const zap = await Zap.deploy(<string>process.env.WBNB);

  await zap.deployed();
  console.log(`Zap contract deployed at ${zap.address}`);


  // set the Oracle and TaxOffice to $CRS
  await crystal.setOracle(oracle.address);
  console.log(`$CRS's oracle set as ${oracle.address}`);
  await crystal.setTaxOffice(taxOffice.address);
  console.log(`$CRS's taxOffice set as ${taxOffice.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
