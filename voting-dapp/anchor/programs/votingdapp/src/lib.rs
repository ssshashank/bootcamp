#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");

#[program]
pub mod voting {

    use super::*;

    // initialize a poll
    pub fn initialize_poll(
        ctx: Context<InitializePoll>,
        poll_id: u64,
        description: String,
        poll_start: u64,
        poll_end: u64,
    ) -> Result<()> {
        let poll = &mut ctx.accounts.poll;
        poll.poll_id = poll_id;
        poll.description = description;
        poll.poll_start = poll_start;
        poll.poll_end = poll_end;
        poll.candidates_amount = 0;
        Ok(())
    }

 // initialize candidates
pub fn initialize_candidates(
    ctx: Context<InitializeCandidates>,
    candidates_name: String,
    poll_id: u64,
) -> Result<()> {
    Ok(())
}

}
 

#derive(Accounts)]
#[instruction(candidates_name: String, poll_id: u64)]
pub struct InitializeCandidates<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    
    #[account(
        seeds = [poll_id.to_le_bytes().as_ref()],
        bump,
    )]
    pub poll: Account<'info, Poll>,
    
    #[account(
        init,
        payer = signer,
        space = 8 + Candidates::INIT_SPACE,
        seeds = [poll_id.to_le_bytes().as_ref(), candidates_name.as_bytes()],
        bump,
    )]
    pub candidates: Account<'info, Candidates>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(poll_id: u64)]
pub struct InitializePoll<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(
        init,
        payer = signer,
        space = 8 + Poll::INIT_SPACE,
        seeds = [poll_id.to_le_bytes().as_ref()],
        bump,
    )]
    pub poll: Account<'info, Poll>,
    pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct Poll {
    pub poll_id: u64,
    #[max_len(300)]
    pub description: String,
    pub poll_start: u64,
    pub poll_end: u64,
    pub candidates_amount: u64,
}
