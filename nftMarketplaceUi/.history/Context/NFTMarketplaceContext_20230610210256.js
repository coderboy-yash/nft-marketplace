import React, { useContext, useEffect, useState } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import Router from "next/router";
import { NFTMarketplaceABI, NFTMarketplaceAddress } from "./Constants";
import axios from "axios";
import { create as ipfsHttpClient } from "ipfs-http-client";

const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");

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
        method: "eth_requestAccount",
      });
      setCurrentAccount(accounts[0]);
      window.location.reload();
    } catch (error) {
      console.log("Error while connecting to wallet", error);
    }
  };
  //   upload images to ipfs
  const uploadedToIPFS = async (file) => {
    try {
      const added = await client.add({ content: file });
      const url = `https:ipfs.infura.io/ipfs/${added.path}`;
      return url;
    } catch (error) {
      console.log("error uploading to ipfs");
    }
  };

  // create nft fucnction
    const createNFT = async (formInput, fileUrl, router) => {
        try {
            const { name, description, price } = formInput;
            if (!name || !description || !price || !fileUrl) {
             return   console.log("data is missing");

            }
        }
    }

  return (
    <NFTMarketplaceContext.Provider
      value={{ connectWallet, uploadedToIPFS, titleData }}
    >
      {children}
    </NFTMarketplaceContext.Provider>
  );
};
