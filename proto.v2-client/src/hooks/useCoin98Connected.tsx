import { SET_USER_CONNECT, SET_USER_DISCONNECT } from "@/redux/slice/authSlice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export const useCoin98Connected = () => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [address, setAddress] = useState<string | undefined>(undefined);

  const provider = window.coin98;
  const dispatch = useDispatch();

  const redirChromeExtension = () => {
    return window.open(
      "https://chromewebstore.google.com/detail/coin98-wallet/aeachknmefphepccionboohckonoeemg?hl=en"
    );
  };

  useEffect(() => {
    const authConnect = async () => {};
    if (localStorage.getItem("supersquad_coin98") === "true") {
      authConnect();
    }
  }, []);

  const connectWallet = async () => {
    if (!provider) {
      redirChromeExtension();
    }
    const authInfo = await window.ethereum.request({
      method: "eth_accounts",
    });
    if (authInfo !== undefined && authInfo[0] !== undefined) {
      dispatch(
        SET_USER_CONNECT({
          address: authInfo[0],
        })
      );
      setIsConnected(true);
      setAddress(authInfo[0]);
      localStorage.setItem("supersquad_coin98", "true");
    } else {
      const newAuthInfo = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      if (newAuthInfo !== undefined && newAuthInfo[0] !== undefined) {
        dispatch(
          SET_USER_CONNECT({
            address: newAuthInfo[0],
          })
        );
        setIsConnected(true);
        setAddress(newAuthInfo[0]);
        localStorage.setItem("supersquad_coin98", "true");
      }
    }
  };

  const disconnectWallet = async () => {
    if (!provider || !isConnected) return;
    const authInfo = await window.ethereum.disconnect();
    if (!authInfo) {
      dispatch(SET_USER_DISCONNECT());
      setAddress(undefined);
      setIsConnected(false);
      localStorage.removeItem("supersquad_coin98");
    }
  };

  return {
    coin98Connected: isConnected,
    coin98Address: address,
    coin98Connect: connectWallet,
    coin98Disconnect: disconnectWallet,
  };
};
