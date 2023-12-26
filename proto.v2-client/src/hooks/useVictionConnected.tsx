import { useSelector, useDispatch } from "react-redux";
import { SET_USER_DISCONNECT, SET_USER_CONNECT } from "@/redux/slice/authSlice";
import { useEffect, useState } from "react";

export const useVictionConnected = () => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [address, setAddress] = useState<string | undefined>(undefined);

  const provider = window.viction;
  const dispatch = useDispatch();

  const redirChromeExtension = () => {
    return window.open(
      "https://chrome.google.com/webstore/detail/tomo-wallet/nopnfnlbinpfoihclomelncopjiioain?hl=en"
    );
  };

  useEffect(() => {
    const authConnect = async () => {
      const authInfo = await window.viction.request({ method: "eth_accounts" });
      if (authInfo !== undefined && authInfo[0] !== undefined) {
        dispatch(
          SET_USER_CONNECT({
            address: authInfo[0],
          })
        );
        setIsConnected(true);
        setAddress(authInfo[0]);
      }
    };
    if (localStorage.getItem("supersquad_viction") === "true") {
      authConnect();
    }
  }, []);

  const connectWallet = async () => {
    if (!provider) {
      redirChromeExtension();
    }
    const authInfo = await window.viction.request({ method: "eth_accounts" });
    if (authInfo !== undefined && authInfo[0] !== undefined) {
      dispatch(
        SET_USER_CONNECT({
          address: authInfo[0],
        })
      );
      setIsConnected(true);
      setAddress(authInfo[0]);
      localStorage.setItem("supersquad_viction", "true");
    } else {
      const newAuthInfo = await window.viction.request({
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
        localStorage.setItem("supersquad_viction", "true");
      }
    }
  };

  const disconnectWallet = async () => {
    if (!provider || !isConnected) return;
    const authInfo = await window.viction.disconnect();
    if (!authInfo) {
      dispatch(SET_USER_DISCONNECT());
      setAddress(undefined);
      setIsConnected(false);
      localStorage.removeItem("supersquad_viction");
    }
  };

  return {
    isVictionConnected: isConnected,
    victionAddress: address,
    victionConnect: connectWallet,
    victionDisconnect: disconnectWallet,
  };
};
