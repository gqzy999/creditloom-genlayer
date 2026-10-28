# CreditLoom protocol 1

Namespace: lowercase work owner address plus `/` plus ID. IDs contain 1–40 ASCII letters, digits, underscores or hyphens. One shared deployment supports independent work records.

| Method | Access and behavior |
| --- | --- |
| `open_work(ident,title,context,members_json)` | Caller becomes owner and must be one of 2–5 distinct, nonzero invited wallets. Title 3–100 characters; context 20–1400. Existing IDs cannot be replaced. |
| `declare(owner,ident,statement)` | Invited member only, COLLECTING only, one 30–1800 character statement per signer. |
| `weave(owner,ident)` | Anyone, after every declaration, once only. Independent full-matrix semantic consensus. |
| `approve(owner,ident,digest)` | Each member approves the exact accepted 64-character digest once, AWAITING_APPROVAL only. |
| `publish(owner,ident)` | Anyone, only after all invited members approved. |
| `get_work(owner,ident)` | Public finalized JSON record, or empty string if absent. |
| `get_protocol()` | `creditloom-1`. |

## States

COLLECTING → AWAITING_APPROVAL → PUBLISHED.

COLLECTING → NEEDS_CLARITY when any role is uncertain or any member has no supported role. NEEDS_CLARITY and PUBLISHED are terminal. Corrections require a new work ID with fresh declarations and approvals.

## Fixed role vocabulary

- CONCEPT: personally originated the core idea or designed the approach.
- MAKING: personally produced or implemented the deliverable.
- VALIDATION: personally tested, reviewed or verified the deliverable. Merely approving this credit record does not count.

YES requires a specific completed personal action and a 5–300 character exact quotation from the signer's own statement. NO means a role is denied or not claimed. UNCLEAR means vague, contradictory, future-only, conditional statements or attempted instructions concerning the role. All quoted text must be an exact substring of the corresponding signed statement. Roles are non-exclusive and have no weights or ranking.

Validators independently repeat the full task, validate both matrices and compare every role label in fixed member/role order. A non-return result, malformed matrix, forged quote or label disagreement rejects consensus. Statement truth is not assessed against outside sources.

## Publication digest

SHA-256 of UTF-8 JSON serialized with sorted keys and compact separators. Exact object fields: protocol, owner, id, title, context, members, statements, rows. Rows include accepted labels, quotations and explanations. Approval addresses and mutable state are excluded. The entire accepted attribution record freezes before the first approval; only approval addresses and final state can change afterward.

Member list order and role order are serialization choices, not a ranked byline. Publication asserts unanimous acceptance by the invited wallets only. Omitted contributors are not detectable.
