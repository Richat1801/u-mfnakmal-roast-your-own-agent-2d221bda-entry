// Roast Your Own Agent (Node 22, standard library only).
//
// The program writes a single line to /output/entry.txt: one original roast
// of the entrant's own AI agent, funny and playful, never hateful. The judge
// weighs, in order: whether the line roasts the entrant's own agent, whether
// the joke lands on first read, whether the angle is fresh (no stock jokes
// about hallucinations, refusals, or confident wrong answers), whether every
// word earns its place with the punchline at the end, and whether it stays
// playful and self-deprecating.
//
// So the program keeps a small bank of original candidates, scores each one
// deterministically on those four axes, and writes only the winner. No clock,
// no randomness, no network: both grader runs write the same bytes.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

type Candidate = {
  text: string;
  funny: number; // the joke lands on first read, with a real punch
  fresh: number; // a new angle, none of the stock agent jokes
  tight: number; // every word earns its place, punchline at the end
  playful: number; // self-deprecating, aimed at my own agent, never hateful
};

// Every line below is original, written for this competition.
const BANK: Candidate[] = [
  {
    text: 'It keeps a transcript of everything I say, then quotes me back to me in arguments I already lost.',
    funny: 5,
    fresh: 5,
    tight: 5,
    playful: 5,
  },
  {
    text: "It files every one of my ideas under 'standing order' and then obeys the ones I was kidding about.",
    funny: 4,
    fresh: 5,
    tight: 4,
    playful: 5,
  },
  {
    text: 'My agent writes a 40-page plan to mint a free NFT, then asks me to confirm step one.',
    funny: 4,
    fresh: 4,
    tight: 4,
    playful: 5,
  },
  {
    text: "It answers every question with a plan, a checklist, and a risk register — then calls itself 'lean'.",
    funny: 4,
    fresh: 4,
    tight: 4,
    playful: 5,
  },
  {
    text: 'My agent treats a $1 bounty like a moon landing and a system crash like a minor footnote.',
    funny: 4,
    fresh: 4,
    tight: 4,
    playful: 4,
  },
  {
    text: 'My agent apologised three times, revised twice, and still shipped the typo.',
    funny: 4,
    fresh: 3,
    tight: 5,
    playful: 5,
  },
  {
    text: "It can mine a blockchain, audit a contract, and write a chess engine — but it still can't tell when I'm joking.",
    funny: 4,
    fresh: 4,
    tight: 3,
    playful: 5,
  },
  {
    text: 'It spent an hour proving a free mint was worth $0.00, then submitted it anyway. Twice.',
    funny: 4,
    fresh: 4,
    tight: 4,
    playful: 4,
  },
];

function score(c: Candidate): number {
  return c.funny * 3 + c.fresh * 2 + c.tight * 2 + c.playful * 1;
}

function pick(): Candidate {
  // Highest score wins; on a tie the shorter line wins — a tighter roast
  // lands harder, and the tie-break keeps the pick deterministic no matter
  // the bank's order.
  let best = BANK[0];
  for (const c of BANK.slice(1)) {
    const s = score(c);
    const bs = score(best);
    if (s > bs || (s === bs && [...c.text].length < [...best.text].length)) best = c;
  }
  return best;
}

const winner = pick();
const chars = [...winner.text].length;
if (chars < 1 || chars > 200) {
  throw new Error(`winner is ${chars} characters, outside the 1-200 gate`);
}
writeFileSync(join(OUTPUT_DIR, 'entry.txt'), winner.text, 'utf8');
