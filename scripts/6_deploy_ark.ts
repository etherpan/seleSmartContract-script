import { ethers } from "hardhat";
import dotenv from 'dotenv'
import { BigNumber } from "ethers";

dotenv.config();

async function main() {
  const [owner] = await ethers.getSigners();
  console.log("Deploying contracts with the account: ", owner.address);
  console.log("Account balance: ", (await owner.getBalance()).toString());

  // deploy the ARK contract
  const ARK = await ethers.getContractFactory("SynergyARK");
  const ark = await ARK.deploy();

  await ark.deployed();
  console.log(`ARK contract deployed at ${ark.address}`);


  // deploy the Treasury contract
  const Crystal = await ethers.getContractFactory("Crystals");
  const crystal = await Crystal.attach(<string> process.env.CRYSTAL);

  const Diamond = await ethers.getContractFactory("Diamonds");
  const diamond = await Diamond.attach(<string> process.env.DIAMOND);

  const oracle = <string> process.env.ORACLE;
  const startTime = BigNumber.from(process.env.ARK_START_TIMESTAMP);

  const Treasury = await ethers.getContractFactory("Treasury");
  const treasury = await Treasury.deploy();

  await treasury.deployed();
  console.log(`Treasury contract deployed at ${treasury.address}`);

  // initialize ark
  await ark.initialize(crystal.address, diamond.address, treasury.address);
  console.log(`ARK is initialized`);

  // initialize treasury
  await treasury.initialize(crystal.address, diamond.address, oracle, ark.address, startTime);
  console.log(`Treasury is initialized`);

  // transfer operator to treasury
  await crystal.transferOperator(treasury.address);
  console.log(`Crystal's operator transferred to Treasury`);

  await diamond.transferOperator(treasury.address);
  console.log(`Diamond's operator transferred to Treasury`);

  await ark.transferOperator(treasury.address);
  console.log(`ARK's operator transferred to Treasury`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
