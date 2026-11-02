import { ImageResponse } from "next/og";
const size = { width: 1200, height: 630 };
export function GET() {
  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#080a0e",
        padding: "68px 76px",
        color: "#f1f3f8",
        fontFamily: "sans-serif",
        backgroundImage:
          "radial-gradient(ellipse at 90% 30%, #14274a 0%, #080a0e 65%)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 22,
        }}
      >
        <span>
          Marcus Vinicius Girolneto Sousa
          <span style={{ color: "#6896ff" }}>.</span>
        </span>
        <span style={{ color: "#9aa3b5", fontSize: 17 }}>
          SENIOR / LEAD SOFTWARE ENGINEER
        </span>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          fontSize: 76,
          letterSpacing: "-4px",
          lineHeight: 1.08,
        }}
      >
        <span>Engineering Complex Systems.</span>
        <span style={{ color: "#90a0bb" }}>Building What Matters.</span>
      </div>
      <div style={{ display: "flex", gap: 32, fontSize: 18, color: "#a8b4cb" }}>
        <span>DISTRIBUTED SYSTEMS</span>
        <span>AI INFRASTRUCTURE</span>
        <span>BACKEND ENGINEERING</span>
      </div>
    </div>,
    { ...size },
  );
}
