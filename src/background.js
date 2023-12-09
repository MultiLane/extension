console.log("Loaded background.js");

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
