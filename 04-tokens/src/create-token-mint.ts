import "dotenv/config";

import { Connection, clusterApiUrl } from '@solana/web3.js';
import { getExplorerLink, getKeypairFromEnvironment } from '@solana-developers/helpers';
import { createMint } from '@solana/spl-token';
import { TOKEN_DECIMALS } from "./constants";

const connection = new Connection(clusterApiUrl("devnet"));

console.log('🟢 Connected!')
console.log(`📡 Endpoint: ${connection.rpcEndpoint}`)
console.log();

const user = getKeypairFromEnvironment('SECRET_KEY');

console.log(`🔑 Loaded the user using the private key! Public key: ${user.publicKey}`);

const tokenMint = await createMint(connection, user, user.publicKey, null, TOKEN_DECIMALS);

const link = getExplorerLink("address", tokenMint.toString(), "devnet");

console.log(`✅ Token mint: ${link}`)
