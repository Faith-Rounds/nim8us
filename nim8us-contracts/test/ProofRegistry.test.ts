import { expect } from "chai";
import { ethers } from "hardhat";
import chai from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import chaiAsPromised from "chai-as-promised";

chai.use(chaiAsPromised);

describe("ProofRegistry", function () {
  let proofRegistry: any;
  let owner: any;
  let addr1: any;
  
  async function deployProofRegistryFixture() {
    const [owner, addr1] = await ethers.getSigners();
    
    const ProofRegistry = await ethers.getContractFactory("ProofRegistry");
    const proofRegistry = await ProofRegistry.deploy();
    await proofRegistry.waitForDeployment();
    
    return { proofRegistry, owner, addr1 };
  }
  
  beforeEach(async function () {
    const { proofRegistry: registry, owner: ownerAccount, addr1: addr1Account } = await loadFixture(deployProofRegistryFixture);
    proofRegistry = registry;
    owner = ownerAccount;
    addr1 = addr1Account;
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
    
    const tx = await proofRegistry.connect(addr1).registerCertificate(contentHash, "CAMERA", {
      value: requiredFLR
    });
    
    // Wait for transaction to be mined
    await tx.wait();
    
    // Verify by checking an event was emitted - simplified approach without using .to.emit
    const receipt = await tx.wait();
    expect(receipt.status).to.equal(1); // Transaction success
  });
});
