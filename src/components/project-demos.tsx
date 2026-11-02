"use client";
import { useLanguage } from "./language-provider";
import { localizeTree, translate } from "@/lib/i18n";
import { useEffect, useState } from "react";
import { Check, Fingerprint, RotateCcw } from "lucide-react";
import { buildTree } from "@/lib/merkle";
import { postDeposit } from "@/lib/simulations";
export function MerkleDemo() {
  const language = useLanguage();
  const [selected, setSelected] = useState(0);
  const [tampered, setTampered] = useState(false);
  const [tree, setTree] = useState<Awaited<
    ReturnType<typeof buildTree>
  > | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    let active = true;
    buildTree([
      "release 1",
      tampered ? "modified entry" : "release 2",
      "release 3",
      "release 4",
    ])
      .then((t) => {
        if (active) setTree(t);
      })
      .catch(() => {
        if (active) setError(true);
      });
    return () => {
      active = false;
    };
  }, [tampered]);
  return localizeTree(
    <div className="proof-demo">
      <div className="demo-heading">
        <Fingerprint size={18} />
        <span>Explore a Merkle inclusion path</span>
      </div>
      <p>
        Choose an entry. Blue marks its path; cyan marks the sibling hashes
        needed for its proof.
      </p>
      <div className="interactive-tree">
        <div className={`hash-node root-hash ${tampered ? "changed" : ""}`}>
          ROOT <code>{tree?.root.slice(0, 12) || "computing…"}</code>
        </div>
        <div className="tree-branches">
          <span />
          <span />
        </div>
        <div className="tree-level">
          {[0, 1].map((i) => (
            <div
              className={`hash-node ${Math.floor(selected / 2) === i ? "on-path" : "proof-sibling"}`}
              key={i}
            >
              H{i * 2}
              {i * 2 + 1}
              <code>{tree?.parents[i].slice(0, 10) || "…"}</code>
            </div>
          ))}
        </div>
        <div className="tree-branches four">
          <span />
          <span />
          <span />
          <span />
        </div>
        <div className="tree-level">
          {[0, 1, 2, 3].map((i) => (
            <button
              className={`hash-node leaf-node ${selected === i ? "on-path" : (selected ^ 1) === i ? "proof-sibling" : ""} ${tampered && i === 1 ? "changed" : ""}`}
              key={i}
              onClick={() => setSelected(i)}
              aria-pressed={selected === i}
            >
              Entry {i + 1}
              <code>{tree?.leaves[i].slice(0, 7) || "…"}</code>
            </button>
          ))}
        </div>
      </div>
      <label className="check-control">
        <input
          type="checkbox"
          checked={tampered}
          onChange={(e) => setTampered(e.target.checked)}
        />{" "}
        Modify entry 2 and recompute
      </label>
      <div className="proof-status" role="status">
        {error
          ? "Web Crypto is unavailable. Open this demonstration over HTTPS or localhost."
          : tampered
            ? "Entry 2 changed. Its leaf hash, parent and root now change. An old root no longer commits to these entries."
            : translate(
                language,
                "Entry {n} uses two sibling hashes to reconstruct the root. Real SHA-256; RFC 6962 domain separation.",
                { n: selected + 1 },
              )}
      </div>
      <small>
        Educational four-leaf tree. No signed checkpoint or full consistency
        verifier.
      </small>
    </div>,
    language,
  );
}
export function LedgerDemo() {
  const language = useLanguage();
  const [state, setState] = useState({
    posted: false,
    replayed: false,
    count: 0,
  });
  return localizeTree(
    <div className="proof-demo">
      <div className="demo-heading">
        <Check size={18} /> Balanced by construction
      </div>
      <p>
        Post a BRL 150.00 deposit, then repeat it with the same idempotency key.
      </p>
      <div className="idempotency-key mono">
        IDEMPOTENCY KEY <span>deposit-demo-001</span>
      </div>
      <div className="demo-ledger-table">
        <table>
          <caption className="sr-only">
            Illustrative double-entry deposit
          </caption>
          <thead>
            <tr>
              <th>Account</th>
              <th>Debit</th>
              <th>Credit</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>Operating cash</th>
              <td>{state.posted ? "150.00" : "0.00"}</td>
              <td>—</td>
            </tr>
            <tr>
              <th>Customer wallet</th>
              <td>—</td>
              <td>{state.posted ? "150.00" : "0.00"}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="lab-actions">
        <button
          className="button button-primary button-small"
          onClick={() => setState(postDeposit)}
        >
          {state.posted ? "Replay same request" : "Post deposit"}
        </button>
        <button
          className="text-button"
          onClick={() => setState({ posted: false, replayed: false, count: 0 })}
        >
          <RotateCcw size={14} /> Reset
        </button>
      </div>
      <div className="proof-status" role="status">
        {state.replayed
          ? "200 replay. The original posting is returned; no duplicate entries."
          : state.posted
            ? "201 created. Debits equal credits. One transaction committed."
            : "Ready. No transaction posted."}{" "}
        Transaction count: {state.count}.
      </div>
      <small>
        Deterministic local model. The actual service enforces invariants in
        PostgreSQL.
      </small>
    </div>,
    language,
  );
}
