import { task } from "hardhat/config";
import { ethers } from "hardhat";

task("threshold", "Set threshold for a specific type")
  .addPositionalParam("type","The game mode")
  .addPositionalParam("threshold","The threshold to set")
  .setAction(async (taskArgs, { ethers }) => {
    const accounts = await ethers.getSigners()
    const ZeroMissionBadges = await ethers.getContractFactory("ZeroMissionBadges");
    const contract = ZeroMissionBadges.attach(
      process.env.CONTRACT_ADDRESS!
    );

    if(taskArgs.type == 0){
      let tx1 = await contract.setThreshold(0,process.env.ARCADE_THRESHOLD!);
      await tx1.wait();
      console.log(`Arcade threshold set with tx:${tx1.hash}`);
    } else {
      let tx2 = await contract.setThreshold(1,process.env.ENDLESS_THRESHOLD!);
      await tx2.wait();
      console.log(`Endless threshold set with tx:${tx2.hash}`);
    }

});