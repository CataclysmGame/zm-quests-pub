// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

/*
 ██████╗ █████╗ ████████╗ █████╗  ██████╗██╗  ██╗   ██╗███████╗███╗   ███╗
██╔════╝██╔══██╗╚══██╔══╝██╔══██╗██╔════╝██║  ╚██╗ ██╔╝██╔════╝████╗ ████║
██║     ███████║   ██║   ███████║██║     ██║   ╚████╔╝ ███████╗██╔████╔██║
██║     ██╔══██║   ██║   ██╔══██║██║     ██║    ╚██╔╝  ╚════██║██║╚██╔╝██║
╚██████╗██║  ██║   ██║   ██║  ██║╚██████╗███████╗██║   ███████║██║ ╚═╝ ██║
 ╚═════╝╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝╚══════╝╚═╝   ╚══════╝╚═╝     ╚═╝
                                                                          */

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract ZeroMissionBadges is ERC1155, Ownable, ERC1155Supply {

    enum TokenType { ARCADE_MODE, ENDLESS_MODE }
    string public _metadataFolderURI;
    address _signer;

    mapping(TokenType => uint256) public threshold;

    constructor(address signer,string memory metadataFolderURI) ERC1155("") {
        _signer = signer;
        _metadataFolderURI = metadataFolderURI;
    }

    /**
     * @dev Set signer for message verification
     */
    function setSigner(address signer) public onlyOwner() {
        _signer = signer;
    }

    /**
     * @dev Set signer for message verification
     */
    function setThreshold(TokenType tokenType, uint256 newThreshold) public onlyOwner() {
        threshold[tokenType] = newThreshold;
    }

    /**
     * @dev Verify keccak256 hased message
     */
    function verifyMessage(bytes32 hashedMessage, uint8 v, bytes32 r, bytes32 s) public pure returns (address) {
        bytes memory prefix = "\x19Ethereum Signed Message:\n32";
        bytes32 prefixedHashMessage = keccak256(abi.encodePacked(prefix, hashedMessage));
        address signer = ecrecover(prefixedHashMessage, v, r, s);
        return signer;
    }

    /**
     * @dev Mint if signature verification is successful
     */
    function mint(
        TokenType tokenType,
        uint256 score, 
        uint8 v, 
        bytes32 r, 
        bytes32 s,
        bytes memory data)
        public
    {
        require(balanceOf(msg.sender,uint(tokenType)) < 1, "ZeroMissionBadges: sender is already an holder");
        require(_signer != address(0), "ZeroMissionBadges: signer not set");
        require(score >= threshold[tokenType], "ZeroMissionBadges: score lower than threshold");
        bytes32 hashedMessage = keccak256(
            abi.encodePacked(
                msg.sender,
                uint(tokenType),
                score
            )
        );
        require(_signer == verifyMessage(hashedMessage, v, r, s), "ZeroMissionBadges: invalid proof");
        
        _mint(msg.sender, uint(tokenType), 1, data);
    }

    /**
     * @dev Get the URI of the supplied token
     */
    function uri(uint256 tokenType) override public view returns (string memory) {
        require(
            TokenType(tokenType) == TokenType.ARCADE_MODE || TokenType(tokenType) == TokenType.ENDLESS_MODE, 
            "ZeroMissionBadges: URI query for nonexistent token type"
        );

        return string.concat("ipfs://",_metadataFolderURI,"/",Strings.toString(tokenType),".json");
    }

    /**
     * @dev Get metadata uri of the contract
     */
    function contractURI() public view returns (string memory) {
        return string.concat("ipfs://",_metadataFolderURI,"/","collection.json");
    }

    // Prevent tokens from being transferred

    function _safeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) internal override {
        revert("ZeroMissionBadges: token is not transferable");
    }

    function _safeBatchTransferFrom(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal override {
        revert("ZeroMissionBadges: token is not transferable");
    }

    // The following functions are overrides required by Solidity

    function _beforeTokenTransfer(address operator, address from, address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        internal
        override(ERC1155, ERC1155Supply)
    {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }

}