# WQC Trading Helpers

This is a standalone local tool for three WQC games:

- `Game 2: Octomarket`
- `Game 3: Triplet of Pairs`
- `Game 5: Infinite Auction`

## Included

### Game 2: Octomarket

- `WIN A`, `WIN B`
- `ODD A`, `ODD B`
- `DIV A`, `DIV B`
- `SPREAD S`, `SPREAD L`

It computes:

- the expected settlement of every symbol
- the exact probability of each possible payout

### Game 3: Triplet of Pairs

It lets you:

- choose whether your team is on `A`, `B`, or `C`
- enter the rolls you have seen so far for your event
- enter best bid and lowest ask for `AB`, `BC`, and `AC`
- see your exact posterior fair value for your event
- see the fair value of the identity combo for your event
- get buy/sell/hold guidance for each market and for the combo trade

### Game 5: Infinite Auction

It lets you:

- enter your bids for each of the 20 rounds
- see your running cumulative bid sum `B`
- see the exact packet penalty `phi(B) = B^(ln(pi)) / 100`
- see the focused round's direct contribution to `B` and marginal contribution to `phi(B)`
- enter a decimal round value and see the maximum profitable bid for the focused round
- use a lookup table with 20 benchmark `B` values between `1` and `1000`

## Run it

From this folder:

```bash
./serve.sh
```

Then open:

```text
http://localhost:8000
```

## GitHub Pages

This repo is set up to publish through a GitHub Actions workflow.

In GitHub:

1. Open `Settings -> Pages`.
2. Under `Build and deployment`, set `Source` to `GitHub Actions`.
3. Push to `main` to trigger the deploy workflow.

Once that is enabled, pushes to `main` will automatically update:

```text
https://bobxiong88.github.io/wqc/
```

## How to use it

1. Start the server with `./serve.sh`.
2. Open `http://localhost:8000`.
3. Use the home page to open `Game 2: Octomarket`, `Game 3: Triplets`, or `Game 5: Auction`.
4. Enter the board password when prompted.

### Octomarket

1. Leave future minutes blank.
2. Enter the revealed `A1/B1`, `A2/B2`, and so on.
3. The big number on each contract card is the expected settlement.
4. The bars show the exact payout probabilities.

### Triplets

1. Select whether you are on `A`, `B`, or `C`.
2. Enter the rolls you have seen for your event so far.
3. Enter the best bid and lowest ask for `AB`, `BC`, and `AC` if you have them.
4. Read the summary row for your event fair, next-roll EV, and synthetic combo bid/ask.
5. Read the recommendation cards for direct trades and the identity combo.

### Infinite Auction

1. Enter the bids you have submitted so far for each round.
2. Leave future rounds blank.
3. Read `B` as the sum of your entered bids.
4. Read `phi(B)` as the exact endgame bid penalty from the packet.
5. Click into any round to see that entry's contribution to `B` and incremental contribution to `phi(B)`.
6. Enter the current round value to get the maximum bid whose incremental `phi(B)` stays at or below that value.
7. Scroll to the lookup table for quick `B -> phi(B)` benchmark values between `1` and `1000`.

## Notes

- All results are computed from the official packet rules.
- The Octomarket divisor contracts are exact, not Monte Carlo.
- The Triplets event fair values use an exact Bayesian posterior over the hidden 5-face die.
- The Infinite Auction calculator uses `phi(B) = B^(ln(pi)) / 100` exactly as written in the packet.
