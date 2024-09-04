import { parseEther, formatEther } from 'viem';
import { exactCoinforTokens, exactTokensforCoin } from './func/swap.type';
import {
  OCTASWAP_ROUTER_ADDRESS,
  OCTASWAP_TOKEN_ADDRESS,
  OCTASWAP_WOCTA_ADDRESS,
} from './constants/address';
import { client } from './config/viem.config';
import { getTokenBalance } from './func/token.balance';
import { approveToken } from './func/approve';
import { tokenAllowance } from './func/allowance';
import { getNativeBalance } from './func/native.balance';

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getRandomAmount(min: bigint, max: bigint): bigint {
  return BigInt(Math.floor(Math.random() * Number(max - min + 1n))) + min;
}

async function main() {
  while (true) {
    try {
      const RECEIVER = client.account.address;

      const nativeBalance = await getNativeBalance(RECEIVER);
      const reserveFees = parseEther('0.01');
      const minAmount = parseEther('10');
      const maxAvailableSwap = nativeBalance - reserveFees;

      if (maxAvailableSwap <= minAmount) {
        console.log('Insufficient balance for swap. Stopping...');
        break;
      }

      const COIN_FOR_TOKEN_AMOUNT_IN = getRandomAmount(
        minAmount,
        maxAvailableSwap
      );

      const AMOUNT_OUT_MIN = parseEther('0');
      const ADDRESS_A = OCTASWAP_TOKEN_ADDRESS;
      const ADDRESS_B = OCTASWAP_WOCTA_ADDRESS;
      const DEADLINE = BigInt(Date.now() + 5 * 60000);

      console.log('Swap started at ' + new Date().toLocaleString(), '\n');

      // SWAPPING OCTA TO OCS
      console.log(
        `Swapping ${formatEther(COIN_FOR_TOKEN_AMOUNT_IN)} OCTA to OCS`
      );
      const cft = await exactCoinforTokens(
        COIN_FOR_TOKEN_AMOUNT_IN,
        AMOUNT_OUT_MIN,
        ADDRESS_B,
        ADDRESS_A,
        RECEIVER,
        DEADLINE
      );
      const cftReceipt = await client.writeContract(cft.request);
      console.log(
        `Swapping OCTA to OCS successful! Transaction hash: ${cftReceipt}\n`
      );

      // FETCHING OCS BALANCE FROM THE BOT ACCOUNT
      console.log('Fetching token balance...');
      let tokenForCoinAmountIn;

      while (true) {
        tokenForCoinAmountIn = await getTokenBalance(RECEIVER);

        if (!tokenForCoinAmountIn) {
          continue;
        } else {
          break;
        }
      }
      console.log('Fetching token balance successful!\n');

      // APPROVING OCS BALANCE TO ROUTER
      console.log(`Approving ${formatEther(tokenForCoinAmountIn)} OCS`);
      const approve = await approveToken(
        OCTASWAP_ROUTER_ADDRESS,
        tokenForCoinAmountIn
      );
      const approveReceipt = await client.writeContract(approve.request);
      console.log(
        `Approve ${formatEther(
          tokenForCoinAmountIn
        )} OCS successful! Transaction hash: ${approveReceipt}\n`
      );

      // CHECK ALLOWANCE
      console.log('Checking token allowance...');
      let allowance;

      while (true) {
        allowance = await tokenAllowance(RECEIVER, OCTASWAP_ROUTER_ADDRESS);

        if (!allowance) {
          continue;
        } else {
          break;
        }
      }
      console.log('Checking allowance successful!\n');

      // SWAPPING OCS TO OCTA
      console.log(`Swapping ${formatEther(tokenForCoinAmountIn)} OCS to OCTA`);
      const tfc = await exactTokensforCoin(
        tokenForCoinAmountIn,
        AMOUNT_OUT_MIN,
        ADDRESS_A,
        ADDRESS_B,
        RECEIVER,
        DEADLINE
      );
      const tfcReceipt = await client.writeContract(tfc.request);
      console.log(
        `Swapping OCS to OCTA successful! Transaction hash: ${tfcReceipt}\n`
      );

      console.log('Waiting 15 minutes for another trade...\n');
      await delay(15 * 60 * 1000);
    } catch (error) {
      console.error('Error occurred:', error);
      console.log('Waiting 1 minute before retrying...\n');

      await delay(60000);
    }
  }
}

main().catch(console.error);
