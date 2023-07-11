import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { deployContracts } from "./fixtures";
import { BigNumber} from "@ethersproject/bignumber";


describe("ZeroMissionBadges", function () {

  it("Tokens shouldn't be transferable", async function () {

    const {badges,signer} = await loadFixture(deployContracts);
    const [owner,addr1] = await ethers.getSigners();

    const score = 10;

    for(var i=0; i<2; i++){

      let hashedMsg = ethers.utils.solidityKeccak256(
        ['address','uint256','uint256'],
        [addr1.address,i,score]
      );
  
      let fullSig = await signer.signMessage(ethers.utils.arrayify(hashedMsg));
      let sig = ethers.utils.splitSignature(fullSig);
  
      let mintTx = await badges.connect(addr1).mint(i,score,sig.v,sig.r,sig.s,[]);
      await mintTx.wait();
  
      expect(await badges.balanceOf(addr1.address,0)).to.eql(BigNumber.from(1));
      
      expect(badges.safeTransferFrom(addr1.address,owner.address,i,1,[])).to.be.reverted;
      expect(badges.safeBatchTransferFrom(addr1.address,owner.address,[i],[1],[])).to.be.reverted;

    }

  });

  it("Users shouldn't be able to mint more than one token per type", async function () {

    const {badges,signer} = await loadFixture(deployContracts);
    const [owner,addr1] = await ethers.getSigners();

    const score = 10;

    let hashedMsg1 = ethers.utils.solidityKeccak256(
      ['address','uint256','uint256'],
      [addr1.address,0,score]
    );

    let fullSig1 = await signer.signMessage(ethers.utils.arrayify(hashedMsg1));
    let sig1 = ethers.utils.splitSignature(fullSig1);

    let mintTx1 = await badges.connect(addr1).mint(0,score,sig1.v,sig1.r,sig1.s,[]);
    await mintTx1.wait();

    let hashedMsg2 = ethers.utils.solidityKeccak256(
      ['address','uint256','uint256'],
      [addr1.address,1,score]
    );

    let fullSig2 = await signer.signMessage(ethers.utils.arrayify(hashedMsg2));
    let sig2 = ethers.utils.splitSignature(fullSig2);

    let mintTx2 = await badges.connect(addr1).mint(1,score,sig2.v,sig2.r,sig2.s,[]);
    await mintTx2.wait();

    let hashedMsg3 = ethers.utils.solidityKeccak256(
      ['address','uint256','uint256'],
      [addr1.address,0,score]
    );

    let fullSig3 = await signer.signMessage(ethers.utils.arrayify(hashedMsg3));
    let sig3 = ethers.utils.splitSignature(fullSig3);

    let hashedMsg4 = ethers.utils.solidityKeccak256(
      ['address','uint256','uint256'],
      [addr1.address,1,score]
    );

    let fullSig4 = await signer.signMessage(ethers.utils.arrayify(hashedMsg4));
    let sig4 = ethers.utils.splitSignature(fullSig4);

    expect(badges.mint(0,score,sig3.v,sig3.r,sig3.s,[])).to.be.reverted;
    expect(badges.mint(1,score,sig3.v,sig3.r,sig3.s,[])).to.be.reverted;

  });

})