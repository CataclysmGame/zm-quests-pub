import { ethers } from "hardhat";
const fs = require("fs");
const os = require("os");

function setEnvValue(key:string, value:string) {
  // read file from hdd & split if from a linebreak to a array
  const ENV_VARS = fs.readFileSync("./.env", "utf8").split(os.EOL);
  // find the env we want based on the key
  const target = ENV_VARS.indexOf(ENV_VARS.find((line:string) => {
      return line.match(new RegExp(key));
  }));
  // replace the key/value with the new value
  ENV_VARS.splice(target, 1, `${key}=${value}`);
  // write everything back to the file system
  fs.writeFileSync("./.env", ENV_VARS.join(os.EOL));
}

async function main() {

  const signer = process.env.SIGNER!;
  const metadataFolderURI = process.env.METADATA_CID!;

  const ZeroMissionBadges = await ethers.getContractFactory("ZeroMissionBadges");
  const badges = await ZeroMissionBadges.deploy(signer,metadataFolderURI);

  await badges.deployed();

  console.log(
    `ZeroMissionBadges deployed to ${badges.address}`
  );

  setEnvValue('CONTRACT_ADDRESS',badges.address);

  //set thresholds
  if(process.env.ARCADE_THRESHOLD){
    let tx1 = await badges.setThreshold(0,process.env.ARCADE_THRESHOLD);
    await tx1.wait();
    console.log(`Arcade threshold set with tx:${tx1.hash}`);
  }

  if(process.env.ENDLESS_THRESHOLD){
    let tx2 = await badges.setThreshold(1,process.env.ENDLESS_THRESHOLD!);
    await tx2.wait();
    console.log(`Endless threshold set with tx:${tx2.hash}`);
  }

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
