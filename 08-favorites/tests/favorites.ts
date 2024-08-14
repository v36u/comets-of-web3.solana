import {
  Wallet,
  AnchorProvider,
  setProvider,
  workspace,
  BN,
  web3,
} from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Favorites } from "../target/types/favorites";
import { assert } from "chai";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

describe("favorites", () => {
  const provider = AnchorProvider.env();
  setProvider(provider);

  const user = (provider.wallet as Wallet).payer;

  const program = workspace.favorites as Program<Favorites>;

  before(async () => {
    const balance = await provider.connection.getBalance(user.publicKey);
    const balanceInSol = balance / LAMPORTS_PER_SOL;
    const formattedBalance = new Intl.NumberFormat().format(balanceInSol);
    console.log(`Balance: ${formattedBalance} SOL`);
  });

  it("Is initialized", async () => {
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });

  it("Saves a user's favorites to the blockchain", async () => {
    const favoriteNumber = new BN(42);
    const favoriteColor = "green";
    const favoriteHobbies = ["gaming", "reading", "rollerblading"];

    await program.methods
      .setFavorites(favoriteNumber, favoriteColor, favoriteHobbies)
      .signers([user])
      .rpc();

    const favoritesPdaAndBump = web3.PublicKey.findProgramAddressSync(
      [Buffer.from("favorites"), user.publicKey.toBuffer()],
      program.programId
    );
    const favoritesPda = favoritesPdaAndBump[0];
    const dataFromPda = await program.account.favorites.fetch(favoritesPda);

    assert.equal(dataFromPda.color, favoriteColor);
    assert.equal(dataFromPda.number.toString(), favoriteNumber.toString());
    assert.deepEqual(dataFromPda.hobbies, favoriteHobbies);
  });

  it("Doesn't write to favorites for other users", async () => {
    const someRandomGuy = web3.Keypair.generate();

    const randomNumber = new BN(84);
    const randomColor = "red";
    const randomHobbies = [
      "trying to hack other people's favorites",
      "picking flowers",
    ];

    try {
      await program.methods
        .setFavorites(randomNumber, randomColor, randomHobbies)
        .signers([someRandomGuy])
        .rpc();
    } catch (error) {
      const errorMessage = (error as Error).message;
      assert.isTrue(errorMessage.includes("unknown signer"));
    }
  });
});
