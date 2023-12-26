export const getVictionProvider = () => {
  const provider = window?.viction;
  if (!provider) {
    return window.open(
      "https://chrome.google.com/webstore/detail/tomo-wallet/nopnfnlbinpfoihclomelncopjiioain?hl=vi"
    );
  }
  return provider;
};
