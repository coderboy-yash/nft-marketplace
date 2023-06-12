const hre = require("hardhat");

async function main() {
  const  NFTMarketplace = await hre.ethers.getContractFactory(" NFTMarketplace");
  const  nftMarketplace = await  NFTMarketplace.deploy();

  await  NFTMarketplace.deployed();

  console.log(
    ` NFTMarketplace with ${ethers.utils.formatEther(
       NFTMarketplaceedAmount
    )}ETH and un NFTMarketplace timestamp ${un NFTMarketplaceTime} deployed to ${ NFTMarketplace.address}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
