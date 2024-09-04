# Bot Volume

This project is an automated trading bot volume for OctaSwap.

## Features

- Interact with OctaSwap smart contracts
- Perform token swaps (ETH for tokens and tokens for ETH)
- Check token balances and allowances
- Approve token spending

## Installation

To install dependencies:

```bash
bun install
```

## Usage

To run the bot:

```bash
bun run start
```

Make sure to set up your environment variables, including your private key, before running the bot in the `.env` file like this:

```bash
PRIVATE_KEY=0x123...
```

## Configuration

The project uses Viem for Ethereum interactions and is configured for the Octa Space blockchain. Key configuration files:

- `config/chains.ts`: Defines the Octa Space chain
- `config/viem.config.ts`: Sets up the Viem client
- `constants/address.ts`: Contains important contract addresses
