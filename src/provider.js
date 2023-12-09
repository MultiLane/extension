import { handleRequest } from "./request";
import { handleSend } from "./send";

export const modifyProvider = () => {
  let originalProvider = window.ethereum;
  let modified = new Proxy(originalProvider, {
    get(target, prop, receiver) {
      if (typeof target[prop] === "function") {
        return async function (...args) {
          switch (prop) {
            case "request":
              return await handleRequest(target, args, prop);
            case "send":
              return await handleSend(target, args, prop);
            default: {
              const result = await target[prop].apply(target, args);
              console.log(prop, args, result);
              return result;
            }
          }
        };
      }
      // For other properties or methods, return them directly
      return Reflect.get(target, prop, receiver);
    },
  });
  window.ethereum = modified;
  if (window.web3) {
    window.web3.currentProvider = modified;
  }
};
