import React, { useContext, useEffect, useState } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import Router from "next/router";
import { NFTMarketplaceABI, NFTMarketplaceAddress } from "./Constants";
import axios from "axios";
import { create as ipfsHttpClient } from "ipfs-http-client";

const fetchContract = (signerOrProvider) =>
  new ethers.Contract(
    NFTMarketplaceAddress,
    NFTMarketplaceABI,
    signerOrProvider
  );
// connecting with smart contract

const connectingWithSmartContract = async () => {
  try {
    const web3Modal = await Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = fetchContract(signer);
    return contract;
  } catch (error) {
    console.log("something went wrong", error);
  }
};

export const NFTMarketplaceContext = React.createContext();

export const NFTMarketplaceProvider = ({ children }) => {
  const titleData = "discover ,collect and sell nfts";
  const checkContract = async () => {
    const contract = await connectingWithSmartContract();
    console.log(contract);
  };
  return (
    <NFTMarketplaceContext.Provider value={{ titleData, checkContract }}>
      {children}
    </NFTMarketplaceContext.Provider>
  );
};
