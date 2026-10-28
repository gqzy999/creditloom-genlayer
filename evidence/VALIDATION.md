# Verification boundaries

The frontend guard suite has 5 passing tests. The Python mocked-host suite has 18 passing tests covering membership, statement immutability, complete-input guards, independent validator disagreement, exact quote checks, full-matrix order, unclear/empty attribution, digest binding, all-member approval and terminal publication. These tests do not execute the real GenVM or prove model accuracy.

The Vite production build passes. Browser checks cover the authored example's three approvals and publication, member/role inspection, and isolation of the live workspace from illustrative records. Live network receipts and exact finalized readback are recorded in `studionet.json`; only confirmed results in that file are evidence of network execution.

The network fixture uses three test wallets controlled by one operator and a synthetic creative work. It does not demonstrate independent human identity or authenticate an exhibition. No user's private keys are requested, exported or included. All writes use Stable Studionet (61999), full consensus and zero transferred value. `network.html` and `mobile.html` are local development utilities excluded from the production build.

## Confirmed network result

The 13 transactions in `studionet.json` are finalized. Successful steps have MAJORITY_AGREE and successful leader execution. Three negative-path transactions confirm rejection of replacement declarations, premature publication and the wrong digest. The live role matrix is diagonal: first member CONCEPT, second MAKING, third VALIDATION. All three member approvals exist and the final readback is PUBLISHED.

The application itself submitted a separate `open_work` transaction from a generated temporary signer: `0x26658c36751a08bc91525905ab52ae9e9ec5189c16ca75a9a9931fe955f51b2d`. It finalized with majority agreement. An initial readback failed when the frontend used a lowercase contract address; standardizing RPC target addresses to EIP-55 with viem `getAddress` repaired the read. **Resume tracking** then validated the same receipt and returned the exact COLLECTING record without a second submission. This is a browser test of opening/recovery, not a complete multi-person injected-wallet test. Injected OKX/MetaMask signing has not been tested in this environment.

The responsive page was inspected at desktop width and through a 390-pixel iframe. No claim of testing every physical mobile device is made.
