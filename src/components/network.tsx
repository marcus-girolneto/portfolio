"use client";
import { useLanguage } from "./language-provider";
import { localizeTree } from "@/lib/i18n";
import { useRef } from "react";
const nodes = [
  [350, 210, 8],
  [215, 130, 5],
  [475, 108, 6],
  [530, 275, 5],
  [420, 365, 7],
  [245, 355, 5],
  [130, 250, 6],
  [327, 58, 4],
  [593, 175, 4],
  [571, 410, 4],
  [330, 455, 4],
  [80, 105, 3],
  [78, 390, 3],
  [645, 305, 3],
  [445, 15, 3],
  [180, 450, 3],
  [170, 35, 3],
  [660, 80, 3],
  [35, 295, 3],
];
const lines = [
  [0, 1],
  [0, 2],
  [0, 3],
  [0, 4],
  [0, 5],
  [0, 6],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 5],
  [5, 6],
  [6, 1],
  [1, 7],
  [7, 2],
  [2, 8],
  [8, 3],
  [3, 9],
  [9, 4],
  [4, 10],
  [10, 5],
  [6, 11],
  [6, 12],
  [8, 13],
  [7, 14],
  [5, 15],
  [1, 16],
  [8, 17],
  [6, 18],
  [10, 9],
  [11, 16],
  [12, 15],
  [13, 9],
];
export function Network() {
  const language = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  return localizeTree(
    <div
      ref={ref}
      className="hero-network"
      onPointerMove={(e) => {
        if (
          e.pointerType !== "mouse" ||
          window.matchMedia("(prefers-reduced-motion: reduce)").matches
        )
          return;
        const rect = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty(
          "--rx",
          `${((e.clientY - rect.top) / rect.height - 0.5) * -5}deg`,
        );
        e.currentTarget.style.setProperty(
          "--ry",
          `${((e.clientX - rect.left) / rect.width - 0.5) * 5}deg`,
        );
      }}
      onPointerLeave={() => {
        ref.current?.style.setProperty("--rx", "0deg");
        ref.current?.style.setProperty("--ry", "0deg");
      }}
      aria-hidden="true"
    >
      <div className="network-glow" />
      <svg className="network-svg" viewBox="0 0 700 500" fill="none">
        <defs>
          <radialGradient id="nodeHalo">
            <stop stopColor="#6896ff" stopOpacity=".2" />
            <stop offset="1" stopColor="#6896ff" stopOpacity="0" />
          </radialGradient>
          <linearGradient
            id="signal"
            x1="0"
            y1="0"
            x2="700"
            y2="500"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#4266aa" stopOpacity=".1" />
            <stop offset=".5" stopColor="#89abff" stopOpacity=".7" />
            <stop offset="1" stopColor="#416090" stopOpacity=".15" />
          </linearGradient>
        </defs>
        <g className="network-orbits">
          <ellipse
            cx="350"
            cy="250"
            rx="280"
            ry="190"
            stroke="#6889c7"
            strokeOpacity=".12"
            strokeDasharray="2 8"
          />
          <ellipse
            cx="350"
            cy="250"
            rx="210"
            ry="230"
            stroke="#6889c7"
            strokeOpacity=".1"
            transform="rotate(40 350 250)"
          />
          <ellipse
            cx="350"
            cy="250"
            rx="310"
            ry="100"
            stroke="#6889c7"
            strokeOpacity=".12"
            transform="rotate(-27 350 250)"
          />
        </g>
        {lines.map(([a, b], i) => (
          <line
            key={i}
            x1={nodes[a][0]}
            y1={nodes[a][1]}
            x2={nodes[b][0]}
            y2={nodes[b][1]}
            stroke="url(#signal)"
            strokeWidth={i < 6 ? 1.3 : 0.7}
          />
        ))}
        {[0, 2, 4, 5].map((i) => (
          <path
            key={i}
            className="data-signal"
            style={{ animationDelay: `${i * -0.8}s` }}
            d={`M350 210L${nodes[i + 1][0]} ${nodes[i + 1][1]}`}
            stroke="#a2beff"
            strokeWidth="2"
            pathLength="100"
            strokeDasharray="3 97"
          />
        ))}
        <circle cx="350" cy="210" r="100" fill="url(#nodeHalo)" />
        {nodes.map(([x, y, r], i) => (
          <g key={i}>
            <circle
              cx={x}
              cy={y}
              r={r + 7}
              stroke="#88adff"
              strokeOpacity={i === 0 ? ".4" : ".1"}
            />
            <circle
              cx={x}
              cy={y}
              r={r}
              fill={i === 0 ? "#dce8ff" : "#80a3ed"}
              fillOpacity={i < 7 ? ".9" : ".45"}
            />
            {i < 7 && (
              <circle
                className="node-pulse"
                style={{ animationDelay: `${i * -0.6}s` }}
                cx={x}
                cy={y}
                r={r + 13}
                stroke="#80a3ed"
                strokeOpacity=".2"
              />
            )}
          </g>
        ))}
        <g fontFamily="monospace" fontSize="8" letterSpacing="1" fill="#96a8cc">
          <text x="367" y="198">
            COORDINATION
          </text>
          <text x="483" y="94">
            NODE / 02
          </text>
          <text x="430" y="392">
            STATE / VERIFIED
          </text>
          <text x="83" y="280">
            SYNC
          </text>
        </g>
      </svg>
      <div className="network-caption">
        <span className="status-dot" />
        CONNECTED BY DESIGN<span>01 — DISTRIBUTED SYSTEMS</span>
      </div>
    </div>,
    language,
  );
}
