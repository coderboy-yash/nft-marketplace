import "../styles/globals.css";
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";
//INTRNAL IMPORT
import { NavBar, Footer } from "../components/componentsindex";
import { NFTMarketplaceProvider } from "../Context/NFTMarketplaceContext";

const activeChainId = ChainId.Localhost;

const MyApp = ({ Component, pageProps }) => (
  <div>
    <ThirdwebProvider desiredChainId={activeChainId}>
      <NFTMarketplaceProvider>
        <NavBar />
        <Component {...pageProps} />
        <Footer />
      </NFTMarketplaceProvider>
    </ThirdwebProvider>
  </div>
);

export default MyApp;
