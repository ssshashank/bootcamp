import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { PublicKey } from '@solana/web3.js'
import { BankrunProvider, startAnchor } from 'anchor-bankrun';
import { Voting } from '../target/types/voting';
const IDL = require('../target/idl/voting.json');
const votingAddress = new PublicKey("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");

describe('votingdapp', () => {

    let context, provider, votingProgram: any;

    beforeAll(async () => {
        // Anchor bankrun context and provider
        context = await startAnchor("", [{
            name: "votingdapp",
            programId: votingAddress,
        }], []);
        provider = new BankrunProvider(context);
        votingProgram = new Program<Voting>(IDL, provider);
    });

    it('Initialize Poll', async () => {
        await votingProgram.methods.initializePoll(
            new anchor.BN(1),
            "What is your favorite type of peanut butter?",
            new anchor.BN(0),
            new anchor.BN(1773494721),
        ).rpc();

        const [pollAddress] = PublicKey.findProgramAddressSync(
            [new anchor.BN(1).toArrayLike(Buffer, "le", 8)],
            votingAddress,
        );

        const poll = await votingProgram.account.poll.fetch(pollAddress);
        console.log(poll);

        expect(poll.pollId.toNumber()).toEqual(1);
        expect(poll.description).toEqual("What is your favorite type of peanut butter?");
        expect(poll.pollStart.toNumber()).toBeLessThan(poll.pollEnd.toNumber());
    });

    it('initialize candidates', async () => {
        await votingProgram.methods.initializeCandidates(
            "Smooth",
            new anchor.BN(1),
        ).rpc();

        await votingProgram.methods.initializeCandidates(
            "Crunchy",
            new anchor.BN(1),
        ).rpc();

        const [cruncyAddress] = PublicKey.findProgramAddressSync(
            [new anchor.BN(1).toArrayLike(Buffer, "le", 8), Buffer.from("Crunchy")],
            votingAddress,
        );

        const cruncyCandidate = await votingProgram.account.candidates.fetch(cruncyAddress);
        console.log(cruncyCandidate);

        expect(cruncyCandidate.candidateVotes.toNumber()).toEqual(0);

        const [smoothAddress] = PublicKey.findProgramAddressSync(
            [new anchor.BN(1).toArrayLike(Buffer, "le", 8), Buffer.from("Smooth")],
            votingAddress,
        );

        const smoothCandidate = await votingProgram.account.candidates.fetch(smoothAddress);
        console.log(smoothCandidate);
        expect(smoothCandidate.candidateVotes.toNumber()).toEqual(0);
    });

    it("vote", async () => {
        await votingProgram.methods.vote(
            "Smooth",
            new anchor.BN(1),
        ).rpc();

        const [smoothAddress] = PublicKey.findProgramAddressSync(
            [new anchor.BN(1).toArrayLike(Buffer, "le", 8), Buffer.from("Smooth")],
            votingAddress,
        );
        const smoothCandidate = await votingProgram.account.candidates.fetch(smoothAddress);

        console.log(smoothCandidate);

        expect(smoothCandidate.candidateVotes.toNumber()).toEqual(1);
    });
})
