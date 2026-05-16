"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    if (email && password) {
      router.push("/dashboard");
    } else {
      setError("Please enter your email and password.");
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-primary)", position: "relative", overflow: "hidden", padding: 20 }}>
      {/* BG effects */}
      <div style={{ position: "absolute", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, #E8FF5A08 0%, transparent 70%)", top: -200, left: -100, pointerEvents: "none" }} />
      <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, #E8FF5A05 0%, transparent 70%)", bottom: -150, right: -100, pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)", backgroundSize: "64px 64px", opacity: 0.15, pointerEvents: "none" }} />

      <div style={{ display: "flex", width: "100%", maxWidth: 1040, minHeight: 620, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 20, overflow: "hidden", position: "relative", zIndex: 1, boxShadow: "0 24px 80px rgba(0,0,0,0.5)", animation: "fadeUp 0.6s ease both" }}>

        {/* Left Brand */}
        <div style={{ flex: "1 1 50%", background: "linear-gradient(160deg, #111113, #0a0a0b 50%, #0d0d10)", padding: "48px 44px", display: "flex", flexDirection: "column", justifyContent: "center", borderRight: "1px solid var(--border)" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            <div style={{ animation: "fadeUp 0.5s ease both", animationDelay: "0.2s" }}>
              <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                <rect width="44" height="44" rx="11" fill="#E8FF5A" />
                <path d="M22 10a8 8 0 0 0-8 8v3a1 1 0 0 0 1 1h2l1.5 3h7l1.5-3h2a1 1 0 0 0 1-1v-3a8 8 0 0 0-8-8z" fill="#0a0a0b" />
                <circle cx="19" cy="17" r="1.5" fill="#E8FF5A" />
                <circle cx="25" cy="17" r="1.5" fill="#E8FF5A" />
                <path d="M16 30h12M19 27h6" stroke="#0a0a0b" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </div>
            <h1 style={{ fontSize: 36, fontWeight: 700, letterSpacing: "-0.03em", animation: "fadeUp 0.5s ease both", animationDelay: "0.3s" }}>AnswerBite</h1>
            <p style={{ fontSize: 15, lineHeight: 1.6, color: "var(--text-secondary)", animation: "fadeUp 0.5s ease both", animationDelay: "0.4s" }}>
              The AI phone agent built for restaurants.
              <br />
              Answer every call. Take every order. Book every table.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 8 }}>
              {["24/7 AI phone answering", "Order taking with POS sync", "Reservation booking", "Menu & FAQ handling", "Call analytics & insights"].map((feat, i) => (
                <div key={feat} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "var(--text-secondary)", animation: "fadeUp 0.5s ease both", opacity: 0, animationDelay: `${0.6 + i * 0.1}s` }}>
                  <span style={{ width: 22, height: 22, borderRadius: 6, background: "#E8FF5A15", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#E8FF5A" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
                  </span>
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 16, paddingTop: 24, borderTop: "1px solid var(--border)", animation: "fadeUp 0.5s ease both", animationDelay: "1.1s" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={{ fontSize: 20, fontWeight: 700, color: "var(--accent)", fontFamily: "'JetBrains Mono', monospace" }}>500K+</span>
                <span style={{ fontSize: 11, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Calls handled</span>
              </div>
              <div style={{ width: 1, height: 32, background: "var(--border)" }} />
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={{ fontSize: 20, fontWeight: 700, color: "var(--accent)", fontFamily: "'JetBrains Mono', monospace" }}>22%</span>
                <span style={{ fontSize: 11, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Revenue boost</span>
              </div>
              <div style={{ width: 1, height: 32, background: "var(--border)" }} />
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={{ fontSize: 20, fontWeight: 700, color: "var(--accent)", fontFamily: "'JetBrains Mono', monospace" }}>24hr</span>
                <span style={{ fontSize: 11, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Setup time</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form */}
        <div style={{ flex: "1 1 50%", padding: "48px 44px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: "100%", maxWidth: 380, display: "flex", flexDirection: "column", gap: 28, animation: "fadeUp 0.6s ease both", animationDelay: "0.3s" }}>
            <div>
              <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em" }}>Welcome back</h2>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", marginTop: 6 }}>Sign in to your AnswerBite dashboard</p>
            </div>

            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: "var(--text-secondary)" }}>Email</label>
                <input type="email" placeholder="you@restaurant.com" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: "100%", padding: "12px 14px", fontSize: 14, borderRadius: 8, border: "1px solid var(--border)", background: "var(--bg-input)", color: "var(--text-primary)", outline: "none", fontFamily: "inherit" }} />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <label style={{ fontSize: 13, fontWeight: 500, color: "var(--text-secondary)" }}>Password</label>
                  <button type="button" style={{ fontSize: 12, color: "var(--accent)", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontWeight: 500 }}>Forgot password?</button>
                </div>
                <div style={{ position: "relative" }}>
                  <input type={showPw ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: "100%", padding: "12px 14px", fontSize: 14, borderRadius: 8, border: "1px solid var(--border)", background: "var(--bg-input)", color: "var(--text-primary)", outline: "none", fontFamily: "inherit" }} />
                  <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", display: "flex", padding: 4 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6a6a72" strokeWidth="1.8" strokeLinecap="round">
                      {showPw ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><line x1="1" y1="1" x2="23" y2="23" /></> : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>}
                    </svg>
                  </button>
                </div>
              </div>

              {error && <p style={{ fontSize: 13, color: "var(--danger)", background: "#F8717115", padding: "10px 14px", borderRadius: 8, border: "1px solid #F8717130" }}>{error}</p>}

              <button type="submit" disabled={loading} style={{ width: "100%", padding: "13px 0", fontSize: 14, fontWeight: 600, borderRadius: 8, background: "var(--accent)", color: "#0a0a0b", border: "none", cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 4, opacity: loading ? 0.7 : 1 }}>
                {loading ? <span style={{ width: 18, height: 18, border: "2px solid #0a0a0b40", borderTopColor: "#0a0a0b", borderRadius: "50%", display: "inline-block", animation: "spin 0.6s linear infinite" }} /> : "Sign in"}
              </button>

              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
                <span style={{ fontSize: 12, color: "var(--text-dim)" }}>or continue with</span>
                <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
              </div>

              <div style={{ display: "flex", gap: 12 }}>
                <button type="button" style={{ flex: 1, padding: "11px 0", fontSize: 13, fontWeight: 500, borderRadius: 8, border: "1px solid var(--border)", background: "var(--bg-secondary)", color: "var(--text-primary)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "inherit" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                  Google
                </button>
                <button type="button" style={{ flex: 1, padding: "11px 0", fontSize: 13, fontWeight: 500, borderRadius: 8, border: "1px solid var(--border)", background: "var(--bg-secondary)", color: "var(--text-primary)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "inherit" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#f0f0f0"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                  GitHub
                </button>
              </div>
            </form>

            <p style={{ fontSize: 13, color: "var(--text-dim)", textAlign: "center" }}>
              Don&apos;t have an account?{" "}
              <button type="button" style={{ color: "var(--accent)", fontWeight: 600, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 13 }}>Get started</button>
            </p>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
