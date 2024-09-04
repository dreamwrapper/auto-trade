import { erc20Abi } from 'viem';
import { client } from '../config/viem.config';
import { OCTASWAP_TOKEN_ADDRESS } from '../constants/address';

async function getTokenBalance(account: `0x${string}`) {
  const balance = await client.readContract({
    abi: erc20Abi,
    address: OCTASWAP_TOKEN_ADDRESS,
    functionName: 'balanceOf',
    args: [account],
  });

  return balance;
}

export { getTokenBalance };
