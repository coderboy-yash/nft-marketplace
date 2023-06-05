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
    uint256 listingPrice=0.0025 ether;
    
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

modifier onlyOwner(){
    require (
        msg.sender==owner,'only owner of the marketplace can change the listing price'
    );_;
}

    constructor() ERC721("NFT Metaverse Token",'MYNFT'){
        owner==payable(msg.sender);

    }
    function updateListingPrice(uint256 _listingPrice) public onlyOwner payable{
listingPrice=_listingPrice;
    }
    fuction getListingPrice() public view returns uint256 {
        return listingPrice;

    }
    // let create 'create nft token function'
    function createToken(string memory tokenURI ,uint256 price) public _tokenIds.increment();
    uint256 newTokenId=_tokenIds.current();
    _mint(msg.sender,newTokenId);
    _setTokenURI(newTokenId,tokenURI);
    createMarketItem(new TokenId,price);
    return newTokenId;
}




