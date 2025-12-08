// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721Enumerable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

contract BaseSimpleMint is ERC721, ERC721Enumerable, Ownable {
    using Strings for uint256;

    uint256 public immutable maxSupply;
    uint256 public totalMinted;
    uint256 private _nextId = 1;
    string private _baseTokenURI;
    bool public metadataFrozen;

    event BaseURISet(string newBaseURI);
    event MetadataFrozen();
    event Minted(address indexed to, uint256 indexed tokenId);

    constructor(
        string memory name_,
        string memory symbol_,
        string memory baseURI_,
        address owner_,
        uint256 maxSupply_
    ) ERC721(name_, symbol_) Ownable(owner_) {
        require(maxSupply_ > 0, "maxSupply=0");
        _baseTokenURI = baseURI_;
        maxSupply = maxSupply_;
    }

    // ==============================
    // Mint logic
    // ==============================
    function ownerMint(address to, uint256 quantity) external onlyOwner {
        require(quantity > 0, "qty=0");
        require(totalMinted + quantity <= maxSupply, "sold out");

        if (!metadataFrozen && totalMinted == 0) {
            metadataFrozen = true;
            emit MetadataFrozen();
        }

        for (uint256 i = 0; i < quantity; i++) {
            uint256 id = _nextId++;
            _safeMint(to, id);
            totalMinted += 1;
            emit Minted(to, id);
        }
    }

    // ==============================
    // Metadata
    // ==============================
    function setBaseURI(string calldata newBaseURI) external onlyOwner {
        require(!metadataFrozen, "metadata frozen");
        _baseTokenURI = newBaseURI;
        emit BaseURISet(newBaseURI);
    }

    function freezeMetadata() external onlyOwner {
        require(!metadataFrozen, "already frozen");
        metadataFrozen = true;
        emit MetadataFrozen();
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);
        return string(abi.encodePacked(_baseURI(), tokenId.toString(), ".json"));
    }

    // ==============================
    // Required overrides (OZ v5)
    // ==============================
    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
