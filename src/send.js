const { getSCWAddress } = require("./scw");
const { getAddress } = require("./utils");

export const handleSend = async (target, args, prop) => {
  switch (args[0]) {
    case "eth_requestAccounts" || "eth_accounts":
      return { jsonrpc: "2.0", result: await getSCWAddress(getAddress()) };
    default:
      return await target[prop].apply(target, args);
  }
};
