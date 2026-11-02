export type Project = {
  slug: string;
  name: string;
  category: string;
  title: string;
  description: string;
  tags: string[];
  type:
    | "gate"
    | "protocol"
    | "akibo"
    | "hookrelay"
    | "witness"
    | "ledger"
    | "arconta";
  scope: string;
  repo?: string;
  source: string;
  sourceLabel: string;
  architecture: string[];
};
export const projects: Project[] = [
  {
    slug: "constellation-gate",
    name: "Constellation Gate",
    category: "AI infrastructure / Security",
    title: "A stronger boundary for intelligent systems.",
    description:
      "A multi-tenant security gateway for LLM applications. From first architecture to engineering leadership.",
    tags: ["TypeScript", "Python", "PostgreSQL", "Redis", "AWS", "Docker"],
    type: "gate",
    scope: "Professional work · Constellation Network",
    source:
      "https://constellationnetwork.io/papers/gate-ai-prompt-injection-benchmark.pdf",
    sourceLabel: "Published benchmark",
    architecture: [
      "LLM application",
      "Tenant boundary",
      "Security evaluation",
      "Provider integration",
      "Response + audit",
    ],
  },
  {
    slug: "distributed-protocol",
    name: "Constellation Protocol",
    category: "Distributed systems",
    title: "Consistency, even when the network isn’t.",
    description:
      "Consensus, state synchronization and recovery in a production distributed protocol. Engineering for the moments when things go wrong.",
    tags: ["Scala", "Cats Effect", "AWS", "Docker", "Ansible"],
    type: "protocol",
    scope: "Professional work · Constellation Network",
    repo: "https://github.com/Constellation-Labs/tessellation",
    source: "https://github.com/Constellation-Labs/tessellation",
    sourceLabel: "Public protocol repository",
    architecture: [
      "Validator peers",
      "Consensus coordination",
      "Agreed snapshots",
      "State verification",
      "Recovery + synchronization",
    ],
  },
  {
    slug: "akibo",
    name: "Akibo",
    category: "AI / Fintech / Founder",
    title: "Conversational AI. Accountable money.",
    description:
      "A personal-finance assistant connecting natural conversation to structured financial operations, with integrity at its core.",
    tags: ["TypeScript", "Node.js", "Next.js", "PostgreSQL", "Redis"],
    type: "akibo",
    scope: "Independent product · Founder, 2026 · Closed source",
    source: "https://github.com/marcus-girolneto#akibo-closed-source",
    sourceLabel: "Public project overview",
    architecture: [
      "WhatsApp / Telegram",
      "Agent orchestration",
      "Validated tools",
      "Financial reconciliation",
      "Tenant-isolated data",
    ],
  },
  {
    slug: "arconta",
    name: "Arconta",
    category: "SaaS / Fiscal infrastructure",
    title: "Complex tax rules. Traceable decisions.",
    description:
      "A private SaaS project for Brazilian accounting firms, turning fiscal XML into explainable validation and correction workflows.",
    tags: ["TypeScript", "Fastify", "Next.js", "PostgreSQL", "Zod"],
    type: "arconta",
    scope: "Independent product · Private repository · Pilot",
    source: "https://arconta.com.br",
    sourceLabel: "Product website",
    architecture: [
      "Fiscal document intake",
      "Schema validation",
      "Deterministic fiscal rules",
      "Traceable findings",
      "Correction workflow",
    ],
  },
  {
    slug: "hookrelay",
    name: "Hookrelay",
    category: "Backend infrastructure",
    title: "Delivery is a process. Reliability is a system.",
    description:
      "Durable, signed webhooks with jittered retries, fenced worker leases and a path back from the dead-letter queue.",
    tags: ["Go", "PostgreSQL", "HMAC", "SKIP LOCKED"],
    type: "hookrelay",
    scope: "Independent open-source project",
    repo: "https://github.com/marcus-girolneto/hookrelay",
    source: "https://github.com/marcus-girolneto/hookrelay/blob/main/README.md",
    sourceLabel: "Repository documentation",
    architecture: [
      "Idempotent publish",
      "PostgreSQL queue",
      "Leased workers",
      "HMAC-signed HTTP",
      "Retry / dead letter",
    ],
  },
  {
    slug: "witness",
    name: "Witness",
    category: "Security / Cryptography",
    title: "Trust the proof. Verify the history.",
    description:
      "An append-only transparency log with Merkle proofs, signed checkpoints and monitoring that detects conflicting histories.",
    tags: ["Go", "Merkle trees", "Ed25519", "RFC 6962"],
    type: "witness",
    scope: "Independent open-source project",
    repo: "https://github.com/marcus-girolneto/witness",
    source: "https://github.com/marcus-girolneto/witness/blob/main/README.md",
    sourceLabel: "Repository documentation",
    architecture: [
      "Append request",
      "Durable sequencer",
      "Merkle frontier",
      "Signed checkpoint",
      "Independent verification",
    ],
  },
  {
    slug: "ledger",
    name: "Ledger",
    category: "Financial infrastructure",
    title: "When every entry has to add up.",
    description:
      "Double-entry accounting with database-enforced invariants, immutable history and concurrency-safe balances.",
    tags: ["TypeScript", "Fastify", "PostgreSQL"],
    type: "ledger",
    scope: "Independent open-source project",
    repo: "https://github.com/marcus-girolneto/ledger",
    source: "https://github.com/marcus-girolneto/ledger/blob/main/README.md",
    sourceLabel: "Repository documentation",
    architecture: [
      "Idempotency key",
      "Balanced posting",
      "Ordered account locks",
      "Database constraints",
      "Immutable journal",
    ],
  },
];
