# CreditLoom

**Every contribution has a thread.** A shared credit desk for small creative collaborations: each invited wallet signs its own contribution, GenLayer reaches consensus on contribution roles, and every member must approve the same exact record before publication.

## Use the workspace

1. Explore the **Worked example**. Select Mira, Sol or Jun to inspect their contribution statement and role evidence. Add three example approvals and publish the illustration. This is authored practice data, never a chain claim.
2. Switch to **Live on GenLayer** and choose **Read published example** to read the finalized record without a wallet.
3. For a new collaboration, connect an injected Ethereum-compatible wallet on **Stable Studionet, chain 61999**, or use a temporary zero-gas session. Enter a fresh work ID, title, context and 2–5 distinct member wallet addresses, including your own.
4. **Open collaboration** fixes the work and invited members. Share the contract address, work owner and ID with the other contributors.
5. Every invited wallet signs its own immutable contribution statement. Describe concrete completed actions; no one can sign for another member.
6. Once all statements exist, **Interpret contributions**. GenLayer independently assesses Concept, Making and Validation for every member. Any UNCLEAR cell, or a member with no YES role, moves the work to NEEDS_CLARITY and blocks approval. A correction requires a new collaboration.
7. Inspect every statement and role finding. Each member chooses **Approve this exact record**, signing the immutable record digest. After all approvals, anyone can **Publish after all approvals**.
8. Export the chain record, selected contract/owner/ID and any loaded transaction receipt as JSON. The published record is immutable.

Temporary signing keys exist only in the current page's memory. Reloading loses signing access; save the public work reference first. Use an injected wallet for continuing collaborations. Never send funds to temporary addresses.

## Why GenLayer is central

Natural-language statements express actions in many ways. Validators independently interpret each person's own statement under the same fixed role definitions. All nine labels in a three-person collaboration must agree; explanations may vary. Exact quotations are checked against that member's signed statement. A malformed output, missing YES evidence or disagreement cannot open approval.

The consensus result is executable state: an unclear result blocks every approval, and the organizer has no override. Deterministic code handles membership, immutable statements, record hashing, individual approvals and unanimous publication. The model never ranks people, assigns percentages, transfers funds or publishes a record by itself.

This is a bounded creative-work contribution vocabulary, **not the CRediT taxonomy**, an authorship eligibility test or an academic authorship policy.

## Run locally

Node.js 22+ and Python 3.12+:

```sh
npm ci
npm test
python -m unittest discover -s contract-tests -v
npm run dev
```

```sh
npm run build
```

The portable static build is `dist/`. GenLayerJS 1.1.8 and viem 2.57.8 are pinned. No application backend, paid AI API key or fund custody is required. The contract dependency is pinned in its first line. Deploy `contracts/creditloom.py` with no constructor arguments on Stable Studionet, using full consensus.

The frontend verifies the deployed source and protocol before access. Writes persist a pending intent before requesting a signature and save the returned hash immediately. Unknown send outcomes remain locked. **Resume tracking** reads the exact existing transaction; it does not resend. A user-rejected signature releases the intent. A finalized successful receipt must bind to the correct signer, contract, method and arguments, followed by matching chain state readback.

## Trust and scope

- A signature establishes control of a wallet, not a verified person, independent collaborator or real-world identity. One person can control several wallets.
- Signed declarations are the authoritative inputs **for this workflow only**. Their truth, originality, work provenance and completeness are not independently authenticated. URLs in text are not fetched.
- This record does not determine copyright, legal authorship, payment, contribution quality or ownership. Multiple members may hold the same role. Member list order is not credit ranking.
- Every invited member has veto power through withheld declaration or approval. There is no timeout, member replacement, deletion, edit, appeal or administrator override. Create a fresh work to correct inputs.
- All submitted context and statements are public on the chain. Use public creative-work examples and avoid confidential information. Model error and validator disagreement remain possible.
- Published examples use synthetic work and controlled test wallets, not independent artists or a real institutional endorsement.

## Files

- `contracts/creditloom.py` — the canonical Intelligent Contract.
- `src/main.js`, `src/style.css` — contribution desk, authored walkthrough and live workflow.
- `src/chain.js`, `src/utils.js` — network access, source and receipt checks.
- `PROTOCOL.md` — API and invariants.
- `contract-tests/`, `tests/` — mocked-host state tests and frontend guard tests.
- `network.html`, `scripts/network.js` — local-only resumable network validation tool; not included in the production build. Test keys remain in browser session storage and are excluded from public exports.
- `evidence/` — actual network receipts and verification boundaries.
- `public/creditloom-logo-1024.png` — submission image.

MIT · gqzy999
