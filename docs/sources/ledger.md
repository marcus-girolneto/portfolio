# Ledger

[![CI](https://github.com/marcus-girolneto/ledger/actions/workflows/ci.yml/badge.svg)](https://github.com/marcus-girolneto/ledger/actions/workflows/ci.yml)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6)
![License](https://img.shields.io/badge/license-MIT-blue)

A double-entry ledger service in TypeScript. It records money movements as balanced, immutable journal entries, makes every write idempotent, and stays correct under concurrent load.

The stack is a Fastify API on PostgreSQL and a React dashboard. The core invariants are enforced in the database itself, so a bug in application code cannot leave the books unbalanced.

![Dashboard](docs/dashboard.png)

## Why this exists

Payment systems, wallets and marketplaces all need a ledger, and most of their worst bugs live there: double charges on retried requests, balances that drift from their history, overdrafts caused by race conditions. This project implements the patterns that prevent those bugs, and its test suite tries to break each one.

## Guarantees

| Invariant                                        | How it is enforced                                                                                                  |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| Every transaction balances: debits equal credits | Validated in the service and rechecked by a deferred constraint trigger at commit                                   |
| A transaction never mixes currencies             | Validated in the service and rechecked by the same trigger                                                          |
| History is immutable                             | `UPDATE` and `DELETE` on `entries` and `transactions` are rejected by triggers. Corrections are posted as reversals |
| Accounts that disallow it never go negative      | Checked before posting and backed by a `CHECK` constraint on `accounts`                                             |
| Retried requests never post twice                | `Idempotency-Key` stored under a unique index together with a SHA-256 fingerprint of the request                    |
| Concurrent writes cannot overdraw or deadlock    | Accounts are locked with `SELECT … FOR UPDATE` in a deterministic order, and serialization failures are retried     |
| Stored balances match their history              | `GET /reports/trial-balance` recomputes every balance from its entries and reports any drift                        |

## Quick start

Requirements: Docker.

```sh
docker compose up -d --build
docker compose exec api node dist/cli/seed.js
```

- Dashboard: http://localhost:8080
- API: http://localhost:3000

If those ports are taken, set `WEB_PORT` or `API_PORT`, for example `WEB_PORT=8088 docker compose up -d`.

The seed creates a small wallet scenario in BRL: operating cash, two customer wallets, owner equity and a fee revenue account, plus a transfer that charges a fee. It is idempotent, so running it again changes nothing.

## Local development

Requirements: Node.js 22+ and Docker for PostgreSQL.

```sh
npm install
docker compose up -d db
cp apps/api/.env.example apps/api/.env
npm run migrate -w @ledger/api
npm run seed -w @ledger/api
npm run dev:api
npm run dev:web
```

The web app runs on http://localhost:5173 and proxies `/api` to the API on port 3000.

| Script              | Purpose                                 |
| ------------------- | --------------------------------------- |
| `npm test`          | Runs API and web test suites            |
| `npm run typecheck` | Strict type checking in every workspace |
| `npm run lint`      | ESLint with typescript-eslint           |
| `npm run format`    | Prettier                                |
| `npm run build`     | Production builds                       |

## Domain model

```mermaid
erDiagram
    accounts ||--o{ entries : "has"
    transactions ||--|{ entries : "groups"
    transactions |o--o| transactions : "reverses"

    accounts {
        uuid id PK
        text code UK
        account_type type
        text currency
        bool allow_negative
        bigint balance
        bigint version
    }
    transactions {
        uuid id PK
        text idempotency_key UK
        text request_hash
        text description
        uuid reverses_id UK
    }
    entries {
        bigint id PK
        uuid transaction_id FK
        uuid account_id FK
        entry_direction direction
        bigint amount
        bigint balance_after
    }
```

Accounts follow standard accounting rules. Asset and expense accounts increase with debits. Liability, equity and revenue accounts increase with credits. A customer wallet is a liability: the platform owes that money to the customer. That is why a deposit debits cash and credits the wallet.

Each entry stores `balance_after`, so an account statement is a single indexed range scan with no running sum needed at read time.

## How a posting works

```mermaid
sequenceDiagram
    participant C as Client
    participant A as API
    participant D as PostgreSQL

    C->>A: POST /transactions (Idempotency-Key)
    A->>A: validate legs, assert debits = credits
    A->>D: BEGIN
    A->>D: INSERT transaction ON CONFLICT (idempotency_key) DO NOTHING
    alt key already used
        A->>D: load stored transaction and compare fingerprints
        A-->>C: 200 replay, or 409 if the payload differs
    else new key
        A->>D: SELECT accounts … ORDER BY id FOR UPDATE
        A->>A: compute balances, reject overdraft or currency mismatch
        A->>D: INSERT entries, UPDATE balances
        A->>D: COMMIT (deferred trigger rechecks the balance)
        A-->>C: 201 Created
    end
```

A failed request rolls back its idempotency claim, so a client can fix the cause, such as insufficient funds, and retry with the same key. Only successful results are stored and replayed.

## API

Amounts are integers in the currency's minor unit, sent as strings, so `"1250"` is R$ 12.50. Strings keep full 64-bit precision, which JSON numbers cannot guarantee.

| Method | Path                                 | Description                                             |
| ------ | ------------------------------------ | ------------------------------------------------------- |
| `POST` | `/accounts`                          | Create an account                                       |
| `GET`  | `/accounts`                          | List accounts                                           |
| `GET`  | `/accounts/:id`                      | Get an account with its current balance                 |
| `GET`  | `/accounts/:id/entries?limit&before` | Account statement, newest first, cursor paginated       |
| `POST` | `/transactions`                      | Post a balanced transaction. Requires `Idempotency-Key` |
| `GET`  | `/transactions/:id`                  | Get a transaction with its entries                      |
| `POST` | `/transactions/:id/reversal`         | Post the mirror image of a transaction. Idempotent      |
| `GET`  | `/reports/trial-balance`             | Totals per currency and any balance discrepancies       |
| `GET`  | `/health`                            | Liveness and database connectivity                      |

Create two accounts:

```sh
curl -s localhost:3000/accounts -H 'content-type: application/json' \
  -d '{"code":"1000","name":"Operating cash","type":"asset","currency":"BRL"}'

curl -s localhost:3000/accounts -H 'content-type: application/json' \
  -d '{"code":"2000","name":"Wallet: Ana","type":"liability","currency":"BRL"}'
```

Post a deposit of R$ 150.00:

```sh
curl -s localhost:3000/transactions \
  -H 'content-type: application/json' \
  -H 'idempotency-key: deposit-7f3a' \
  -d '{
    "description": "Deposit via PIX",
    "entries": [
      { "accountId": "<cash id>", "direction": "debit", "amount": "15000" },
      { "accountId": "<wallet id>", "direction": "credit", "amount": "15000" }
    ]
  }'
```

Sending the same request again returns `200` with `idempotent-replayed: true` and the original transaction. Reusing the key with a different body returns `409`.

Errors share one shape:

```json
{
  "error": {
    "code": "insufficient_funds",
    "message": "Account 2000 has insufficient funds",
    "details": { "accountId": "…", "balance": "15000", "resultingBalance": "-5000" }
  }
}
```

| Status | Codes                                                                                                              |
| ------ | ------------------------------------------------------------------------------------------------------------------ |
| 400    | `invalid_request`, `idempotency_key_required`                                                                      |
| 404    | `not_found`                                                                                                        |
| 409    | `conflict`, `idempotency_key_reused`                                                                               |
| 422    | `unbalanced_transaction`, `insufficient_funds`, `currency_mismatch`, `unknown_account`, `irreversible_transaction` |

## Testing

110 tests in total. The API tests run against a real PostgreSQL database. Nothing in the data layer is mocked, because the guarantees above only mean something if the database is part of the test.

```sh
docker compose up -d db
npm test
```

| Suite                      | What it proves                                                                                                                                                                 |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `posting.test.ts`          | Normal-balance rules, balancing, running balances, overdraft and currency checks, stable request fingerprints                                                                  |
| `transactions.test.ts`     | End-to-end posting, validation, idempotent replay and key reuse, reversals, pagination, trial balance                                                                          |
| `database.test.ts`         | Invariants hold even when the service layer is bypassed with raw SQL                                                                                                           |
| `concurrency.test.ts`      | 50 concurrent withdrawals against one balance, 20 concurrent requests sharing a key, opposite-order transfers without deadlocks, reconciliation after a burst of mixed traffic |
| `migrate.test.ts`          | Migrations are idempotent and safe to run concurrently                                                                                                                         |
| `apps/web/**/*.test.ts(x)` | Currency parsing and formatting across ISO 4217 minor units, the API client, and component behavior including idempotency-key reuse on retry                                   |

The test database is set by `TEST_DATABASE_URL` and defaults to `postgres://ledger:ledger@localhost:5433/ledger_test`. It is recreated on every run.

## Design decisions

**Integers in minor units, never floats.** Amounts are stored as `bigint` and handled as `BigInt` in TypeScript. Formatting reads the currency's minor units from `Intl`, so JPY (0 decimals) and BHD (3 decimals) work without special cases.

**Pessimistic locking over optimistic retries.** Posting is a read-modify-write on hot rows. Locking accounts in id order serializes conflicting writers without aborting them and makes deadlocks impossible by construction. Each account also keeps a `version` counter for consumers that need change detection.

**Balance stored and derived.** Reading `accounts.balance` is O(1), and the entries remain the source of truth. The trial balance report recomputes balances from entries, so any drift becomes visible instead of silent.

**Reversals instead of edits.** A mistake is corrected by posting its mirror image, linked through `reverses_id`. The unique constraint on that column allows at most one reversal per transaction, and a reversal cannot itself be reversed.

**Database as the last line of defense.** The service rejects bad input with clear errors. The database enforces the same rules so that scripts, migrations or future services cannot violate them either.

## Project structure

```
apps/
  api/
    migrations/          SQL schema, triggers and constraints
    src/
      accounts/          account model, repository and routes
      transactions/      posting rules, idempotency, reversals
      reports/           trial balance and reconciliation
      cli/               migrate and seed commands
      server.ts          Fastify app and error mapping
    test/                integration, invariant and concurrency tests
  web/
    src/
      components/        accounts, statement, posting and report views
      api.ts             typed API client
      money.ts           minor-unit parsing and formatting
```

## Roadmap

- Authentication and per-tenant isolation
- Transactional outbox to publish posted transactions as events
- Holds and authorizations, with a pending balance separate from the available balance
- Multi-currency transactions through FX clearing accounts
- Time-based partitioning of `entries` for very large ledgers

## License

[MIT](LICENSE)
