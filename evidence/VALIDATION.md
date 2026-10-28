# Verification

## Automated checks

Eight frontend guard tests and eighteen mocked-host contract tests pass. They cover finalized execution guards, membership, immutable declarations, full-matrix ordering, exact quotation checks, independent validator disagreement, unclear and empty attribution, digest binding, unanimous approval and terminal publication. Receipt recovery accepts a matching immutable work even when other members have already advanced its state, and rejects a different work. These checks do not prove model accuracy or real network consensus. The production build passes.

## Published network example

`studionet.json` records thirteen finalized transactions on Stable Studionet (61999). Successful calls have MAJORITY_AGREE and successful leader execution. Three rejection cases cover replacing a declaration, publishing before unanimous approval and approving the wrong digest. The accepted role matrix is diagonal: Concept, Making and Validation. The final record contains all three approvals and is PUBLISHED.

The source SHA-256 in `public/deployment.json` matches the bundled contract. The published record digest matches its immutable fields. `live-readback.json` contains a finalized application readback and the selected contract, owner and work ID.

The fixture is a synthetic creative work with three controlled test wallets. It does not establish independent people or authenticate an exhibition. Signed declarations are the authoritative inputs for this bounded workflow; linked external sources are not fetched.

## Browser checks

The deployed GitHub Pages application supports direct access, published-example reading and JSON export. The authored walkthrough supports contributor inspection, three approvals and example publication; it is labelled separately from chain records. A separate application-submitted `open_work` transaction, `0x26658c36751a08bc91525905ab52ae9e9ec5189c16ca75a9a9931fe955f51b2d`, finalized with majority agreement. Resume tracking validated that same transaction and matching state without a second submission.

Browser signing and recovery evidence uses a temporary zero-gas signer. It does not cover the complete multi-person flow with injected OKX or MetaMask wallets. Responsive layout was inspected at desktop and 390-pixel widths; this is not a claim of testing every physical mobile device.

`network.html` and `scripts/network.js` are reproducible local network-check tools excluded from the production build. Their generated test keys stay in browser session storage and are excluded from public evidence exports. No user's private keys are requested or included in the repository. All network writes transfer zero value and use full consensus.
