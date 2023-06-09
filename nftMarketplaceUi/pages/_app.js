import "../styles/globals.css";
import { NavBar, Footer } from "../components/componentsindex";
const MyApp = ({ Component, pageProps }) => (
  <div>
    <NavBar></NavBar>
    <Component {...pageProps} />
    <Footer></Footer>
  </div>
);

export default MyApp;
