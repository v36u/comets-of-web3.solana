import "dotenv/config";

import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { getExplorerLink, getKeypairFromEnvironment } from '@solana-developers/helpers';
import { mintTo } from '@solana/spl-token';
import { MINOR_UNITS_PER_TOKEN_UNIT } from "./constants";

const connection = new Connection(clusterApiUrl("devnet"));

console.log('🟢 Connected!')
console.log(`📡 Endpoint: ${connection.rpcEndpoint}`)
console.log();

const user = getKeypairFromEnvironment('SECRET_KEY');

console.log(`🔑 Loaded the user using the private key! Public key: ${user.publicKey}`);

const RECEIVER_TOKEN_ACCOUNT_ADDRESS = '9kJAJsGjWsj5mbnJ5DrzaNogPbJ8STqeLHitVWa23So3';
const receiverTokenAccount = new PublicKey(RECEIVER_TOKEN_ACCOUNT_ADDRESS);
const TOKEN_MINT_ADDRESS = 'B1RobZYd5mTww82RTD9oayryw1DEaK5eMUFqaNXZTTDz';
const tokenMintAccount = new PublicKey(TOKEN_MINT_ADDRESS);

const mintTxSig = await mintTo(
  connection,
  user,
  tokenMintAccount,
  receiverTokenAccount,
  user,
  500 * MINOR_UNITS_PER_TOKEN_UNIT,
);

const link = getExplorerLink("transaction", mintTxSig, "devnet");

console.log(`🎉 Minted some tokens: ${link}`)
