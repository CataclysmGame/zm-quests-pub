import { task } from "hardhat/config";
import { ethers } from "hardhat";

task("supply", "Get total supply for a specific type")
  .addPositionalParam("type","The game mode")
  .setAction(async (taskArgs, { ethers }) => {
    const accounts = await ethers.getSigners()
    const ZeroMissionBadges = await ethers.getContractFactory("ZeroMissionBadges");
    const contract = ZeroMissionBadges.attach(
      process.env.CONTRACT_ADDRESS!
    );

      console.log((await contract.totalSupply(taskArgs.type)).toNumber());

});