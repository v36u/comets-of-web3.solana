// Part 1:

import "dotenv/config";
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { getKeypairFromEnvironment } from "@solana-developers/helpers";

const connection = new Connection(clusterApiUrl("devnet"));

console.log(`🟢 Connected!`)
console.log(`📡 Endpoint: ${connection.rpcEndpoint}`)

const phantomExistingPublicKey = process.env.PHANTOM_EXISTING_PUBLIC_KEY;
if (!phantomExistingPublicKey) {
  throw new Error('Missing PHANTOM_EXISTING_PUBLIC_KEY env var!')
}

const parsedPublicKey = new PublicKey(phantomExistingPublicKey);

// You can get SOL from https://faucet.solana.com/
const balanceInLamports = await connection.getBalance(parsedPublicKey);
const balanceInSol = balanceInLamports / 10 ** 9;

console.log(`💰 Balance: ${balanceInSol} SOL (${balanceInLamports} lamports)`);

// Part 2: New key to import into Phantom

import bs58 from "bs58";

const solanaKeyPair = getKeypairFromEnvironment("PHANTOM_NEW_PRIVATE_KEY");
const parsedPrivateKey =  bs58.encode(solanaKeyPair.secretKey);

console.log(`🔐 Secret key for importing (DO NOT SHARE THIS): ${parsedPrivateKey}`);
