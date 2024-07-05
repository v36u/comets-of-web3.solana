import "dotenv/config";

import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { getExplorerLink, getKeypairFromEnvironment } from '@solana-developers/helpers';
import { getOrCreateAssociatedTokenAccount, transfer } from '@solana/spl-token';
import { MINOR_UNITS_PER_TOKEN_UNIT } from "./constants";

const connection = new Connection(clusterApiUrl("devnet"));

console.log('🟢 Connected!')
console.log(`📡 Endpoint: ${connection.rpcEndpoint}`)
console.log();

const user = getKeypairFromEnvironment('SECRET_KEY');

console.log(`🔑 Loaded the user using the private key! Public key: ${user.publicKey}`);

const TOKEN_MINT_ADDRESS = 'B1RobZYd5mTww82RTD9oayryw1DEaK5eMUFqaNXZTTDz';
const tokenMintAccount = new PublicKey(TOKEN_MINT_ADDRESS);
const RECEIVER_WALLET_ADDRESS = '7pArvoVuC9Uthdvj7QyC3VqYGwYbfu4e6HfqWWm7p3gM';
const receiverWallet = new PublicKey(RECEIVER_WALLET_ADDRESS);

// Should exist, since we are sending funds
const senderTokenAccount = await getOrCreateAssociatedTokenAccount(
  connection,
  user,
  tokenMintAccount,
  user.publicKey,
);

console.log(`💸 Attempting to send 13 tokens to ${receiverWallet.toBase58()} ...`);

const recipientTokenAccount = await getOrCreateAssociatedTokenAccount(
  connection,
  user,
  tokenMintAccount,
  receiverWallet,
);

const txSig = await transfer(
  connection,
  user,
  senderTokenAccount.address,
  recipientTokenAccount.address,
  user,
  13 * MINOR_UNITS_PER_TOKEN_UNIT
);

const explorerLink = getExplorerLink("transaction", txSig, "devnet");

console.log(`🤝 Tokens sent! Explorer link: ${explorerLink}`)
