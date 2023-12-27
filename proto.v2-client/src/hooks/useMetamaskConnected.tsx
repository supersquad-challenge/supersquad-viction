import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { SET_USER_CONNECT, SET_USER_DISCONNECT } from "@/redux/slice/authSlice";

export const useMetamaskConnected = () => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [address, setAddress] = useState<string | undefined>(undefined);

  const provider = window.ethereum;
  const dispatch = useDispatch();

  const web3Modal = new Web3Modal({});

  const redirChromeExtension = () => {
    return window.open(
      "https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en"
    );
  };

  useEffect(() => {
    const authConnect = async () => {
      const instance = await web3Modal.connect();
      const providers = new ethers.BrowserProvider(instance);
      if (providers) {
        const accounts = await providers.listAccounts();
        dispatch(
          SET_USER_CONNECT({
            address: accounts[0].address,
          })
        );
        setIsConnected(true);
        setAddress(accounts[0].address);
      }
    };
    if (localStorage.getItem("supersquad_metamask") === "true") {
      authConnect();
    }
  }, []);

  const connectWallet = async () => {
    if (!provider) {
      redirChromeExtension();
    } else {
      const instance = await web3Modal.connect();
      const providers = new ethers.BrowserProvider(instance);
      if (providers) {
        const accounts = await providers.listAccounts();
        dispatch(
          SET_USER_CONNECT({
            address: accounts[0].address,
          })
        );
        setIsConnected(true);
        setAddress(accounts[0].address);
        localStorage.setItem("supersquad_metamask", "true");
        localStorage.setItem("supersquad_address", accounts[0].address);
      }
    }
  };

  const disconnectWallet = async () => {
    if (!provider || !isConnected) return;
    web3Modal.clearCachedProvider();
    dispatch(SET_USER_DISCONNECT());
    setAddress(undefined);
    setIsConnected(false);
    localStorage.removeItem("supersquad_metamask");
    localStorage.removeItem("supersquad_address");
  };

  return {
    metamaskConnected: isConnected,
    metamaskAddress: address,
    metamaskConnect: connectWallet,
    metamaskDisconnect: disconnectWallet,
  };
};
