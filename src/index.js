import { clearWalletProvider, setAddress, setChainDetails } from "./utils";
import { modifyProvider } from "./provider";
import { initSCW } from "./scw";
console.log("Load index.js of multilane");

(async () => {
  modifyProvider();
  clearWalletProvider();
  await setAddress();

  // below are independent functions so they can be called in parallel
  initSCW();
  setChainDetails();
})();

window.addEventListener("message", function (event) {
  // Check the event source and data, and handle the message
  if (event.source === window && event.data?.name === "multilane-website") {
    console.log("Message received!", event.data);
  }
});
