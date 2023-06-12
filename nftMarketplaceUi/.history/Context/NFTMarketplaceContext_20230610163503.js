import React, { useContext, useEffect, useState } from "react";
import web3Modal from "web3modal";
import { ethers } from "ethers";
import Router from "next/router";
import { NFTMarketplaceABI, NFTMarketplaceAddress } from "./Constants";
import axios from "axios";
import { create as ipfsHttpClient } from "ipfs-http-client";

export const NFTMarketplaceContext = React.createContext();

export const NFTMarketplaceProvider = ({ children }) => {
  const titleData = "discover ,collect and sell nfts";
  return (
    <NFTMarketplaceContext.Provider value={{ titleData }}>
      {children}
    </NFTMarketplaceContext.Provider>
  );
};
