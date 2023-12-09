import { BACKEND_URL } from "./config";

export const api = async (method, path, body) => {
  if (method === "GET") {
    const response = await fetch(
      BACKEND_URL + path + "?" + new URLSearchParams(body),
      {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.json();
  } else if (method === "POST") {
    const response = await fetch(BACKEND_URL + path, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    return response.json();
  }
};

export const getAddress = () => {
  let address = localStorage.getItem("address");
  if (address != "") {
    return address.split(",");
  } else {
    return [];
  }
};

export const getChainId = async () => {
  return window.chain_id
    ? window.chain_id
    : parseInt(await window.ethereum.send("eth_chainId"));
};

export const setAddress = async () => {
  let address = await window.ethereum.send("eth_accounts");
  localStorage.setItem("address", address.result);
  if (address.result.length === 0) {
    return;
  }
};

// this is to stop aave from auto login, if auto login happens then metamask provider is used without this libraries customization
export const clearWalletProvider = () => {
  let walletProvider = setInterval(async () => {
    if (localStorage.getItem("walletProvider")) {
      localStorage.removeItem("walletProvider");
      clearInterval(walletProvider);
      console.log("Clearing wallet provider");
    }
  }, 100);
};

export const setChainDetails = async () => {
  let res = await api("GET", "/api/chain/address/", {});
  window.usdc_address = res?.usdc;
  window.multilane_address = res?.multilane;
  console.log("Set chain details");
};

export const isHexEqual = (address1, address2) => {
  // remove 0x from both addresses if it exist and compare in lower cases
  return (
    address1.toLowerCase().replace("0x", "") ===
    address2.toLowerCase().replace("0x", "")
  );
};
