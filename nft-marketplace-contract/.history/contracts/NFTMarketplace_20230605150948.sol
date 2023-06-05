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

// creating market items
function createMarketItem(uint256 tokenId,uint256 price ) private {
    require(price>0,'price must be at least 1');
    require(msg.value==listingPrice,'price must be equal to listing price');

    idMarketItem[tokenId]=MarketItem(
        tokenId,payable(msg.sender),payable(address(this)),price,false
    );
    _transfer(msg.sender,address(this),tokenId);
    
    emit idMarketItemCreated(
        tokenId,
        msg.sender,
        address(this),
        price,
        false
    );

    // function for resale of token

    function reSellToken(uint256 tokenId,uint256 price) public payable{
        require (
            idMarketItem[tokenId].owner==msg.sender,
            'only item owner can perform this operation'
        );
        require(
            msg.value==listingPrice,
            "price must be equal to listing price"
        );
        idMarketItem[tokenId].sold=false;
        idMarketItem[tokenId].price=price;
        idMarketItem[tokenId].seller=payable(msg.sender);

        idMarketItem[tokenId].owner=payable(address(this));

        _itemsSold.decrement();

        _transfer(msg.sender,address(this),tokenId);

    }
    // function createMarketSale

    function createMarketSale(uint256 tokenId) public payable {
        uint256 price=idMarketItem[tokenId].price;

        require(
            msg.value==price,
            'please submit the asking price in order to complete the transaction'
        );
        idMarketItem[tokenId].owner=payable(msg.sender);
        idMarketItem[tokenId].sold=true;
        idMarketItem[tokenId].owner=payable(address(0));

        _itemsSold.increment();
        _transfer(address(this),msg.sender,tokenId);
        payable(owner)._transfer(listingPrice);
        payable(idMarketitem[tokenId].seller).transfer(msg.value);

    }

    // getting unsold nft data
    function fetchMarketItem() public view returns(MarketItem[] memory){
        uint256 itemCount=_tokenIds.current();
        uint256 unsoldItemCount=_tokenIds.current()=_itemsSold.current();
        uint256 currentIndex=0;
        MarketItem[]memory items=new MarketItem[](unsoldItemCount);
        for(uint256 i=0;i<itemCount;i++){
            if(idMarketItem[i+1].owner==address(this))
            {
                uint256 currentId=i+1;

                MarketItem storage currentItem=idMarketItem[currentId];
                items[currentIndex]=currentItem;
                currentIndex+=1;
            }
        }
            return items;
    }
    // purchase item
    function fetchMyNFT(){
                uint256 totalCount=_tokenIds.current();
               uint itemCount=0;
        uint256 currentIndex=0;
    }
}



