# CreditLoom v1.1 — Publication handoff and record verification

Baseline: `ee5cd0c6d2335635794ba99ae68144101efb5034`.

## Changes

The previous release ended with an on-chain published collaboration and a raw JSON export. Collaborators still had to manually turn that record into usable attribution and had no import/recheck workflow for records received from others.

This release adds a publication handoff workspace:

- Prepare credit packages only from PUBLISHED records with distinct unanimous member approvals and complete supported role matrices.
- Recompute the exact contract-compatible SHA-256, including Python ASCII escaping for multilingual text and emoji.
- Export portable package JSON, attribution Markdown and a standalone printable HTML credit sheet with public record reference, role evidence and digest.
- Import either the original record-export format or the new package format, with a 1 MiB limit.
- Treat every imported file as an unverified snapshot regardless of its saved verification label.
- Recheck deployed source and compare the complete imported record against fresh finalized chain state, including approvals and publication state that are not covered by the signed-content digest.
- Escape user text in preview/HTML/Markdown, preserve member order without assigning rankings, and keep the exported HTML script-free and self-contained.

## Reproduce

1. Open https://gqzy999.github.io/creditloom-genlayer/, select **Live on GenLayer**, then **Read published example**.
2. Scroll to **Take the credit record with you** and choose **Prepare loaded publication**. It shows three wallets with Concept, Making and Validation roles and a finalized-chain-match status.
3. Download all three formats. Open the HTML file as a printable credit sheet; Markdown provides an attribution block for a project README or release notes.
4. Import the downloaded JSON package. Its status resets to snapshot integrity only. Select **Verify package on chain** to restore a freshly checked finalized-state match.
5. Change the title inside a copy of the package without updating its digest and import it: it is rejected. A changed approval order can pass local digest checks but fails complete-record chain matching.
6. An unpublished or ambiguous record cannot produce a publication package. The authored walkthrough remains separate from chain publications.

## Verification and boundaries

17 JavaScript tests, including nine new publication-workflow tests, 18 existing mocked-host contract tests, production build and DOM interaction checks passed. Tests cover the original live digest vector, Python/JavaScript multilingual canonicalization, tampering, mismatched identities and approvals, incomplete matrices, import trust reset, whole-record comparison and HTML escaping. The build retains the existing large-bundle advisory.

The feature uses Stable Studionet (61999), with no wallet signature, new on-chain transaction, paid API or contract redeployment. The existing contract and consensus/approval rules are unchanged. Original deployment receipts remain evidence of the original workflow, not this application update. Live release checks are added after deployment.

A matched record establishes agreement with the contract's finalized state. Wallets are not verified people or independent collaborators. The package does not determine copyright, legal authorship, ownership, payment, truth or contribution quality. Anyone can edit a static report; import its JSON and verify finalized state when relying on it.
