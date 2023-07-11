import { task } from "hardhat/config";
import pinataSDK from '@pinata/sdk';
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

task("pin-assets", "Upload assets to ipfs")
  .setAction(async (_, { ethers }) => {
    const pinata = new pinataSDK(process.env.PINATA_KEY, process.env.PINATA_SECRET);
    const sourcePath = './assets';
    const options = {
        pinataMetadata: {
            name: 'linea-quests-metadata',
        }
    };
    try{
        let res = await pinata.pinFromFS(sourcePath, options);
        if(res){
            console.log(`CID: ${res.IpfsHash}`);
            setEnvValue('METADATA_CID',res.IpfsHash);
        }
    } catch (e){
        console.log(e);
    }
});


