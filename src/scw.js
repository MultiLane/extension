import { ethers } from "ethers";
import { api, getChainId, isHexEqual } from "./utils";
import { SCW } from "@arcana/scw";
import approve_ui from "./ui/approve_modal.html";
import { multiLaneContract, usdcContract } from "./contract";

export const getSCWAddress = async (address) => {
  if (address.length === 0) {
    if (address[0] === window.scw_address) return address; // no need to do any computation as it is already scw address
  }
  let chain_id = await getChainId();
  let res = await api("GET", "/api/scw/address/", {
    address: address[0],
    chain_id: parseInt(chain_id),
  });
  if (res.scw_address) {
    window.scw_address = res.scw_address;
    window.scw_owner = address[0];
    return [ethers.utils.getAddress(res.scw_address)].concat(address);
  }
  return address;
};
