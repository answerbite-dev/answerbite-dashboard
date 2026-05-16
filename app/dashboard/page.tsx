"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/* ── Icons ─────────────────────────────────────────────────────────────────── */
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
  mic: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" /></svg>,
  phoneOff: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"><path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67" /><path d="M22.95 16.96A2 2 0 0 0 22 16.92" /><line x1="1" y1="1" x2="23" y2="23" /></svg>,
  inbox: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12" /><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" /></svg>,
  zap: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>,
};

/* ── Empty State Component ─────────────────────────────────────────────────── */
function EmptyState({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px", textAlign: "center" }}>
      <div style={{ color: "var(--text-dim)", opacity: 0.4, marginBottom: 16 }}>{icon}</div>
      <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6 }}>{title}</p>
      <p style={{ fontSize: 12, color: "var(--text-dim)", maxWidth: 260, lineHeight: 1.5 }}>{subtitle}</p>
    </div>
  );
}

/* ── Stat Card (Empty) ─────────────────────────────────────────────────────── */
function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: "20px 22px", display: "flex", flexDirection: "column", gap: 14, animation: "fadeUp 0.5s ease both" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ color: "var(--accent)" }}>{icon}</span>
        <span style={{ fontSize: 12, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 500 }}>{label}</span>
      </div>
      <div style={{ fontSize: 30, fontWeight: 700, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.02em", color: "var(--text-primary)" }}>{value}</div>
      {/* Empty sparkline placeholder */}
      <div style={{ height: 36, display: "flex", alignItems: "flex-end" }}>
        <div style={{ width: "100%", height: 1, background: "var(--border)", borderRadius: 1 }} />
      </div>
    </div>
  );
}

