import { Connection, clusterApiUrl } from "@solana/web3.js";
import {
  Metaplex,
  keypairIdentity,
  irysStorage,
  toMetaplexFile,
  PublicKey,
} from "@metaplex-foundation/js";

import "dotenv/config";
import {
  getExplorerLink,
  getKeypairFromEnvironment,
} from "@solana-developers/helpers";
import fs from "fs";

interface NftData {
  name: string;
  symbol: string;
  description: string;
  sellerFeeBasisPoints: number;
  imageFile: string;
}

const nftData = {
  name: "Lab 5 NFT",
  symbol: "L5N",
  description: "Cool description 😎",
  sellerFeeBasisPoints: 0,
  imageFile: "logo-comets.png",
};

const updateNftData = {
  name: "Lab 5 NFT Updated",
  symbol: "L5NU",
  description: "Update cool description 😎",
  sellerFeeBasisPoints: 100,
  imageFile: "success.png",
};

async function uploadMetadata(metaplex: Metaplex, nftData: NftData) {
  console.log("🚀 Uploading metadata...");

  const buffer = fs.readFileSync(nftData.imageFile);

  const file = toMetaplexFile(buffer, nftData.imageFile);

  const imageUri = await metaplex.storage().upload(file);
  console.log("image uri:", imageUri);

  const { uri } = await metaplex.nfts().uploadMetadata({
    name: nftData.name,
    sybmol: nftData.symbol,
    description: nftData.description,
    image: imageUri,
  });

  console.log("Done ✅! Metadata uri:", uri);

  return uri;
}

async function createNft(metaplex: Metaplex, uri: string, nftData: NftData) {
  console.log("🚀 Creating NFT...");

  const { nft } = await metaplex.nfts().create({
    uri,
    name: nftData.name,
    symbol: nftData.symbol,
    sellerFeeBasisPoints: nftData.sellerFeeBasisPoints,
  });

  const link = getExplorerLink("address", nft.address.toString(), "devnet");
  console.log(`✅ Token Mint: ${link}`);

  return nft;
}

async function updateNftUri(
  metaplex: Metaplex,
  uri: string,
  mintAddress: PublicKey,
) {
  console.log("🚀 Updating NFT URI...");
  const nft = await metaplex.nfts().findByMint({
    mintAddress,
  });

  const { response } = await metaplex.nfts().update({
    nftOrSft: nft,
    uri,
    name: updateNftData.name,
    symbol: updateNftData.symbol,
    sellerFeeBasisPoints: updateNftData.sellerFeeBasisPoints,
  });

  const link = getExplorerLink("address", nft.address.toString(), "devnet");
  console.log(`✅ Token Mint: ${link}`);

  console.log(
    `Token Mint: https://explorer.solana.com/address/${nft.address.toString()}?cluster=devnet`,
  );

  const txLink = getExplorerLink("tx", response.signature, "devnet");
  console.log(`✅ Transaction: ${txLink}`);
}

async function main() {
  // create a new connection to the cluster's API
  const connection = new Connection(clusterApiUrl("devnet"));

  // initialize a keypair for the user
  const user = getKeypairFromEnvironment("SECRET_KEY");

  console.log(
    `🔑 We've loaded our keypair securely, using an env file! Our public key is: ${user.publicKey.toBase58()}`,
  );

  const metaplex = new Metaplex(connection).use(keypairIdentity(user)).use(
    irysStorage({
      // https://solana.stackexchange.com/a/14343
      address: "https://devnet.irys.xyz",
      providerUrl: "https://api.devnet.solana.com",
      timeout: 60e3,
    }),
  );

  // upload the NFT data and get the URI for the metadata
  const uri = await uploadMetadata(metaplex, nftData);

  // create an NFT using the helper function and the URI from the metadata
  const nft = await createNft(metaplex, uri, nftData);

  const updatedUri = await uploadMetadata(metaplex, updateNftData);

  await updateNftUri(metaplex, updatedUri, nft.address);
}

main()
  .then(() => {
    console.log("Finished successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });

// First: https://explorer.solana.com/address/4wuPccJguYznL38uxG3GEP4mn1s5Np9YmMREo4Dh5p4V?cluster=devnet
// Second: https://explorer.solana.com/address/7kPCDKD5G97aMek75YUzsh4eWpwydxMMWtCjHtFbWmLm?cluster=devnet
