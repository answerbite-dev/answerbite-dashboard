"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";


const RESTAURANT_ID = "00000000-0000-0000-0000-000000000001";
const API_URL = "https://answerbite-voice-production.up.railway.app";

/* ── Sparkline ─────────────────────────────────────────────────────────────── */
function Sparkline({ data, color = "#E8FF5A", width = 120, height = 36 }: { data: number[]; color?: string; width?: number; height?: number }) {
  if (!data || data.length < 2) return <div style={{ height, width }} />;
  const max = Math.max(...data), min = Math.min(...data), range = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * width},${height - ((v - min) / range) * height}`).join(" ");
  const id = `sp-${color.replace("#", "")}`;
  return (
    <svg width={width} height={height} style={{ display: "block" }}>
      <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity={0.3} /><stop offset="100%" stopColor={color} stopOpacity={0} /></linearGradient></defs>
      <polygon points={`0,${height} ${pts} ${width},${height}`} fill={`url(#${id})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── Bar Chart ─────────────────────────────────────────────────────────────── */
function BarChart({ data, labels, color = "#E8FF5A" }: { data: number[]; labels: string[]; color?: string }) {
  const max = Math.max(...data, 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 110 }}>
      {data.map((v, i) => (
        <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, flex: 1 }}>
          <span style={{ fontSize: 10, color: "var(--text-dim)", fontVariantNumeric: "tabular-nums" }}>{v}</span>
          <div style={{ width: "100%", maxWidth: 32, height: `${(v / max) * 80}px`, minHeight: 4, background: `linear-gradient(180deg, ${color}, ${color}88)`, borderRadius: "4px 4px 2px 2px" }} />
          <span style={{ fontSize: 9, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{labels?.[i]}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Donut ──────────────────────────────────────────────────────────────────── */
function Donut({ segments }: { segments: { value: number; color: string; label: string }[] }) {
  const total = segments.reduce((s, x) => s + x.value, 0);
  if (total === 0) return <p style={{ fontSize: 13, color: "var(--text-dim)", textAlign: "center", padding: 30 }}>No data yet</p>;
  let cum = 0; const r = 44, C = 2 * Math.PI * r;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
      <svg width={120} height={120} viewBox="0 0 120 120" style={{ transform: "rotate(-90deg)" }}>
        {segments.filter(s => s.value > 0).map((seg, i) => {
          const pct = seg.value / total, off = C * (1 - pct), rot = (cum / total) * 360;
          cum += seg.value;
          return <circle key={i} cx={60} cy={60} r={r} fill="none" stroke={seg.color} strokeWidth={14} strokeDasharray={C} strokeDashoffset={off} style={{ transform: `rotate(${rot}deg)`, transformOrigin: "center" }} strokeLinecap="round" />;
        })}
      </svg>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {segments.map((seg, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: seg.color }} />
            <span style={{ color: "var(--text-dim)" }}>{seg.label}</span>
            <span style={{ color: "var(--text-primary)", fontWeight: 600, marginLeft: "auto" }}>{total > 0 ? Math.round((seg.value / total) * 100) : 0}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Stat Card ─────────────────────────────────────────────────────────────── */
function Stat({ icon, label, value, change, dir, spark, sparkColor }: { icon: React.ReactNode; label: string; value: string; change?: string; dir?: "up" | "down"; spark?: number[]; sparkColor?: string }) {
  return (
    <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: "20px 22px", display: "flex", flexDirection: "column", gap: 14, animation: "fadeUp 0.5s ease both" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: "var(--accent)" }}>{icon}</span>
          <span style={{ fontSize: 12, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 500 }}>{label}</span>
        </div>
        {change && <span style={{ fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", gap: 3, color: dir === "up" ? "#4ADE80" : "#F87171", background: dir === "up" ? "#4ADE8015" : "#F8717115", padding: "3px 8px", borderRadius: 20 }}>{dir === "up" ? "↑" : "↓"} {change}</span>}
      </div>
      <div style={{ fontSize: 30, fontWeight: 700, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.02em" }}>{value}</div>
      {spark && spark.length > 1 ? <Sparkline data={spark} color={sparkColor || "var(--accent)"} /> : <div style={{ height: 36, display: "flex", alignItems: "flex-end" }}><div style={{ width: "100%", height: 1, background: "var(--border)" }} /></div>}
    </div>
  );
}

/* ── Empty State ───────────────────────────────────────────────────────────── */
function EmptyState({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px", textAlign: "center" }}>
      <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6 }}>{title}</p>
      <p style={{ fontSize: 12, color: "var(--text-dim)", maxWidth: 260, lineHeight: 1.5 }}>{subtitle}</p>
    </div>
  );
}

/* ── Icons ──────────────────────────────────────────────────────────────────── */
const I = {
  phone: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>,
  order: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>,
  calendar: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>,
  dollar: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>,
  home: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
  bar: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="12" width="4" height="9" rx="1" /><rect x="10" y="7" width="4" height="14" rx="1" /><rect x="17" y="3" width="4" height="18" rx="1" /></svg>,
  utensils: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" /><path d="M7 2v20" /><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7" /></svg>,
  settings: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>,
  logout: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>,
  bell: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>,
  search: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>,
};

/* ── Types ─────────────────────────────────────────────────────────────────── */
interface Call {
  id: string;
  caller_number: string;
  caller_name: string | null;
  call_type: string | null;
  status: string;
  summary: string | null;
  duration_seconds: number | null;
  started_at: string;
}

interface Order {
  id: string;
  total: number | null;
  created_at: string;
}

interface Restaurant {
  name: string;
  address: string;
}

/* ── Dashboard ─────────────────────────────────────────────────────────────── */
export default function Dashboard() {
  const router = useRouter();
  const [nav, setNav] = useState("home");
  const [search, setSearch] = useState("");
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [calls, setCalls] = useState<Call[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalReservations, setTotalReservations] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch data
  const fetchData = useCallback(async () => {
    try {
      const [restaurantRes, callsRes, ordersRes, reservationsRes] = await Promise.all([
        fetch(`${API_URL}/api/restaurant/${RESTAURANT_ID}`),
        fetch(`${API_URL}/api/calls/${RESTAURANT_ID}?limit=50`),
        fetch(`${API_URL}/api/orders/${RESTAURANT_ID}?limit=50`),
        fetch(`${API_URL}/api/reservations/${RESTAURANT_ID}?limit=50`),
      ]);

      const restaurantData = await restaurantRes.json();
      const callsData = await callsRes.json();
      const ordersData = await ordersRes.json();
      const reservationsData = await reservationsRes.json();

      setRestaurant({ name: restaurantData.name, address: restaurantData.address });
      setCalls(Array.isArray(callsData) ? callsData : []);
      setOrders(Array.isArray(ordersData) ? ordersData : []);
      setTotalReservations(Array.isArray(reservationsData) ? reservationsData.length : 0);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();

    // Poll for updates every 10 seconds
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [fetchData]);

  // Computed stats
  const totalCalls = calls.length;
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);

  // Call type counts
  const callTypeCounts: Record<string, number> = {};
  calls.forEach((c) => { callTypeCounts[c.call_type || "other"] = (callTypeCounts[c.call_type || "other"] || 0) + 1; });

  // Daily volume (last 7 days)
  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dailyVolume = new Array(7).fill(0);
  calls.forEach((c) => {
    const day = new Date(c.started_at).getDay();
    dailyVolume[day]++;
  });
  const orderedDays = [...dailyVolume.slice(1), dailyVolume[0]]; // Mon-Sun
  const orderedLabels = [...dayLabels.slice(1), dayLabels[0]];

  // Status styles
  const statusStyle: Record<string, { color: string; bg: string }> = {
    completed: { color: "#4ADE80", bg: "#4ADE8015" },
    booked: { color: "#E8FF5A", bg: "#E8FF5A15" },
    answered: { color: "#60A5FA", bg: "#60A5FA15" },
    transferred: { color: "#8B5CF6", bg: "#8B5CF615" },
    missed: { color: "#F87171", bg: "#F8717115" },
    in_progress: { color: "#FBBF24", bg: "#FBBF2415" },
  };

  const navItems = [
    { id: "home", icon: I.home, label: "Overview" },
    { id: "calls", icon: I.phone, label: "Call Log" },
    { id: "orders", icon: I.order, label: "Orders" },
    { id: "reservations", icon: I.calendar, label: "Reservations" },
    { id: "analytics", icon: I.bar, label: "Analytics" },
    { id: "menu", icon: I.utensils, label: "Menu" },
    { id: "settings", icon: I.settings, label: "Settings" },
  ];

  const formatDuration = (secs: number | null) => {
    if (!secs) return "—";
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "var(--text-dim)", fontSize: 14 }}>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-primary)" }}>
      {/* Sidebar */}
      <aside style={{ width: 240, background: "var(--bg-secondary)", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", padding: "24px 0", flexShrink: 0 }}>
        <div style={{ padding: "0 20px 20px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <svg width="30" height="30" viewBox="0 0 44 44" fill="none">
              <rect width="44" height="44" rx="11" fill="#E8FF5A" />
              <path d="M22 10a8 8 0 0 0-8 8v3a1 1 0 0 0 1 1h2l1.5 3h7l1.5-3h2a1 1 0 0 0 1-1v-3a8 8 0 0 0-8-8z" fill="#0a0a0b" />
              <circle cx="19" cy="17" r="1.5" fill="#E8FF5A" />
              <circle cx="25" cy="17" r="1.5" fill="#E8FF5A" />
            </svg>
            <span style={{ fontSize: 17, fontWeight: 700, letterSpacing: "-0.02em" }}>AnswerBite</span>
          </div>
          <div style={{ padding: "10px 12px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8 }}>
            <p style={{ fontSize: 13, fontWeight: 600 }}>{restaurant?.name || "Loading..."}</p>
            <p style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 2 }}>{restaurant?.address || ""}</p>
          </div>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: 2, padding: "16px 10px", flex: 1 }}>
          {navItems.map((item) => (
            <button key={item.id} onClick={() => setNav(item.id)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8, fontSize: 13, fontWeight: nav === item.id ? 600 : 400, color: nav === item.id ? "var(--text-primary)" : "var(--text-secondary)", background: nav === item.id ? "var(--bg-card)" : "transparent", border: nav === item.id ? "1px solid var(--border)" : "1px solid transparent", cursor: "pointer", fontFamily: "inherit", width: "100%", textAlign: "left" }}>
              {item.icon}{item.label}
            </button>
          ))}
        </nav>

        <div style={{ margin: "0 10px 12px", padding: "14px", borderRadius: 10, background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: totalCalls > 0 ? "#4ADE80" : "#FBBF24", boxShadow: `0 0 8px ${totalCalls > 0 ? "#4ADE8060" : "#FBBF2460"}` }} />
            <span style={{ fontSize: 12, fontWeight: 600 }}>{totalCalls > 0 ? "AI Agent Active" : "Waiting for calls"}</span>
          </div>
          <p style={{ fontSize: 11, color: "var(--text-dim)", lineHeight: 1.5 }}>
            {totalCalls > 0 ? `${totalCalls} calls handled` : "Agent ready. No calls yet."}
          </p>
        </div>

        <div style={{ padding: "0 10px" }}>
          <button onClick={() => router.push("/login")} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8, fontSize: 13, color: "var(--text-dim)", background: "transparent", border: "none", cursor: "pointer", fontFamily: "inherit", width: "100%", textAlign: "left" }}>
            {I.logout} Log out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, overflow: "auto" }}>
        <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 32px", borderBottom: "1px solid var(--border)", background: "var(--bg-primary)", position: "sticky", top: 0, zIndex: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 14px", width: 340 }}>
            <span style={{ color: "var(--text-dim)" }}>{I.search}</span>
            <input placeholder="Search calls, orders, customers..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ background: "none", border: "none", outline: "none", color: "var(--text-primary)", fontSize: 13, fontFamily: "inherit", width: "100%" }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button style={{ position: "relative", color: "var(--text-secondary)", background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: 8, padding: 8, display: "flex", cursor: "pointer" }}>
              {I.bell}
              {calls.some(c => c.status === "missed") && <span style={{ position: "absolute", top: 5, right: 5, width: 7, height: 7, borderRadius: "50%", background: "#F87171" }} />}
            </button>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg, #E8FF5A, #4ADE80)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#0a0a0b" }}>TP</div>
          </div>
        </header>

        <div style={{ padding: "28px 32px", display: "flex", flexDirection: "column", gap: 24 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em" }}>{restaurant?.name || "Dashboard"}</h1>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", marginTop: 4 }}>AI phone agent — live dashboard</p>
          </div>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            <Stat icon={I.phone} label="Total Calls" value={totalCalls.toLocaleString()} />
            <Stat icon={I.order} label="Orders Taken" value={totalOrders.toLocaleString()} />
            <Stat icon={I.calendar} label="Reservations" value={totalReservations.toLocaleString()} />
            <Stat icon={I.dollar} label="Revenue Captured" value={`$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} />
          </div>

          {/* Charts */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: "22px 24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600 }}>Daily Call Volume</h3>
                <span style={{ fontSize: 11, color: "var(--text-dim)", fontFamily: "'JetBrains Mono', monospace" }}>This week</span>
              </div>
              {totalCalls > 0 ? (
                <BarChart data={orderedDays} labels={orderedLabels} />
              ) : (
                <EmptyState title="No calls yet" subtitle="Call data will appear here once your AI agent starts handling calls." />
              )}
            </div>
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: "22px 24px" }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 20 }}>Call Outcomes</h3>
              <Donut segments={[
                { value: callTypeCounts["order"] || 0, color: "#4ADE80", label: "Orders" },
                { value: callTypeCounts["reservation"] || 0, color: "#E8FF5A", label: "Reservations" },
                { value: callTypeCounts["faq"] || 0, color: "#60A5FA", label: "FAQ" },
                { value: callTypeCounts["transfer"] || 0, color: "#8B5CF6", label: "Transferred" },
                { value: callTypeCounts["missed"] || 0, color: "#F87171", label: "Missed" },
              ]} />
            </div>
          </div>

          {/* Call Log */}
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: "22px 24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600 }}>Recent Calls</h3>
              <span style={{ fontSize: 12, color: "var(--text-dim)" }}>{totalCalls} total</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "130px 80px 1fr 90px 70px 70px", gap: 8, padding: "8px 0", borderBottom: "1px solid var(--border)", fontSize: 11, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 500 }}>
              <span>Caller</span><span>Type</span><span>Summary</span><span>Status</span><span>Duration</span><span>Time</span>
            </div>
            {calls.length > 0 ? calls.slice(0, 10).map((c, i) => {
              const st = statusStyle[c.status] || { color: "var(--text-dim)", bg: "transparent" };
              return (
                <div key={c.id} style={{ display: "grid", gridTemplateColumns: "130px 80px 1fr 90px 70px 70px", gap: 8, padding: "10px 0", borderBottom: i < Math.min(calls.length, 10) - 1 ? "1px solid var(--border)" : "none", fontSize: 12, alignItems: "center" }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "var(--text-secondary)" }}>{c.caller_number || "Unknown"}</span>
                  <span style={{ fontSize: 10, padding: "2px 6px", borderRadius: 4, background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-secondary)", textAlign: "center", textTransform: "capitalize" }}>{c.call_type || "—"}</span>
                  <span style={{ color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.summary || "No summary"}</span>
                  <span style={{ fontSize: 10, fontWeight: 600, color: st.color, background: st.bg, padding: "2px 8px", borderRadius: 12, textAlign: "center", textTransform: "capitalize" }}>{c.status}</span>
                  <span style={{ fontSize: 11, color: "var(--text-dim)" }}>{formatDuration(c.duration_seconds)}</span>
                  <span style={{ fontSize: 11, color: "var(--text-dim)" }}>{timeAgo(c.started_at)}</span>
                </div>
              );
            }) : (
              <EmptyState title="No calls recorded" subtitle="When customers call your restaurant, every conversation will be logged here." />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
