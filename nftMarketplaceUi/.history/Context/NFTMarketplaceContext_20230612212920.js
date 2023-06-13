import React, { useContext, useEffect, useState } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import Router from "next/router";
import { NFTMarketplaceABI, NFTMarketplaceAddress } from "./Constants";
import axios from "axios";
import { create as ipfsHttpClient } from "ipfs-http-client";

// const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");
const projectId = "your project id here";
const projectSecretKey = "project secretKey";
const auth = `Basic${Buffer.from(`${projectId}:${projectSecretKey}`).toString(
  "base64"
)}`;

const subdomain = "your subdomain";

const client = ipfsHttpClient({
  host: "infura-ipfs.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth,
  },
});

const fetchContract = (signerOrProvider) =>
  new ethers.Contract(
    NFTMarketplaceAddress,
    NFTMarketplaceABI,
    signerOrProvider
  );
// connecting with smart contract

const connectingWithSmartContract = async () => {
  try {
    const web3Modal = new Web3Modal();
    console.log(1);
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    console.log(signer);
    const contract = fetchContract(signer);
    return contract;
  } catch (error) {
    console.log("something went wrong while connecting contract", error);
  }
};

export const NFTMarketplaceContext = React.createContext();

export const NFTMarketplaceProvider = ({ children }) => {
  const titleData = "discover ,collect and sell nfts";
  const [currentAccount, setCurrentAccount] = useState("");
  // check if wallet is connected
  const checkIfWalletConnected = async () => {
    try {
      if (!window.ethereum) return console.log("install metamask");

      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (accounts.length) {
        setCurrentAccount(accounts[0]);
      } else {
        console.log("No accounts found");
      }
      console.log(currentAccount);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    checkIfWalletConnected();
  }, []);
  // connnect wallet
  const connectWallet = async () => {
    try {
      if (!window.ethereum) return console.log("install metamask");

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentAccount(accounts[0]);
      // window.location.reload();
    } catch (error) {
      console.log("Error while connecting to wallet", error);
    }
  };
  //   upload images to ipfs
  const uploadToIPFS = async (file) => {
    try {
      const added = await client.add({ content: file });
      const url = `${subdomain}/ipfs/${added.path}`;
      return url;
    } catch (error) {
      console.log("error uploading to ipfs");
    }
  };

  // create nft fucnction
  const createNFT = async (formInput, fileUrl, router) => {
    const { name, description, price } = formInput;
    if (!name || !description || !price || !fileUrl)
      return console.log("data is missing");

    const data = JSON.stringify({ name, description, Image: fileUrl });
    try {
      const added = await client.add(data);
      const url = `https://ipfs-infura.io/ipfs/${added.path}`;
      await createSale(url, price);
    } catch (error) {
      console.log(error);
    }
  };

  //   create sale function
  const createSale = async (url, formInputPrice, isReselling, id) => {
    try {
      const price = ethers.utils.parseUnits(formInputPrice, "ether");
      const contract = await connectingWithSmartContract();
      const listingPrice = await contract.getListingPrice();
      const transaction = !isReselling
        ? await contract.createToken(url, price, {
            value: listingPrice.toString(),
          })
        : await contract.resellToken(url, price, {
            value: listingPrice.toString(),
          });
      await transaction.wait();
    } catch (error) {}
  };
  // fetch nft

  const fetchNFTs = async () => {
    try {
      const provider = new ethers.providers.JsonRpcProvider();
      const contract = fetchContract(provider);
      const data = await contract.fetchMarketItem();

      const items = await Promise.all(
        data.map(
          async ({ tokenId, seller, owner, price: unformattedPrice }) => {
            const tokenURI = await contract.tokenURI(tokenId);
            const {
              data: { image, name, description },
            } = await axios.get(tokenURI);
            const price = ethers.utils.formatUnits(
              unformattedPrice.toString,
              "ether"
            );
            return {
              price,
              tokenId: tokenId.toNumber(),
              seller,
              owner,
              image,
              name,
              description,
              tokenURI,
            };
          }
        )
      );
      return items;
    } catch (error) {
      console.log("error while fetching nfts", error);
    }
  };
  // fetch my nft or listed nfts

  const fetchMyNFTsOrListedNFTs = async () => {
    try {
      const contract = await connectingWithSmartContract();

      const data =
        type == "fetchItemsListed"
          ? await contract.fetchItemsListed()
          : await contract.fetchMyNFT();

      const items = await Promise.all(
        data.map(
          async ({ tokenId, seller, owner, price: unformattedPrice }) => {
            const tokenURI = await contract.tokenURI(tokenId);
            const {
              data: { image, name, description },
            } = await axios.get(tokenURI);
            const price = ethers.utils.formatUnits(
              unformattedPrice.toString,
              "ether"
            );
            return {
              price,
              tokenId: tokenId.toNumber(),
              seller,
              owner,
              image,
              name,
              description,
              tokenURI,
            };
          }
        )
      );
      return items;
    } catch (error) {
      console.log("error while fetching nfts", error);
    }
  };

  // buy nft
  const buyNFT = async (nft) => {
    try {
      const contract = await connectingWithSmartContract();
      const price = ethers.utils.parseUnits(nft.price.toString(), "ether");
      const transaction = await contract.createMarketSale(nft.tokenId, {
        value: price,
      });
      await transaction.wait();
    } catch (error) {
      console.log("error while buying nft", error);
    }
  };
  return (
    <NFTMarketplaceContext.Provider
      value={{
        checkIfWalletConnected,
        connectWallet,
        uploadToIPFS,
        createNFT,
        fetchNFTs,
        fetchMyNFTsOrListedNFTs,
        buyNFT,
        currentAccount,
        titleData,
      }}
    >
      {children}
    </NFTMarketplaceContext.Provider>
  );
};