/* ── Dashboard ─────────────────────────────────────────────────────────────── */
export default function Dashboard() {
  const router = useRouter();
  const [nav, setNav] = useState("home");
  const [search, setSearch] = useState("");

  const navItems = [
    { id: "home", icon: I.home, label: "Overview" },
    { id: "calls", icon: I.phone, label: "Call Log" },
    { id: "orders", icon: I.order, label: "Orders" },
    { id: "reservations", icon: I.calendar, label: "Reservations" },
    { id: "analytics", icon: I.bar, label: "Analytics" },
    { id: "settings", icon: I.settings, label: "Settings" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-primary)" }}>
      {/* ── Sidebar ── */}
      <aside style={{ width: 240, background: "var(--bg-secondary)", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", padding: "24px 0", flexShrink: 0 }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 20px 24px", borderBottom: "1px solid var(--border)" }}>
          <svg width="30" height="30" viewBox="0 0 44 44" fill="none">
            <rect width="44" height="44" rx="11" fill="#E8FF5A" />
            <path d="M22 10a8 8 0 0 0-8 8v3a1 1 0 0 0 1 1h2l1.5 3h7l1.5-3h2a1 1 0 0 0 1-1v-3a8 8 0 0 0-8-8z" fill="#0a0a0b" />
            <circle cx="19" cy="17" r="1.5" fill="#E8FF5A" />
            <circle cx="25" cy="17" r="1.5" fill="#E8FF5A" />
          </svg>
          <span style={{ fontSize: 17, fontWeight: 700, letterSpacing: "-0.02em" }}>AnswerBite</span>
        </div>

        {/* Nav */}
        <nav style={{ display: "flex", flexDirection: "column", gap: 2, padding: "16px 10px", flex: 1 }}>
          {navItems.map((item) => (
            <button key={item.id} onClick={() => setNav(item.id)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8, fontSize: 13, fontWeight: nav === item.id ? 600 : 400, color: nav === item.id ? "var(--text-primary)" : "var(--text-secondary)", background: nav === item.id ? "var(--bg-card)" : "transparent", border: nav === item.id ? "1px solid var(--border)" : "1px solid transparent", cursor: "pointer", fontFamily: "inherit", width: "100%", textAlign: "left" }}>
              {item.icon}{item.label}
            </button>
          ))}
        </nav>

        {/* Agent Status - Pending Setup */}
        <div style={{ margin: "0 10px 12px", padding: "14px", borderRadius: 10, background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#FBBF24", boxShadow: "0 0 8px #FBBF2460", animation: "pulse 2s ease-in-out infinite" }} />
            <span style={{ fontSize: 12, fontWeight: 600 }}>Setup Required</span>
          </div>
          <p style={{ fontSize: 11, color: "var(--text-dim)", lineHeight: 1.5 }}>Complete your AI agent setup to start receiving calls.</p>
        </div>

        <div style={{ padding: "0 10px" }}>
          <button onClick={() => router.push("/login")} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8, fontSize: 13, color: "var(--text-dim)", background: "transparent", border: "none", cursor: "pointer", fontFamily: "inherit", width: "100%", textAlign: "left" }}>
            {I.logout} Log out
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main style={{ flex: 1, overflow: "auto" }}>
        {/* Top Bar */}
        <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 32px", borderBottom: "1px solid var(--border)", background: "var(--bg-primary)", position: "sticky", top: 0, zIndex: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 14px", width: 340 }}>
            <span style={{ color: "var(--text-dim)" }}>{I.search}</span>
            <input placeholder="Search calls, orders, customers..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ background: "none", border: "none", outline: "none", color: "var(--text-primary)", fontSize: 13, fontFamily: "inherit", width: "100%" }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button style={{ position: "relative", color: "var(--text-secondary)", background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: 8, padding: 8, display: "flex", cursor: "pointer" }}>
              {I.bell}
            </button>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg, #E8FF5A, #4ADE80)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#0a0a0b" }}>AB</div>
          </div>
        </header>

        {/* Content */}
        <div style={{ padding: "28px 32px", display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Header */}
          <div style={{ animation: "fadeUp 0.5s ease both" }}>
            <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em" }}>Dashboard</h1>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", marginTop: 4 }}>Your AI phone agent performance at a glance</p>
          </div>

          {/* Onboarding Banner */}
          <div style={{ background: "linear-gradient(135deg, #E8FF5A10, #4ADE8008)", border: "1px solid #E8FF5A30", borderRadius: 14, padding: "24px 28px", display: "flex", alignItems: "center", gap: 20, animation: "fadeUp 0.5s ease both", animationDelay: "0.1s" }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: "#E8FF5A15", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "var(--accent)" }}>
              {I.zap}
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Get your AI agent live</h3>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>Complete setup to start answering calls, taking orders, and booking reservations automatically.</p>
            </div>
            <button style={{ padding: "10px 20px", fontSize: 13, fontWeight: 600, borderRadius: 8, background: "var(--accent)", color: "#0a0a0b", border: "none", cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>
              Complete Setup
            </button>
          </div>

          {/* Stats - All Zeros */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            <Stat icon={I.phone} label="Total Calls" value="0" />
            <Stat icon={I.order} label="Orders Taken" value="0" />
            <Stat icon={I.calendar} label="Reservations" value="0" />
            <Stat icon={I.dollar} label="Revenue Captured" value="$0" />
          </div>

          {/* Charts Row - Empty */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: "22px 24px", animation: "fadeUp 0.5s ease both", animationDelay: "0.2s" }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Daily Call Volume</h3>
              <EmptyState
                icon={I.phoneOff}
                title="No calls yet"
                subtitle="Call data will appear here once your AI agent starts handling calls."
              />
            </div>

            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: "22px 24px", animation: "fadeUp 0.5s ease both", animationDelay: "0.3s" }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Call Outcomes</h3>
              <EmptyState
                icon={<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>}
                title="No data to display"
                subtitle="Order, reservation, and FAQ breakdowns will show here."
              />
            </div>
          </div>

          {/* Call Log + Sidebar - Empty */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
            {/* Call Log */}
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: "22px 24px", animation: "fadeUp 0.5s ease both", animationDelay: "0.35s" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600 }}>Recent Calls</h3>
              </div>

              {/* Table Header */}
              <div style={{ display: "grid", gridTemplateColumns: "130px 70px 1fr 90px 60px 60px", gap: 8, padding: "8px 0", borderBottom: "1px solid var(--border)", fontSize: 11, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 500 }}>
                <span>Caller</span><span>Type</span><span>Detail</span><span>Status</span><span>Duration</span><span>Time</span>
              </div>

              {/* Empty state */}
              <EmptyState
                icon={I.inbox}
                title="No calls recorded"
                subtitle="When customers call your restaurant, every conversation will be logged here with full details."
              />
            </div>

            {/* Right Column */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Activity */}
              <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: "22px 24px", animation: "fadeUp 0.5s ease both", animationDelay: "0.4s" }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Live Activity</h3>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "30px 20px", textAlign: "center" }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--border)", marginBottom: 14 }} />
                  <p style={{ fontSize: 12, color: "var(--text-dim)", lineHeight: 1.5 }}>Activity will stream here in real time as calls come in.</p>
                </div>
              </div>

              {/* Call Types */}
              <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: "22px 24px", animation: "fadeUp 0.5s ease both", animationDelay: "0.45s" }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Call Types</h3>
                {["Phone Orders", "Reservations", "Menu / Dietary", "Hours / Location", "Catering"].map((t, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0" }}>
                    <span style={{ fontSize: 11, color: "var(--text-dim)", fontFamily: "'JetBrains Mono', monospace", width: 16 }}>{i + 1}</span>
                    <span style={{ fontSize: 13, fontWeight: 500, flex: 1, color: "var(--text-dim)" }}>{t}</span>
                    <div style={{ width: 80, height: 6, background: "var(--bg-secondary)", borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: "0%", background: "var(--accent)", borderRadius: 3 }} />
                    </div>
                    <span style={{ fontSize: 11, color: "var(--text-dim)", fontFamily: "'JetBrains Mono', monospace", width: 32, textAlign: "right" }}>0</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
