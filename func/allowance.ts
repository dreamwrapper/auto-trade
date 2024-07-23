import { erc20Abi } from "viem";
import { client } from "../config/viem.config";
import { OCTASWAP_TOKEN_ADDRESS } from "../constants/address";

async function tokenAllowance(owner: `0x${string}`, spender: `0x${string}`) {
  const result = await client.readContract({
    abi: erc20Abi,
    address: OCTASWAP_TOKEN_ADDRESS,
    functionName: "allowance",
    args: [owner, spender],
  });

  return result;
}

export { tokenAllowance };
