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
    const taxAddress = <string>process.env.SYNERGY_TREASURY;
    const Crystal = await ethers.getContractFactory("Crystals");
    const crystal = await Crystal.deploy(taxRate, taxAddress);

    await crystal.deployed();
    console.log(`Crystals contract deployed at ${crystal.address}`);
    console.log(`CRS-BUSD pair is create as ${await crystal.busdPair()}`);

    // create liquidity
    const UniswapRouter = await ethers.getContractFactory("IUniswapV2Router02");
    const router = await UniswapRouter.attach(<string>process.env.ROUTER);


    // deploy the Diamond contract
    const farmStartTime = BigNumber.from(process.env.FARM_START_TIMESTAMP);
    const devAddress = <string>process.env.SYNERGY_TEAM;
    const daoAddress = <string>process.env.DAO_WALLET;
    const treasuryAddress = <string>process.env.SYNERGY_TREASURY;

    const Diamond = await ethers.getContractFactory("Diamonds");
    const diamond = await Diamond.deploy(farmStartTime, devAddress, daoAddress, treasuryAddress);

    await diamond.deployed();
    console.log(`Diamonds contract deployed at ${diamond.address}`);


    // deploy the Oracle contract
    const period = BigNumber.from(process.env.EPOCH_DURATION);
    const genesisStartTime = BigNumber.from(process.env.GPOOL_START_TIMESTAMP);
    const Oracle = await ethers.getContractFactory("Oracle");
    const oracle = await Oracle.deploy(await crystal.busdPair(), period, genesisStartTime);

    await oracle.deployed();
    console.log(`Oracle contract deployed at ${oracle.address}`);

    // set the CRS's oracle 
    await crystal.setOracle(oracle.address);
    console.log(`$CRS's oracle set as ${await crystal.oracle()}`);


    // deploy the TaxOffice contract
    const TaxOffice = await ethers.getContractFactory("TaxOffice");
    const taxOffice = await TaxOffice.deploy(crystal.address);

    await taxOffice.deployed();
    console.log(`TaxOffice contract deployed at ${taxOffice.address}`);

    // set the CRS's tax office
    await crystal.setTaxOffice(taxOffice.address);
    console.log(`$CRS's taxOffice set as ${await crystal.taxOffice()}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
