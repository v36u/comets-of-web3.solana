import "dotenv/config";

import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { getKeypairFromEnvironment } from '@solana-developers/helpers';
import { getOrCreateAssociatedTokenAccount } from '@solana/spl-token';

const connection = new Connection(clusterApiUrl("devnet"));

console.log('🟢 Connected!')
console.log(`📡 Endpoint: ${connection.rpcEndpoint}`)
console.log();

const user = getKeypairFromEnvironment('SECRET_KEY');

console.log(`🔑 Loaded the user using the private key! Public key: ${user.publicKey}`);

const RECEIVER_WALLET_ADDRESS = '7pArvoVuC9Uthdvj7QyC3VqYGwYbfu4e6HfqWWm7p3gM';
const receiverWallet = new PublicKey(RECEIVER_WALLET_ADDRESS);
const TOKEN_MINT_ADDRESS = 'B1RobZYd5mTww82RTD9oayryw1DEaK5eMUFqaNXZTTDz';
const tokenMintAccount = new PublicKey(TOKEN_MINT_ADDRESS);

const tokenAccount = await getOrCreateAssociatedTokenAccount(
  connection,
  user,
  tokenMintAccount,
  receiverWallet
);

console.log(`Token account: ${tokenAccount.address.toBase58()}`);
