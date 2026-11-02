"use client";
import { useLanguage } from "./language-provider";
import { localizeTree } from "@/lib/i18n";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  Check,
  ChevronRight,
  Play,
  RotateCcw,
  ShieldCheck,
  Workflow,
  Network,
} from "lucide-react";
import {
  consensusOutcome,
  securityExamples,
  webhookOutcome,
  type WebhookMode,
} from "@/lib/simulations";
type Tab = "consensus" | "security" | "webhook";
export function EngineeringLab({
  initialTab = "consensus",
  compact = false,
}: {
  initialTab?: Tab;
  compact?: boolean;
}) {
  const language = useLanguage();
  const [tab, setTab] = useState<Tab>(initialTab);
  const [step, setStep] = useState(0);
  const [timeout, setTimeoutNode] = useState(false);
  const [example, setExample] = useState<"allowed" | "blocked">("allowed");
  const [mode, setMode] = useState<WebhookMode>("temporary");
  const reduced = useReducedMotion();
  const max = tab === "consensus" ? 3 : 4;
  const reset = () => setStep(0);
  const sample = securityExamples[example];
  const status =
    tab === "consensus"
      ? consensusOutcome(timeout, step)
      : tab === "webhook"
        ? webhookOutcome(mode, step)
        : step === 0
          ? "Select a predefined example, then step through the policy."
          : step === 1
            ? "Input received. No request leaves this browser."
            : step === 2
              ? sample.reason
              : !sample.allowed
                ? "Blocked. Provider is never called."
                : step === 3
                  ? "Allowed. Simulated provider stage; no external API is called."
                  : "Simulated response returned to the application.";
  return localizeTree(
    <div className={`lab-panel ${compact ? "compact-lab" : ""}`}>
      <div
        className="lab-tabs"
        role="tablist"
        aria-label="Engineering simulations"
      >
        {(
          [
            ["consensus", "Distributed consensus", Network],
            ["security", "AI security pipeline", ShieldCheck],
            ["webhook", "Webhook reliability", Workflow],
          ] as const
        ).map(([id, label, Icon]) => (
          <button
            role="tab"
            id={`tab-${id}`}
            aria-controls={`panel-${id}`}
            aria-selected={tab === id}
            tabIndex={tab === id ? 0 : -1}
            key={id}
            onClick={() => {
              setTab(id);
              reset();
            }}
            onKeyDown={(e) => {
              if (["ArrowRight", "ArrowLeft", "Home", "End"].includes(e.key)) {
                e.preventDefault();
                const ids: Tab[] = ["consensus", "security", "webhook"];
                const n =
                  e.key === "Home"
                    ? 0
                    : e.key === "End"
                      ? 2
                      : (ids.indexOf(tab) + (e.key === "ArrowRight" ? 1 : 2)) %
                        3;
                setTab(ids[n]);
                reset();
                document.getElementById(`tab-${ids[n]}`)?.focus();
              }
            }}
          >
            <Icon size={16} />
            <span>{label}</span>
          </button>
        ))}
      </div>
      <div
        role="tabpanel"
        id={`panel-${tab}`}
        aria-labelledby={`tab-${tab}`}
        className="lab-body"
        tabIndex={0}
      >
        <div className="lab-toolbar">
          <span className="mono">
            {tab === "consensus"
              ? "MODEL / MAJORITY AGREEMENT"
              : tab === "security"
                ? "MODEL / PREDEFINED POLICY"
                : "MODEL / AT-LEAST-ONCE DELIVERY"}
          </span>
          <span className="lab-local">
            <span className="status-dot" /> Runs locally
          </span>
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={tab}
            initial={{ opacity: reduced ? 1 : 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: reduced ? 1 : 0 }}
            transition={{ duration: 0.15 }}
            className="simulation-canvas"
          >
            {tab === "consensus" ? (
              <div className={`consensus-demo step-${step}`}>
                <svg viewBox="0 0 600 240" aria-hidden="true">
                  {[100, 233, 366, 500].map((x, i) => (
                    <path
                      key={x}
                      d={`M300 55L${x} 180`}
                      stroke={
                        step > 1 && !(timeout && i === 3)
                          ? "#82c9bc"
                          : "#324363"
                      }
                      strokeDasharray={timeout && i === 3 ? "5 5" : undefined}
                    />
                  ))}
                </svg>
                <div className="leader-node">
                  <Network size={24} />
                  <strong>Leader</strong>
                  <span>
                    {step === 0
                      ? "READY"
                      : step === 3
                        ? "COMMITTED"
                        : "PROPOSING"}
                  </span>
                </div>
                <div className="validator-row">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`validator ${step > 1 ? (timeout && i === 3 ? "timed-out" : "acknowledged") : ""}`}
                    >
                      <span>
                        {step > 1 ? (
                          timeout && i === 3 ? (
                            "×"
                          ) : (
                            <Check size={18} />
                          )
                        ) : (
                          `0${i + 1}`
                        )}
                      </span>
                      <small>Validator {i + 1}</small>
                      <em>
                        {step > 1
                          ? timeout && i === 3
                            ? "TIMEOUT"
                            : "ACKNOWLEDGED"
                          : "WAITING"}
                      </em>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="pipeline-demo">
                {(tab === "security"
                  ? [
                      "Input",
                      "Security evaluation",
                      "Decision",
                      "Provider",
                      "Response",
                    ]
                  : [
                      "Event",
                      "Delivery",
                      "Failure / result",
                      "Retry",
                      "Final state",
                    ]
                ).map((label, i) => (
                  <div className="pipeline-part" key={label}>
                    <div
                      className={`pipeline-node ${step >= [1, 2, 2, 3, 4][i] ? "is-done" : ""} ${tab === "security" && !sample.allowed && step >= 3 && i >= 2 ? "is-blocked" : ""}`}
                    >
                      <span>
                        {tab === "security" &&
                        !sample.allowed &&
                        step >= 3 &&
                        i >= 2
                          ? i === 2
                            ? "BLOCKED"
                            : "SKIPPED"
                          : tab === "webhook" && step === 4 && i === 4
                            ? mode === "persistent"
                              ? "DLQ"
                              : "SUCCESS"
                            : `0${i + 1}`}
                      </span>
                      <strong>{label}</strong>
                    </div>
                    {i < 4 && (
                      <ChevronRight className="pipeline-arrow" size={17} />
                    )}
                  </div>
                ))}
              </div>
            )}
            {tab === "security" && (
              <div className="sample-request">
                <span className="mono">SAMPLE REQUEST</span>
                <p>“{sample.text}”</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
        <div className="simulation-options">
          {tab === "consensus" ? (
            <label className="check-control">
              <input
                type="checkbox"
                checked={timeout}
                onChange={(e) => {
                  setTimeoutNode(e.target.checked);
                  reset();
                }}
              />{" "}
              Simulate one validator timeout
            </label>
          ) : tab === "security" ? (
            <label className="select-control">
              Example{" "}
              <select
                aria-label="Example"
                value={example}
                onChange={(e) => {
                  setExample(e.target.value as "allowed" | "blocked");
                  reset();
                }}
              >
                <option value="allowed">Allowed request</option>
                <option value="blocked">Blocked request</option>
              </select>
            </label>
          ) : (
            <label className="select-control">
              Receiver{" "}
              <select
                aria-label="Receiver"
                value={mode}
                onChange={(e) => {
                  setMode(e.target.value as WebhookMode);
                  reset();
                }}
              >
                <option value="temporary">Temporary failure</option>
                <option value="healthy">Healthy</option>
                <option value="persistent">
                  Persistent failure → dead letter
                </option>
              </select>
            </label>
          )}
        </div>
        <div className="lab-status" role="status">
          <span className="step-count">
            {String(step).padStart(2, "0")} / {String(max).padStart(2, "0")}
          </span>
          <p>{status}</p>
        </div>
        <div className="lab-actions">
          <button
            className="button button-primary button-small"
            disabled={step === max}
            onClick={() => setStep((s) => Math.min(s + 1, max))}
          >
            {step === 0 ? <Play size={13} /> : <ArrowRight size={14} />}{" "}
            {step === 0
              ? "Start simulation"
              : step === max
                ? "Complete"
                : "Next step"}
          </button>
          <button className="text-button" onClick={reset}>
            <RotateCcw size={13} /> Reset
          </button>
          <span>
            Educational simulation ·{" "}
            {tab === "consensus"
              ? "Not the Constellation protocol"
              : tab === "security"
                ? "No model inference or API calls"
                : "Compressed timing; simplified worker model"}
          </span>
        </div>
      </div>
    </div>,
    language,
  );
}
