import { ethers } from "ethers";

const multilaneAbi = [
  "function borrow(uint256 _amount, uint8 v, bytes32 r, bytes32 s)",
];

const usdcAbi = [
  "function approve(address _spender, uint256 _value) returns (bool success)",
];

const getSigner = () => {
  let provider = new ethers.providers.Web3Provider(window.ethereum);
  return provider.getSigner(window.scw_owner);
};

export const multiLaneContract = () => {
  let signer = getSigner();
  return new ethers.Contract(
    window.multilane_address?.[window?.chain_id],
    multilaneAbi,
    signer
  );
};

export const usdcContract = () => {
  let signer = getSigner();
  return new ethers.Contract(
    window.usdc_address?.[window?.chain_id],
    usdcAbi,
    signer
  );
};
