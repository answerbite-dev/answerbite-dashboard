"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// ─── Sparkline Component ──────────────────────────────────────────────────────
function Sparkline({
  data,
  color = "#E8FF5A",
  width = 120,
  height = 36,
}: {
  data: number[];
  color?: string;
  width?: number;
  height?: number;
}) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data
    .map(
      (v, i) =>
        `${(i / (data.length - 1)) * width},${height - ((v - min) / range) * height}`
    )
    .join(" ");

  const gradId = `sg-${color.replace("#", "")}`;

  return (
    <svg width={width} height={height} style={{ display: "block" }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.3} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <polygon
        points={`0,${height} ${points} ${width},${height}`}
        fill={`url(#${gradId})`}
      />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── Mini Bar Chart ───────────────────────────────────────────────────────────
function MiniBarChart({
  data,
  labels,
  color = "#E8FF5A",
}: {
  data: number[];
  labels: string[];
  color?: string;
}) {
  const max = Math.max(...data);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: 6,
        height: 100,
      }}
    >
      {data.map((v, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
            flex: 1,
          }}
        >
          <span
            style={{
              fontSize: 10,
              color: "var(--text-dim)",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {v}
          </span>
          <div
            style={{
              width: "100%",
              maxWidth: 32,
              height: `${(v / max) * 70}px`,
              minHeight: 4,
              background: `linear-gradient(180deg, ${color}, ${color}88)`,
              borderRadius: "4px 4px 2px 2px",
              transition: "height 0.6s cubic-bezier(0.22,1,0.36,1)",
            }}
          />
          <span
            style={{
              fontSize: 9,
              color: "var(--text-dim)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {labels?.[i]}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Donut Chart ──────────────────────────────────────────────────────────────
function DonutChart({
  segments,
}: {
  segments: { value: number; color: string; label: string }[];
}) {
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  let cumulative = 0;
  const r = 44;
  const circumference = 2 * Math.PI * r;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
      <svg
        width={120}
        height={120}
        viewBox="0 0 120 120"
        style={{ transform: "rotate(-90deg)" }}
      >
        {segments.map((seg, i) => {
          const pct = seg.value / total;
          const offset = circumference * (1 - pct);
          const rotation = (cumulative / total) * 360;
          cumulative += seg.value;
          return (
            <circle
              key={i}
              cx={60}
              cy={60}
              r={r}
              fill="none"
              stroke={seg.color}
              strokeWidth={14}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              style={{
                transform: `rotate(${rotation}deg)`,
                transformOrigin: "center",
                transition: "stroke-dashoffset 0.8s ease",
              }}
              strokeLinecap="round"
            />
          );
        })}
      </svg>
      <div
        style={{ display: "flex", flexDirection: "column", gap: 8 }}
      >
        {segments.map((seg, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 12,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: seg.color,
              }}
            />
            <span style={{ color: "var(--text-dim)" }}>{seg.label}</span>
            <span
              style={{
                color: "var(--text-primary)",
                fontWeight: 600,
                marginLeft: "auto",
              }}
            >
              {Math.round((seg.value / total) * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({
  icon,
  label,
  value,
  change,
  changeDir,
  sparkData,
  sparkColor,
  delay = 0,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  change?: string;
  changeDir?: "up" | "down";
  sparkData?: number[];
  sparkColor?: string;
  delay?: number;
}) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: 14,
        padding: "20px 22px",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0)" : "translateY(12px)",
        transition: "all 0.5s cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span style={{ color: "var(--accent)" }}>{icon}</span>
          <span
            style={{
              fontSize: 12,
              color: "var(--text-dim)",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              fontWeight: 500,
            }}
          >
            {label}
          </span>
        </div>
        {change && (
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 3,
              color: changeDir === "up" ? "#4ADE80" : "#F87171",
              background:
                changeDir === "up" ? "#4ADE8015" : "#F8717115",
              padding: "3px 8px",
              borderRadius: 20,
            }}
          >
            {changeDir === "up" ? "↑" : "↓"} {change}
          </span>
        )}
      </div>
      <div
        style={{
          fontSize: 30,
          fontWeight: 700,
          color: "var(--text-primary)",
          fontVariantNumeric: "tabular-nums",
          letterSpacing: "-0.02em",
        }}
      >
        {value}
      </div>
      {sparkData && (
        <Sparkline
          data={sparkData}
          color={sparkColor || "var(--accent)"}
        />
      )}
    </div>
  );
}

// ─── Sidebar Nav Icons ────────────────────────────────────────────────────────
const SvgIcons = {
  home: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  bar: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    >
      <rect x="3" y="12" width="4" height="9" rx="1" />
      <rect x="10" y="7" width="4" height="14" rx="1" />
      <rect x="17" y="3" width="4" height="18" rx="1" />
    </svg>
  ),
  users: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  question: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  settings: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  logout: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  bell: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    >
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  search: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
};

// ─── Sample Data ──────────────────────────────────────────────────────────────
const recentQuestions = [
  {
    q: "How do I reset my API key?",
    topic: "API",
    status: "answered",
    score: 94,
    time: "2m ago",
  },
  {
    q: "What's the rate limit for batch processing?",
    topic: "Limits",
    status: "answered",
    score: 88,
    time: "8m ago",
  },
  {
    q: "Can I export analytics as CSV?",
    topic: "Export",
    status: "pending",
    score: 0,
    time: "12m ago",
  },
  {
    q: "How to set up SSO with Okta?",
    topic: "Auth",
    status: "answered",
    score: 91,
    time: "19m ago",
  },
  {
    q: "Why are webhook deliveries delayed?",
    topic: "Webhooks",
    status: "escalated",
    score: 72,
    time: "24m ago",
  },
  {
    q: "Difference between Pro and Enterprise?",
    topic: "Billing",
    status: "answered",
    score: 96,
    time: "31m ago",
  },
];

const activityFeed = [
  {
    user: "Sarah K.",
    action: "answered",
    topic: "API key reset",
    time: "2m ago",
    color: "#E8FF5A",
  },
  {
    user: "Marcus T.",
    action: "escalated",
    topic: "Webhook delays",
    time: "15m ago",
    color: "#F87171",
  },
  {
    user: "Priya M.",
    action: "resolved",
    topic: "SSO configuration",
    time: "28m ago",
    color: "#4ADE80",
  },
  {
    user: "Alex D.",
    action: "tagged",
    topic: "Batch processing limits",
    time: "41m ago",
    color: "#60A5FA",
  },
];

const topTopics = [
  { name: "API", count: 342, pct: 28 },
  { name: "Billing", count: 218, pct: 18 },
  { name: "Auth / SSO", count: 196, pct: 16 },
  { name: "Webhooks", count: 151, pct: 12 },
  { name: "Export", count: 128, pct: 10 },
];

// ─── Dashboard Page ───────────────────────────────────────────────────────────
export default function Dashboard() {
  const router = useRouter();
  const [activeNav, setActiveNav] = useState("home");
  const [searchQuery, setSearchQuery] = useState("");

  const navItems = [
    { id: "home", icon: SvgIcons.home, label: "Overview" },
    { id: "analytics", icon: SvgIcons.bar, label: "Analytics" },
    { id: "questions", icon: SvgIcons.question, label: "Questions" },
    { id: "team", icon: SvgIcons.users, label: "Team" },
    { id: "settings", icon: SvgIcons.settings, label: "Settings" },
  ];

  const statusColor: Record<string, string> = {
    answered: "#4ADE80",
    pending: "#FBBF24",
    escalated: "#F87171",
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-primary)" }}>
      {/* ─── Sidebar ─── */}
      <aside
        style={{
          width: 240,
          background: "var(--bg-secondary)",
          borderRight: "1px solid var(--border)",
          display: "flex",
          flexDirection: "column",
          padding: "24px 0",
          flexShrink: 0,
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "0 20px 24px",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <svg width="30" height="30" viewBox="0 0 44 44" fill="none">
            <rect width="44" height="44" rx="11" fill="#E8FF5A" />
            <path d="M12 15h20M12 22h14M12 29h17" stroke="#0a0a0b" strokeWidth="2.8" strokeLinecap="round" />
            <circle cx="33" cy="30" r="6" fill="#0a0a0b" />
            <path d="M31.5 30l1.5 1.5 3-3" stroke="#E8FF5A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{ fontSize: 17, fontWeight: 700, letterSpacing: "-0.02em" }}>
            AnswerBite
          </span>
        </div>

        {/* Nav */}
        <nav style={{ display: "flex", flexDirection: "column", gap: 2, padding: "16px 10px", flex: 1 }}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: activeNav === item.id ? 600 : 400,
                color: activeNav === item.id ? "var(--text-primary)" : "var(--text-secondary)",
                background: activeNav === item.id ? "var(--bg-card)" : "transparent",
                border: activeNav === item.id ? "1px solid var(--border)" : "1px solid transparent",
                cursor: "pointer",
                transition: "all 0.15s ease",
                fontFamily: "inherit",
                width: "100%",
                textAlign: "left",
              }}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        {/* Bottom */}
        <div style={{ padding: "0 10px", display: "flex", flexDirection: "column", gap: 2 }}>
          <button
            onClick={() => router.push("/login")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 12px",
              borderRadius: 8,
              fontSize: 13,
              color: "var(--text-dim)",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              fontFamily: "inherit",
              width: "100%",
              textAlign: "left",
              transition: "color 0.15s",
            }}
          >
            {SvgIcons.logout}
            Log out
          </button>
        </div>
      </aside>

      {/* ─── Main Content ─── */}
      <main style={{ flex: 1, overflow: "auto" }}>
        {/* Top Bar */}
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 32px",
            borderBottom: "1px solid var(--border)",
            background: "var(--bg-primary)",
            position: "sticky",
            top: 0,
            zIndex: 10,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: "var(--bg-secondary)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              padding: "8px 14px",
              width: 320,
            }}
          >
            <span style={{ color: "var(--text-dim)" }}>{SvgIcons.search}</span>
            <input
              placeholder="Search questions, topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: "none",
                border: "none",
                outline: "none",
                color: "var(--text-primary)",
                fontSize: 13,
                fontFamily: "inherit",
                width: "100%",
              }}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button
              style={{
                position: "relative",
                color: "var(--text-secondary)",
                background: "var(--bg-secondary)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                padding: 8,
                display: "flex",
                cursor: "pointer",
              }}
            >
              {SvgIcons.bell}
              <span
                style={{
                  position: "absolute",
                  top: 5,
                  right: 5,
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: "var(--danger)",
                }}
              />
            </button>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #E8FF5A, #4ADE80)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                fontWeight: 700,
                color: "#0a0a0b",
                cursor: "pointer",
              }}
            >
              JD
            </div>
          </div>
        </header>

        {/* Content */}
        <div style={{ padding: "28px 32px", display: "flex", flexDirection: "column", gap: 28 }}>
          {/* Page Title */}
          <div style={{ animation: "fadeUp 0.5s ease both" }}>
            <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em" }}>
              Dashboard
            </h1>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", marginTop: 4 }}>
              Your Q&A analytics at a glance
            </p>
          </div>

          {/* Stat Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            <StatCard
              icon={SvgIcons.question}
              label="Total Questions"
              value="12,847"
              change="12.3%"
              changeDir="up"
              sparkData={[40, 52, 48, 61, 55, 72, 68, 80, 76, 89]}
              sparkColor="#E8FF5A"
              delay={0}
            />
            <StatCard
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              }
              label="Answered"
              value="11,203"
              change="8.7%"
              changeDir="up"
              sparkData={[35, 42, 50, 45, 58, 62, 70, 65, 74, 82]}
              sparkColor="#4ADE80"
              delay={80}
            />
            <StatCard
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              }
              label="Avg Response"
              value="4.2m"
              change="2.1%"
              changeDir="down"
              sparkData={[8, 7.2, 6.8, 5.5, 5.1, 4.9, 4.5, 4.3, 4.2, 4.2]}
              sparkColor="#60A5FA"
              delay={160}
            />
            <StatCard
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                  <polyline points="17 6 23 6 23 12" />
                </svg>
              }
              label="Satisfaction"
              value="94.2%"
              change="1.8%"
              changeDir="up"
              sparkData={[88, 89, 90, 91, 90.5, 92, 93, 92.5, 93.8, 94.2]}
              sparkColor="#FBBF24"
              delay={240}
            />
          </div>

          {/* Middle Row: Chart + Donut */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {/* Weekly Volume */}
            <div
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: 14,
                padding: "22px 24px",
                animation: "fadeUp 0.5s ease both",
                animationDelay: "0.2s",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600 }}>Weekly Volume</h3>
                <span style={{ fontSize: 11, color: "var(--text-dim)", fontFamily: "'JetBrains Mono', monospace" }}>
                  Last 7 days
                </span>
              </div>
              <MiniBarChart
                data={[186, 215, 198, 242, 228, 263, 251]}
                labels={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
                color="#E8FF5A"
              />
            </div>

            {/* Topic Distribution */}
            <div
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: 14,
                padding: "22px 24px",
                animation: "fadeUp 0.5s ease both",
                animationDelay: "0.3s",
              }}
            >
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 20 }}>
                Topic Distribution
              </h3>
              <DonutChart
                segments={[
                  { value: 28, color: "#E8FF5A", label: "API" },
                  { value: 18, color: "#4ADE80", label: "Billing" },
                  { value: 16, color: "#60A5FA", label: "Auth / SSO" },
                  { value: 12, color: "#F87171", label: "Webhooks" },
                  { value: 26, color: "#8B5CF6", label: "Other" },
                ]}
              />
            </div>
          </div>

          {/* Bottom Row: Questions Table + Activity + Top Topics */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
            {/* Recent Questions */}
            <div
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: 14,
                padding: "22px 24px",
                animation: "fadeUp 0.5s ease both",
                animationDelay: "0.35s",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600 }}>Recent Questions</h3>
                <button
                  style={{
                    fontSize: 12,
                    color: "var(--accent)",
                    fontWeight: 500,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  View all →
                </button>
              </div>

              {/* Table Header */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 80px 90px 60px 70px",
                  gap: 12,
                  padding: "8px 0",
                  borderBottom: "1px solid var(--border)",
                  fontSize: 11,
                  color: "var(--text-dim)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  fontWeight: 500,
                }}
              >
                <span>Question</span>
                <span>Topic</span>
                <span>Status</span>
                <span>Score</span>
                <span>Time</span>
              </div>

              {/* Rows */}
              {recentQuestions.map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "2fr 80px 90px 60px 70px",
                    gap: 12,
                    padding: "12px 0",
                    borderBottom: i < recentQuestions.length - 1 ? "1px solid var(--border)" : "none",
                    fontSize: 13,
                    alignItems: "center",
                    cursor: "pointer",
                    transition: "background 0.15s",
                  }}
                >
                  <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>
                    {item.q}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      padding: "3px 8px",
                      borderRadius: 4,
                      background: "var(--bg-secondary)",
                      border: "1px solid var(--border)",
                      color: "var(--text-secondary)",
                      textAlign: "center",
                    }}
                  >
                    {item.topic}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      color: statusColor[item.status],
                    }}
                  >
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: statusColor[item.status],
                      }}
                    />
                    {item.status}
                  </span>
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 12,
                      color: item.score >= 90 ? "#4ADE80" : item.score >= 70 ? "#FBBF24" : "var(--text-dim)",
                    }}
                  >
                    {item.score || "—"}
                  </span>
                  <span style={{ fontSize: 11, color: "var(--text-dim)" }}>
                    {item.time}
                  </span>
                </div>
              ))}
            </div>

            {/* Right Column: Activity + Top Topics */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Activity Feed */}
              <div
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: 14,
                  padding: "22px 24px",
                  animation: "fadeUp 0.5s ease both",
                  animationDelay: "0.4s",
                }}
              >
                <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>
                  Activity
                </h3>
                {activityFeed.map((item, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      gap: 12,
                      padding: "10px 0",
                      borderBottom: i < activityFeed.length - 1 ? "1px solid var(--border)" : "none",
                    }}
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        background: `linear-gradient(135deg, ${item.color}, ${item.color}66)`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#0a0a0b",
                        flexShrink: 0,
                      }}
                    >
                      {item.user.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 12, lineHeight: 1.5 }}>
                        <span style={{ fontWeight: 600 }}>{item.user}</span>{" "}
                        <span style={{ color: "var(--text-dim)" }}>{item.action}</span>{" "}
                        <span style={{ color: "var(--text-secondary)" }}>{item.topic}</span>
                      </p>
                      <span style={{ fontSize: 10, color: "var(--text-dim)" }}>
                        {item.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Top Topics */}
              <div
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: 14,
                  padding: "22px 24px",
                  animation: "fadeUp 0.5s ease both",
                  animationDelay: "0.45s",
                }}
              >
                <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>
                  Top Topics
                </h3>
                {topTopics.map((topic, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "8px 0",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        color: "var(--text-dim)",
                        fontFamily: "'JetBrains Mono', monospace",
                        width: 16,
                      }}
                    >
                      {i + 1}
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 500, flex: 1 }}>
                      {topic.name}
                    </span>
                    <div
                      style={{
                        width: 80,
                        height: 6,
                        background: "var(--bg-secondary)",
                        borderRadius: 3,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${topic.pct}%`,
                          background: "var(--accent)",
                          borderRadius: 3,
                          transition: "width 0.8s cubic-bezier(0.22,1,0.36,1)",
                        }}
                      />
                    </div>
                    <span
                      style={{
                        fontSize: 11,
                        color: "var(--text-dim)",
                        fontFamily: "'JetBrains Mono', monospace",
                        width: 32,
                        textAlign: "right",
                      }}
                    >
                      {topic.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Inline spinner keyframe */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
