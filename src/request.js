import { getSCWAddress, sendTransaction } from "./scw";
import { getAddress } from "./utils";

export const handleRequest = async (target, args, prop) => {
  switch (args[0]?.method) {
    case "eth_requestAccounts" || "eth_accounts":
      return await getSCWAddress(getAddress());
    case "eth_chainId": {
      let chain_id = await target[prop].apply(target, args);
      window.chain_id = parseInt(chain_id);
    }
    default: {
      return await target[prop].apply(target, args);
    }
  }
};
