import { parseEther } from "viem";
import { exactCoinforTokens, exactTokensforCoin } from "./func/swap.type";
import {
  OCTASWAP_ROUTER_ADDRESS,
  OCTASWAP_TOKEN_ADDRESS,
  OCTASWAP_WOCTA_ADDRESS,
} from "./constants/address";
import { client } from "./config/viem.config";
import { getTokenBalance } from "./func/token.balance";
import { approveToken } from "./func/approve";
import { tokenAllowance } from "./func/allowance";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  try {
    while (true) {
      const RECEIVER = client.account.address;
      const COIN_FOR_TOKEN_AMOUNT_IN = parseEther("10");
      const AMOUNT_OUT_MIN = parseEther("0");
      const ADDRESS_A = OCTASWAP_TOKEN_ADDRESS;
      const ADDRESS_B = OCTASWAP_WOCTA_ADDRESS;
      const DEADLINE = BigInt(Date.now() + 5 * 60000);

      console.log("Swap started at " + new Date().toLocaleString(), "\n");

      // SWAPPING OCTA TO OCS
      console.log(`Swapping ${COIN_FOR_TOKEN_AMOUNT_IN} OCTA to OCS`);
      const cft = await exactCoinforTokens(
        COIN_FOR_TOKEN_AMOUNT_IN,
        AMOUNT_OUT_MIN,
        ADDRESS_B,
        ADDRESS_A,
        RECEIVER,
        DEADLINE
      );
      await client.writeContract(cft.request);
      console.log("Swapping OCTA to OCS successful!\n");

      // FETCHING OCS BALANCE FROM THE BOT ACCOUNT
      console.log("Fetching token balance...");
      let tokenForCoinAmountIn;

      while (true) {
        tokenForCoinAmountIn = await getTokenBalance(RECEIVER);

        if (!tokenForCoinAmountIn) {
          continue;
        } else {
          break;
        }
      }
      console.log("Fetching token balance successful!\n");

      // APPROVING OCS BALANCE TO ROUTER
      console.log(`Approving ${tokenForCoinAmountIn} OCS`);
      const approve = await approveToken(
        OCTASWAP_ROUTER_ADDRESS,
        tokenForCoinAmountIn
      );
      await client.writeContract(approve.request);
      console.log(`Approve ${tokenForCoinAmountIn} successful!\n`);

      // CHECK ALLOWANCE
      console.log("Checking token allowance...");
      let allowance;

      while (true) {
        allowance = await tokenAllowance(RECEIVER, OCTASWAP_ROUTER_ADDRESS);

        if (!allowance) {
          continue;
        } else {
          break;
        }
      }
      console.log("Checking allowance successful!\n");

      // SWAPPING OCS TO OCTA
      console.log(`Swapping ${tokenForCoinAmountIn} OCS to OCTA`);
      const tfc = await exactTokensforCoin(
        tokenForCoinAmountIn,
        AMOUNT_OUT_MIN,
        ADDRESS_A,
        ADDRESS_B,
        RECEIVER,
        DEADLINE
      );
      await client.writeContract(tfc.request);
      console.log("Swapping OCS to OCTA successful!\n");

      console.log("Waiting 15 minutes for another trade...\n");
      await delay(15 * 60 * 1000);
    }
  } catch (error) {
    console.error(error);
  }
}

main();
