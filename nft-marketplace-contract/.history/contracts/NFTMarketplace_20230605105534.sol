// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
// internal import for Nft openzipline
import '@openzeppelin/contracts/utils/Counter.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/token/ERC721/ERC721.sol'
import 'hardhat/console.sol';

contract NFTMarketplace is ERC721URIStorage{
    using Counters for Counters.Counter;

    Counter.Counter private _tokenIds;
    Counter.Counter private _itemsSold;
    
    address payable owner;
    mapping(uint256 => MarketItem) private idMarketItem;

    struct MarketItem{
        uint256 tokenId;
        address payable seller;
        uint256 price;
        bool sold;


    }

    event idMarketItemCreated(
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price,
        bool sold,

    );
    constructor() ERC721("NFT Metaverse Token",'MYNFT'){
        owner==payable(msg.sender);

    }
    function updateListingPrice(uint256 _listingPrice) public payable{
        
    }
}




