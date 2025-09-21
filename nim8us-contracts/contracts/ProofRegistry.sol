// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

interface IFtsoRegistry {
    function getCurrentPriceWithDecimals(string memory _symbol) 
        external view returns (uint256 _price, uint256 _timestamp, uint256 _decimals);
    function getFtso(uint256 _ftsoIndex) external view returns (address);
    function getFtsoIndex(string memory _symbol) external view returns (uint256);
}

interface IFtso {
    function getCurrentEpochId() external view returns (uint256);
}

contract ProofRegistry is Ownable, ReentrancyGuard {
    struct Certificate {
        bytes32 contentHash;
        address publisher;
        string method;
        uint256 timestamp;
        uint256 ftsoRoundId;
        uint256 usdPriceE6;
        bool revoked;
        string revokeReason;
        bytes32 replacementProofId;
    }
    
    mapping(bytes32 => Certificate) public certificates;
    mapping(bytes32 => bool) public contentExists;
    
    // Mock FTSO for demo
    uint256 public constant CERT_FEE_USD_E6 = 10000; // $0.01
    uint256 public mockUsdPrice = 23456; // $0.023456
    uint256 public mockFtsoRound = 1234567;
    
    event CertificateCreated(
        bytes32 indexed proofId,
        bytes32 indexed contentHash,
        address indexed publisher,
        string method,
        uint256 ftsoRoundId,
        uint256 usdPriceE6
    );
    
    event CertificateRevoked(
        bytes32 indexed proofId,
        string reason,
        bytes32 replacementProofId
    );
    
    // Mock FTSO data for demo
    function getCurrentFTSOPrice() public view returns (
        uint256 usdPriceE6,
        uint256 ftsoRoundId,
        uint256 requiredFLR
    ) {
        usdPriceE6 = mockUsdPrice;
        ftsoRoundId = mockFtsoRound;
        requiredFLR = (CERT_FEE_USD_E6 * 1e18) / usdPriceE6; // ~0.43 FLR
    }
    
    function registerCertificate(
        bytes32 contentHash,
        string memory method
    ) external payable nonReentrant {
        require(!contentExists[contentHash], "Content already certified");
        require(bytes(method).length > 0, "Method cannot be empty");
        
        (uint256 usdPriceE6, uint256 ftsoRoundId, uint256 requiredFLR) = getCurrentFTSOPrice();
        require(msg.value >= requiredFLR, "Insufficient payment");
        
        bytes32 proofId = keccak256(abi.encodePacked(
            contentHash,
            msg.sender,
            block.timestamp,
            ftsoRoundId
        ));
        
        certificates[proofId] = Certificate({
            contentHash: contentHash,
            publisher: msg.sender,
            method: method,
            timestamp: block.timestamp,
            ftsoRoundId: ftsoRoundId,
            usdPriceE6: usdPriceE6,
            revoked: false,
            revokeReason: "",
            replacementProofId: 0
        });
        
        contentExists[contentHash] = true;
        
        emit CertificateCreated(
            proofId,
            contentHash,
            msg.sender,
            method,
            ftsoRoundId,
            usdPriceE6
        );
        
        // Refund excess payment
        if (msg.value > requiredFLR) {
            payable(msg.sender).transfer(msg.value - requiredFLR);
        }
    }
    
    function revokeCertificate(
        bytes32 proofId,
        string memory reason,
        bytes32 replacementProofId
    ) external {
        Certificate storage cert = certificates[proofId];
        require(cert.publisher == msg.sender, "Only publisher can revoke");
        require(!cert.revoked, "Already revoked");
        
        cert.revoked = true;
        cert.revokeReason = reason;
        cert.replacementProofId = replacementProofId;
        
        emit CertificateRevoked(proofId, reason, replacementProofId);
    }
    
    function getCertificate(bytes32 proofId) external view returns (Certificate memory) {
        return certificates[proofId];
    }
    
    // Demo helper: Update mock prices
    function updateMockPrice(uint256 newPrice, uint256 newRound) external onlyOwner {
        mockUsdPrice = newPrice;
        mockFtsoRound = newRound;
    }
}
