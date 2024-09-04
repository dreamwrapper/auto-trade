import { client } from '../config/viem.config';

async function getNativeBalance(account: `0x${string}`) {
  const balance = await client.getBalance({
    address: account,
  });

  return balance;
}

export { getNativeBalance };
