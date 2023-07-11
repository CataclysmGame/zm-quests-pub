import { ethers } from "hardhat";


export async function deployContracts(){
    let collectionURI = "<collectionURI>";

    const [signer] = await ethers.getSigners();

    const ZeroMissionBadges = await ethers.getContractFactory("ZeroMissionBadges");
    const badges = await ZeroMissionBadges.deploy(signer.address,collectionURI);
    await badges.deployed();

    return {badges,signer}
}