import { BACKEND_URL } from "./config";
import { ethers } from "ethers";
console.log("Loaded background.js");
chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    if (details.url.includes(BACKEND_URL)) {
      return {};
    }
    // Intercept the request and modify the response
    if (details.method === "POST") {
      //   // console log payload of the request
      let parsedJson = {};
      try {
        parsedJson = JSON.parse(
          new TextDecoder().decode(details.requestBody.raw[0].bytes)
        );
      } catch (e) {}
      if (parsedJson.method) {
        console.log("method", parsedJson.method, parsedJson?.params);
      }

      if (parsedJson?.method === "eth_call") {
        if (
          parsedJson?.params[0].data.substring(0, 10) ===
          ethers.utils
            .id("getUserWalletBalances(address,address)")
            .substring(0, 10)
        ) {
          return {
            redirectUrl: `${BACKEND_URL}/api/rpc/balance/?url=${details.url}`,
          };
        }
      }
    }
  },
  { urls: ["<all_urls>"] },
  ["blocking", "requestBody", "extraHeaders"]
);
console.log("Added request listner");

const init = async ({ address, chain_id }) => {
  console.log("Wallet init");
  // let res = await api("GET", "/api/profile/public/", { address, chain_id });
  // console.log(res);
};

chrome.runtime.onMessage.addListener(async function (
  request,
  sender,
  sendResponse
) {
  if (request.type === "init") {
    await init(request.data);
    sendResponse("Init Message received");
  }
});
