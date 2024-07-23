import { simulateContract } from "@wagmi/core";
import { client } from "../config/viem.config";
import { OCTASWAP_ROUTER_ABI } from "../constants/abis";
import { OCTASWAP_ROUTER_ADDRESS } from "../constants/address";

async function exactCoinforTokens(
  amountIn: bigint,
  amountOutMin: bigint,
  addressA: `0x${string}`,
  addressB: `0x${string}`,
  receiver: `0x${string}`,
  deadline: bigint
) {
  const result = await client.simulateContract({
    abi: OCTASWAP_ROUTER_ABI,
    address: OCTASWAP_ROUTER_ADDRESS,
    functionName: "swapExactETHForTokens",
    args: [amountOutMin, [addressA, addressB], receiver, deadline],
    value: amountIn,
  });

  return result;
}

async function exactTokensforCoin(
  amountIn: bigint,
  amountOutMin: bigint,
  addressA: `0x${string}`,
  addressB: `0x${string}`,
  receiver: `0x${string}`,
  deadline: bigint
) {
  const result = await client.simulateContract({
    abi: OCTASWAP_ROUTER_ABI,
    address: OCTASWAP_ROUTER_ADDRESS,
    functionName: "swapExactTokensForETH",
    args: [amountIn, amountOutMin, [addressA, addressB], receiver, deadline],
  });

  return result;
}

export { exactTokensforCoin, exactCoinforTokens };
