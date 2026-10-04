# Approval and Purchase Workflow

This is the required workflow for building the Twisted Game Book with AI.

## Stage 1 — Start from reality

Before inventing a game, check:
- what equipment is already owned;
- what existing game/material the owner wants to use;
- whether a similar game already exists in the book;
- whether the idea duplicates a household wildcard.

Use `EQUIPMENT-INVENTORY.md`.

## Stage 2 — AI proposes the complete concept

AI should not bring back just a title.

It should return a full draft game card with:
- name;
- plain-English explanation;
- players;
- setup;
- equipment;
- exact play steps;
- twist;
- win condition;
- scoring proposal;
- fouls;
- Blackout instructions;
- safety;
- duration;
- equipment gap.

The draft must preserve the urban/Rated-R event voice while remaining executable.

## Stage 3 — Pressure test it

Before presenting it as ready:
- Can somebody understand it in under two minutes?
- Is there one obvious winner?
- Can Blackout referee it?
- Can kids/adults safely play the approved version?
- Does it use equipment we already own?
- Is the twist actually fun or just random?
- Can the game finish on time?
- Can cheating/arguments be resolved from the written rules?
- Does it feel like Rival Day instead of school Field Day?

## Stage 4 — Owner review

The owner can:
- APPROVE;
- REVISE;
- REJECT.

AI must preserve corrections exactly.

Do not call a concept final before owner approval.

## Stage 5 — Inventory reconciliation

Once owner approves the game:

Compare every required item against `EQUIPMENT-INVENTORY.md`.

Create three lists:

### Already Have
Use confirmed inventory only.

### Need to Buy
Only required missing items.

### Optional / Upgrade
Nice-to-have presentation items that do not block gameplay.

For anything to buy, specify:
- exact item;
- exact quantity;
- size;
- material/type where it matters;
- why it is required.

## Stage 6 — Purchase ledger

Add required missing items to `PURCHASE-LEDGER.md`.

Do not duplicate an item if another approved game already requires it. Instead increase/reconcile the total quantity.

## Stage 7 — Final game card

After approval and inventory reconciliation:
- mark game OWNER-APPROVED or FINAL as appropriate;
- lock the rules;
- lock the required equipment;
- lock the Blackout notes;
- lock the safety section;
- record any remaining optional upgrades.

## Stage 8 — Event-ready check

Before game day:
- equipment physically present;
- quantities checked;
- field setup possible;
- referee understands rules;
- score sheet ready;
- mutation cards/die ready if applicable;
- backup/reset instructions clear.

Only then is the game **EVENT READY**.

## AI behavior rules

The AI continuing this project must:
- never invent owner approval;
- never silently change a locked game;
- never replace urban/plain-English wording with corporate language;
- never confuse funny copy with unclear rules;
- never add a shopping item without tying it to an approved game requirement;
- always state what is already owned versus missing;
- always identify unresolved mechanics instead of guessing.
