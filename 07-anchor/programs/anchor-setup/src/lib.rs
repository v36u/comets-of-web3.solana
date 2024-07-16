use anchor_lang::prelude::*;

declare_id!("BtNfgKnR4ir6KTxW5EqsxPjZuFHVtoWqqqXj7e68J1s8");

#[program]
pub mod anchor_setup {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
