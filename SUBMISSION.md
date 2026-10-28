# CreditLoom

## Project name

CreditLoom

## Primary category

Social

## Short description

Signed contribution statements, GenLayer role consensus, and unanimous publication of shared credit records for creative teams.

## Application

https://gqzy999.github.io/creditloom-genlayer/

## Source repository

https://github.com/gqzy999/creditloom-genlayer

## What it does

CreditLoom gives small creative teams a shared record of who contributed the idea, produced the work, and reviewed it. Each invited wallet signs its own specific contribution statement. GenLayer validators independently interpret every member against three fixed, non-exclusive roles: Concept, Making and Validation.

A complete agreeing role matrix controls the contract state. Any unclear role, or a member with no supported role, blocks approval. When the matrix is ready, each member approves the exact same record digest. Publication is possible only after all invited members have approved. The organizer cannot replace a member's statement, approve on another wallet's behalf, or override uncertainty.

The application includes an authored walkthrough, live wallet-signed operations, source verification, transaction recovery, public chain reads and JSON exports. It uses one canonical Intelligent Contract included in this repository.

## Why GenLayer is necessary

Interpreting an action described in ordinary language is semantic. Validators independently repeat the full classification, check exact quotations against the corresponding signed statement, and compare every role label. Consensus directly determines whether approval can open; it is not decorative advice from an application server. Deterministic code handles membership, immutable inputs, digest binding and unanimous publication.

The authoritative inputs for this bounded workflow are statements signed by the invited wallets. The contract does not authenticate the truth of contributions, fetch outside sources, verify personal identity or determine legal authorship, copyright, payment or contribution quality. One person can control multiple wallets. A published record expresses acceptance by the invited wallets only.

## Quick demonstration

1. Open the application and inspect **Worked example**. Select each contributor to inspect the statement and role findings. This authored illustration sends no transactions.
2. Choose **Live on GenLayer → Read published example**. No wallet is needed to read the real, finalized example. Check the **PUBLISHED** state, three approvals and the record digest.
3. Use **Export record** to download the chain readback. Inspect `evidence/studionet.json` for the corresponding finalized transactions.
4. To create a new work, connect a wallet on Stable Studionet, enter a fresh work ID and invite 2–5 wallets including the owner. Each member signs its own declaration. Interpret contributions, inspect the evidence, have every member approve the exact record, then publish.

## Deployment and validation

- Network: Stable Studionet, chain ID 61999.
- RPC: https://studio.genlayer.com/api
- Contract: `0x28674A7695E31Cea2A97206345b5eFe60B0ecFA6`
- Protocol: `creditloom-1`
- Published example owner: `0xbc9bd70f71b88358d22a143273d824a5d38528e3`
- Published example ID: `atlas-1793167572872`
- Publication transaction: `0xce8bcf8a021c0c4eb27e3f93d8ed111cbcfdd433e1b8db49de5c48322139b7a1`
- 13 finalized network transactions cover the complete lifecycle plus replacement-declaration, early-publication and wrong-digest rejection.
- 18 mocked-host contract tests and 8 frontend guard tests pass. The production build passes.
- The fixture is a synthetic creative work with three controlled test wallets. It does not establish independent people or authenticate an exhibition.
- The deployed application has been checked for direct access and successful published-example readback. Browser submission and recovery were tested with a temporary zero-gas signer; the published evidence does not cover injected OKX/MetaMask signing.

## Continued use

The shared deployment serves independent work records in owner namespaces. Small illustration, website and exhibition teams can repeat the workflow for each completed collaboration. The static application requires no paid AI API key or application backend. All writes transfer zero value on Stable Studionet. Corrections need a new work record and fresh signatures; no administrator can rewrite an agreed attribution table.

## Logo

`public/creditloom-logo-1024.png` — 1024 × 1024 PNG, below 2 MB.
