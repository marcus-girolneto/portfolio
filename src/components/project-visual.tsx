import {
  Activity,
  ArrowRight,
  Bot,
  Check,
  Database,
  FileCheck2,
  LockKeyhole,
  ShieldCheck,
  Workflow,
} from "lucide-react";
import { localizeTree, type Language } from "@/lib/i18n";
import type { Project } from "@/content/projects";
export function ProjectVisual({
  type,
  language = { locale: "en", messages: {} },
}: {
  type: Project["type"];
  language?: Language;
}) {
  return localizeTree(
    <div className={`project-visual visual-${type}`} aria-hidden="true">
      <div className="visual-grid" />
      {type === "gate" && (
        <div className="gateway-preview">
          <div className="preview-top">
            <span className="preview-logo">
              <ShieldCheck size={15} /> GATE
            </span>
            <span className="tiny-badge">
              <span className="status-dot" /> Security boundary
            </span>
          </div>
          <div className="gate-path">
            <span className="flow-end">
              <Bot size={22} />
              <small>APPLICATION</small>
            </span>
            <i />
            <span className="gate-shield">
              <ShieldCheck size={37} />
            </span>
            <i />
            <span className="flow-end">
              <Workflow size={22} />
              <small>PROVIDER</small>
            </span>
          </div>
          <div className="scan-row">
            <span>
              <Check size={12} /> Prompt evaluation
            </span>
            <span>
              <Check size={12} /> Data protection
            </span>
          </div>
          <div className="preview-bottom">
            <span>Evaluate. Protect. Observe.</span>
            <Activity size={15} />
          </div>
        </div>
      )}
      {type === "protocol" && (
        <div className="protocol-preview">
          <svg viewBox="0 0 440 230">
            <g stroke="#7296d2" strokeWidth="1" opacity=".45">
              <path d="M220 30 370 110 310 205 130 205 70 110Z M220 30 310 205 70 110 370 110 130 205Z" />
              <path d="M220 30V125L370 110M220 125 310 205M220 125 130 205M220 125 70 110" />
            </g>
            {[
              [220, 30],
              [370, 110],
              [310, 205],
              [130, 205],
              [70, 110],
            ].map(([x, y], i) => (
              <g key={i}>
                <circle cx={x} cy={y} r="15" fill="#101b30" stroke="#728fca" />
                <circle cx={x} cy={y} r="4" fill="#a8c2ff" />
              </g>
            ))}
            <circle cx="220" cy="125" r="28" fill="#152442" stroke="#8baeff" />
            <text
              x="220"
              y="130"
              textAnchor="middle"
              fill="#bcd1ff"
              fontSize="15"
            >
              Σ
            </text>
          </svg>
          <span className="protocol-label">
            AGREEMENT ACROSS INDEPENDENT NODES
          </span>
        </div>
      )}
      {type === "akibo" && (
        <div className="chat-preview">
          <div className="chat-header">
            <span className="akibo-icon">
              <Bot size={18} />
            </span>
            <div>
              <strong>akibo</strong>
              <small>Your finances, in conversation.</small>
            </div>
            <span className="status-dot" />
          </div>
          <div className="chat-bubble outgoing">
            How does a financial action work?
          </div>
          <div className="chat-bubble incoming">
            Understand the request.
            <br />
            Validate the operation.
            <br />
            Confirm before committing.
            <span>
              <LockKeyhole size={11} /> Structured tools · Isolated data
            </span>
          </div>
          <div className="chat-input">
            A clearer view of your money <ArrowRight size={14} />
          </div>
        </div>
      )}
      {type === "hookrelay" && (
        <div className="mini-delivery">
          <div className="preview-top">
            <span className="preview-logo">
              <Workflow size={15} /> hookrelay
            </span>
            <span className="tiny-badge">DELIVERY LIFECYCLE</span>
          </div>
          <div className="delivery-track">
            <span>Event</span>
            <i />
            <span className="warn">Retry</span>
            <i />
            <span className="success">
              <Check size={13} /> Delivered
            </span>
          </div>
          <div className="attempt-line">
            <span>01</span>
            <span>Receiver unavailable</span>
            <b>503</b>
          </div>
          <div className="attempt-line">
            <span>02</span>
            <span>Backoff + jitter</span>
            <b>↻</b>
          </div>
          <div className="attempt-line">
            <span>03</span>
            <span>Signed delivery</span>
            <b className="green-text">200</b>
          </div>
        </div>
      )}
      {type === "witness" && (
        <div className="tree-preview">
          <svg viewBox="0 0 380 220">
            <g stroke="#6386c5" opacity=".65">
              <path d="M190 35 100 105 55 180M100 105 145 180M190 35 280 105 235 180M280 105 325 180" />
            </g>
            {[
              [190, 35],
              [100, 105],
              [280, 105],
              [55, 180],
              [145, 180],
              [235, 180],
              [325, 180],
            ].map(([x, y], i) => (
              <g key={i}>
                <rect
                  x={x - 24}
                  y={y - 13}
                  width="48"
                  height="26"
                  rx="5"
                  fill={i < 2 ? "#1d3154" : "#111c30"}
                  stroke={i < 2 ? "#92b5ff" : "#425b83"}
                />
                <text
                  x={x}
                  y={y + 4}
                  fill="#b3c9ee"
                  fontSize="9"
                  textAnchor="middle"
                  fontFamily="monospace"
                >
                  {["ROOT", "H₀₁", "H₂₃", "L₀", "L₁", "L₂", "L₃"][i]}
                </text>
              </g>
            ))}
          </svg>
          <div className="tree-caption">
            <FileCheck2 size={13} /> Every entry leaves a verifiable trace.
          </div>
        </div>
      )}
      {type === "arconta" && (
        <div className="ledger-preview">
          <div className="preview-top">
            <span className="preview-logo">
              <FileCheck2 size={15} /> arconta
            </span>
            <span className="tiny-badge">FISCAL VALIDATION</span>
          </div>
          <div className="fiscal-document">
            <FileCheck2 size={34} />
            <strong>XML → Evidence → Action</strong>
            <p>
              Schema validation
              <br />
              Deterministic rules
              <br />
              Traceable findings
            </p>
          </div>
          <div className="ledger-balanced">
            <Check size={13} /> RULES WITH OFFICIAL CITATIONS
          </div>
        </div>
      )}
      {type === "ledger" && (
        <div className="ledger-preview">
          <div className="preview-top">
            <span className="preview-logo">
              <Database size={15} /> ledger
            </span>
            <span className="tiny-badge">DOUBLE-ENTRY</span>
          </div>
          <div className="ledger-head">
            <span>ACCOUNT</span>
            <span>DEBIT</span>
            <span>CREDIT</span>
          </div>
          <div className="ledger-row">
            <span>Operating cash</span>
            <span>150.00</span>
            <span>—</span>
          </div>
          <div className="ledger-row">
            <span>Customer wallet</span>
            <span>—</span>
            <span>150.00</span>
          </div>
          <div className="ledger-balanced">
            <Check size={13} /> BALANCED<span>Δ 0.00</span>
          </div>
        </div>
      )}
      <span className="concept-label">CONCEPTUAL VIEW</span>
    </div>,
    language,
  );
}
