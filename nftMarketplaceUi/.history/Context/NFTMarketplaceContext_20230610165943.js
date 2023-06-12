import React, { useContext, useEffect, useState } from "react";
import web3Modal from "web3modal";
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
    const web3Modal = await web3Modal();
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
  const checkContract =await connectingWithSmartContract();
  return (
    <NFTMarketplaceContext.Provider value={{ titleData }}>
      {children}
    </NFTMarketplaceContext.Provider>
  );
};
