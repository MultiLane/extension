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

export const initSCW = async () => {
  let provider = new ethers.providers.Web3Provider(window.ethereum);
  let signer = provider.getSigner(window.scw_owner);
  let scw = new SCW();
  await scw.init(
    "3d62f2681c4dd964e57c6755c9a249bf565ad5e6",
    signer,
    "https://gateway-dev.arcana.network"
  );
  window.scw = scw;
  console.log("scw initialized");
};

const handleApprove = async (tx) => {
  return new Promise((resolve, reject) => {
    let div = document.createElement("div");
    div.innerHTML = approve_ui;
    let element = div.firstChild;
    document.body.appendChild(element);
    let submit = document.getElementById("multilane-approve-submit");
    submit.onclick = async () => {
      let amount = document.getElementById("multilane-approve-input").value*1e6;
      let signature = await api("POST", "/api/withdraw/", {
        address: window.scw_owner,
        amount,
      });
      let { r, s, v } = ethers.utils.splitSignature(signature.signature);
      console.log({ r, s, v });
      let multilane_contract = multiLaneContract();
      let encoded_borrow = multilane_contract.interface.encodeFunctionData(
        "borrow",
        [amount, v, r, s]
      );
      let txBorrow = {
        from: window.scw_address,
        to: multilane_contract.address,
        data: encoded_borrow,
      };

      let usdc_contract = usdcContract();
      let decoded_approve = usdc_contract.interface.decodeFunctionData(
        "approve",
        tx.data
      );
      console.log("decoded_approve", decoded_approve);
      let encoded_approve = await usdc_contract.interface.encodeFunctionData(
        "approve",
        [decoded_approve[0], amount]
      );
      let txApprove = {
        from: window.scw_address,
        to: usdc_contract.address,
        data: encoded_approve,
      };
      let txs = [txApprove, txBorrow];
      let scw_tx = await window.scw.doTx(txs);
      let txDetail = await scw_tx.wait();
      let txHash = txDetail.receipt.transactionHash;
      console.log("txHash", txHash);
      let res = await api("POST", "/api/billtransaction/", {
        address: window.scw_address,
        link: `https://goerli.arbiscan.io/token/${txHash}`,
        chain_id: window.chain_id,
        amount: amount,
      });
      console.log("res", res);
      element.remove();
      resolve(txHash);
    };
    let closeBtn = document.getElementById("multilane-approve-close");
    closeBtn.onclick = () => {
      element.remove();
      reject("User rejected approve tx");
    };
  });
};

export const sendTransaction = async (tx) => {
  if (
    isHexEqual(tx.to, window.usdc_address?.[window?.chain_id]) &&
    isHexEqual(
      tx.data.substring(0, 10),
      ethers.utils.id("approve(address,uint256)").substring(0, 10)
    )
  ) {
    return handleApprove(tx);
  } else {
    let txParams = {
      from: window.scw_address,
      to: tx.to,
      data: tx.data,
    };
    let scw_tx = await window.scw.doTx(txParams);
    let txDetail = await scw_tx.wait();
    return txDetail.receipt.transactionHash;
  }
};
