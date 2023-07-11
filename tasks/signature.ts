import { task } from "hardhat/config";
import { ethers } from "hardhat";

task("splitsig", "Split signature into v, r and s")
  .addPositionalParam("signature","The signature to split")
  .setAction(async (taskArgs, { ethers }) => {
      let sig = ethers.utils.splitSignature(
        taskArgs.signature
      )
      console.log(`r: ${sig.r} \ns: ${sig.s} \nv: ${sig.v}`);
});

task("hashmsg", "Derive hashed message from address, type and score")
  .addPositionalParam("user","The address of the user")
  .addPositionalParam("type","The game mode type")
  .addPositionalParam("score","The score of the user")
  .setAction(async (taskArgs, { ethers }) => {
    let hashedMsg = ethers.utils.solidityKeccak256(
          ['address','uint256','uint256'],
          [taskArgs.user,parseInt(taskArgs.type),parseInt(taskArgs.score)]
    );
    
    console.log(hashedMsg);
});