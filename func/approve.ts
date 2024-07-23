import { erc20Abi } from "viem";
import { client } from "../config/viem.config";
import { OCTASWAP_ROUTER_ABI } from "../constants/abis";
import {
  OCTASWAP_ROUTER_ADDRESS,
  OCTASWAP_TOKEN_ADDRESS,
} from "../constants/address";

async function approveToken(spender: `0x${string}`, amount: bigint) {
  const result = await client.simulateContract({
    abi: erc20Abi,
    address: OCTASWAP_TOKEN_ADDRESS,
    functionName: "approve",
    args: [spender, amount],
  });

  return result;
}

export { approveToken };
