import { expect } from "chai";
import { ethers } from "hardhat";

describe("ProofRegistry", function () {
  let proofRegistry: any;
  let owner: any;
  let addr1: any;
  
  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();
    
    const ProofRegistry = await ethers.getContractFactory("ProofRegistry");
    proofRegistry = await ProofRegistry.deploy();
    await proofRegistry.waitForDeployment();
  });
  
  it("Should get mock FTSO price", async function () {
    const [usdPriceE6, ftsoRoundId, requiredFLR] = await proofRegistry.getCurrentFTSOPrice();
    expect(usdPriceE6).to.equal(23456);
    expect(ftsoRoundId).to.equal(1234567);
    expect(requiredFLR).to.be.gt(0);
  });
  
  it("Should register certificate", async function () {
    const contentHash = ethers.keccak256(ethers.toUtf8Bytes("test"));
    const [, , requiredFLR] = await proofRegistry.getCurrentFTSOPrice();
    
    await expect(
      proofRegistry.connect(addr1).registerCertificate(contentHash, "CAMERA", {
        value: requiredFLR
      })
    ).to.emit(proofRegistry, "CertificateCreated");
  });
});
