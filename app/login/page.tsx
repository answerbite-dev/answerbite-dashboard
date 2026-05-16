"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulate auth delay
    await new Promise((r) => setTimeout(r, 1200));

    if (email && password) {
      router.push("/dashboard");
    } else {
      setError("Please enter your email and password.");
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      {/* Background decoration */}
      <div style={styles.bgGlow1} />
      <div style={styles.bgGlow2} />
      <div style={styles.gridOverlay} />

      <div style={styles.container}>
        {/* Left - Branding panel */}
        <div style={styles.brandPanel}>
          <div style={styles.brandContent}>
            <div style={styles.logoMark}>
              <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                <rect width="44" height="44" rx="11" fill="#E8FF5A" />
                <path
                  d="M12 15h20M12 22h14M12 29h17"
                  stroke="#0a0a0b"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                />
                <circle cx="33" cy="30" r="6" fill="#0a0a0b" />
                <path
                  d="M31.5 30l1.5 1.5 3-3"
                  stroke="#E8FF5A"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h1 style={styles.brandTitle}>AnswerBite</h1>
            <p style={styles.brandTagline}>
              Instant insights from every question.
              <br />
              Analytics that actually bite back.
            </p>

            <div style={styles.featureList}>
              {[
                "Real-time Q&A analytics",
                "Smart topic clustering",
                "Response quality scoring",
                "Team performance tracking",
              ].map((feat, i) => (
                <div
                  key={feat}
                  style={{
                    ...styles.featureItem,
                    animationDelay: `${0.6 + i * 0.1}s`,
                  }}
                >
                  <span style={styles.featureCheck}>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#E8FF5A"
                      strokeWidth="3"
                      strokeLinecap="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            <div style={styles.statsRow}>
              <div style={styles.statBlock}>
                <span style={styles.statNumber}>2.4M+</span>
                <span style={styles.statLabel}>Questions analyzed</span>
              </div>
              <div style={styles.statDivider} />
              <div style={styles.statBlock}>
                <span style={styles.statNumber}>98.7%</span>
                <span style={styles.statLabel}>Uptime</span>
              </div>
              <div style={styles.statDivider} />
              <div style={styles.statBlock}>
                <span style={styles.statNumber}>340+</span>
                <span style={styles.statLabel}>Teams</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right - Login form */}
        <div style={styles.formPanel}>
          <div style={styles.formWrapper}>
            <div style={styles.formHeader}>
              <h2 style={styles.formTitle}>Welcome back</h2>
              <p style={styles.formSubtitle}>
                Sign in to your AnswerBite account
              </p>
            </div>

            <form onSubmit={handleLogin} style={styles.form}>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Email</label>
                <input
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={styles.input}
                  autoComplete="email"
                />
              </div>

              <div style={styles.fieldGroup}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <label style={styles.label}>Password</label>
                  <button type="button" style={styles.forgotLink}>
                    Forgot password?
                  </button>
                </div>
                <div style={styles.passwordWrap}>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={styles.input}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={styles.eyeBtn}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? (
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#6a6a72"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      >
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#6a6a72"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {error && <p style={styles.errorText}>{error}</p>}

              <button
                type="submit"
                disabled={loading}
                style={{
                  ...styles.submitBtn,
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? (
                  <span style={styles.spinner} />
                ) : (
                  "Sign in"
                )}
              </button>

              <div style={styles.dividerRow}>
                <div style={styles.dividerLine} />
                <span style={styles.dividerText}>or continue with</span>
                <div style={styles.dividerLine} />
              </div>

              <div style={styles.socialRow}>
                <button type="button" style={styles.socialBtn}>
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Google
                </button>
                <button type="button" style={styles.socialBtn}>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="#f0f0f0"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  GitHub
                </button>
              </div>
            </form>

            <p style={styles.signupText}>
              Don&apos;t have an account?{" "}
              <button type="button" style={styles.signupLink}>
                Create one
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "var(--bg-primary)",
    position: "relative",
    overflow: "hidden",
    padding: 20,
  },
  bgGlow1: {
    position: "absolute",
    width: 600,
    height: 600,
    borderRadius: "50%",
    background: "radial-gradient(circle, #E8FF5A08 0%, transparent 70%)",
    top: -200,
    left: -100,
    pointerEvents: "none" as const,
  },
  bgGlow2: {
    position: "absolute",
    width: 500,
    height: 500,
    borderRadius: "50%",
    background: "radial-gradient(circle, #E8FF5A05 0%, transparent 70%)",
    bottom: -150,
    right: -100,
    pointerEvents: "none" as const,
  },
  gridOverlay: {
    position: "absolute",
    inset: 0,
    backgroundImage:
      "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
    backgroundSize: "64px 64px",
    opacity: 0.15,
    pointerEvents: "none" as const,
  },
  container: {
    display: "flex",
    width: "100%",
    maxWidth: 1040,
    minHeight: 620,
    background: "var(--bg-card)",
    border: "1px solid var(--border)",
    borderRadius: 20,
    overflow: "hidden",
    position: "relative" as const,
    zIndex: 1,
    boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
    animation: "fadeUp 0.6s ease both",
  },
  brandPanel: {
    flex: "1 1 50%",
    background:
      "linear-gradient(160deg, #111113 0%, #0a0a0b 50%, #0d0d10 100%)",
    padding: "48px 44px",
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "center",
    borderRight: "1px solid var(--border)",
  },
  brandContent: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 28,
  },
  logoMark: {
    animation: "fadeUp 0.5s ease both",
    animationDelay: "0.2s",
  },
  brandTitle: {
    fontSize: 36,
    fontWeight: 700,
    letterSpacing: "-0.03em",
    color: "var(--text-primary)",
    animation: "fadeUp 0.5s ease both",
    animationDelay: "0.3s",
  },
  brandTagline: {
    fontSize: 15,
    lineHeight: 1.6,
    color: "var(--text-secondary)",
    animation: "fadeUp 0.5s ease both",
    animationDelay: "0.4s",
  },
  featureList: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 12,
    marginTop: 8,
  },
  featureItem: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontSize: 13,
    color: "var(--text-secondary)",
    animation: "fadeUp 0.5s ease both",
    opacity: 0,
  },
  featureCheck: {
    width: 22,
    height: 22,
    borderRadius: 6,
    background: "#E8FF5A15",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  statsRow: {
    display: "flex",
    alignItems: "center",
    gap: 20,
    marginTop: 16,
    paddingTop: 24,
    borderTop: "1px solid var(--border)",
    animation: "fadeUp 0.5s ease both",
    animationDelay: "1s",
  },
  statBlock: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 2,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 700,
    color: "var(--accent)",
    fontFamily: "'JetBrains Mono', monospace",
  },
  statLabel: {
    fontSize: 11,
    color: "var(--text-dim)",
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
  },
  statDivider: {
    width: 1,
    height: 32,
    background: "var(--border)",
  },
  formPanel: {
    flex: "1 1 50%",
    padding: "48px 44px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  formWrapper: {
    width: "100%",
    maxWidth: 380,
    display: "flex",
    flexDirection: "column" as const,
    gap: 28,
    animation: "fadeUp 0.6s ease both",
    animationDelay: "0.3s",
  },
  formHeader: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 6,
  },
  formTitle: {
    fontSize: 26,
    fontWeight: 700,
    letterSpacing: "-0.02em",
  },
  formSubtitle: {
    fontSize: 14,
    color: "var(--text-secondary)",
  },
  form: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 20,
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 7,
  },
  label: {
    fontSize: 13,
    fontWeight: 500,
    color: "var(--text-secondary)",
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    fontSize: 14,
    borderRadius: "var(--radius-sm)",
    border: "1px solid var(--border)",
    background: "var(--bg-input)",
    color: "var(--text-primary)",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    fontFamily: "inherit",
  },
  passwordWrap: {
    position: "relative" as const,
  },
  eyeBtn: {
    position: "absolute" as const,
    right: 12,
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    padding: 4,
  },
  forgotLink: {
    fontSize: 12,
    color: "var(--accent)",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontFamily: "inherit",
    fontWeight: 500,
  },
  errorText: {
    fontSize: 13,
    color: "var(--danger)",
    background: "#F8717115",
    padding: "10px 14px",
    borderRadius: "var(--radius-sm)",
    border: "1px solid #F8717130",
  },
  submitBtn: {
    width: "100%",
    padding: "13px 0",
    fontSize: 14,
    fontWeight: 600,
    borderRadius: "var(--radius-sm)",
    background: "var(--accent)",
    color: "#0a0a0b",
    border: "none",
    cursor: "pointer",
    transition: "opacity 0.2s, transform 0.1s",
    fontFamily: "inherit",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 4,
  },
  spinner: {
    width: 18,
    height: 18,
    border: "2px solid #0a0a0b40",
    borderTopColor: "#0a0a0b",
    borderRadius: "50%",
    display: "inline-block",
    animation: "spin 0.6s linear infinite",
  },
  dividerRow: {
    display: "flex",
    alignItems: "center",
    gap: 14,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    background: "var(--border)",
  },
  dividerText: {
    fontSize: 12,
    color: "var(--text-dim)",
    whiteSpace: "nowrap" as const,
  },
  socialRow: {
    display: "flex",
    gap: 12,
  },
  socialBtn: {
    flex: 1,
    padding: "11px 0",
    fontSize: 13,
    fontWeight: 500,
    borderRadius: "var(--radius-sm)",
    border: "1px solid var(--border)",
    background: "var(--bg-secondary)",
    color: "var(--text-primary)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    transition: "border-color 0.2s, background 0.2s",
    fontFamily: "inherit",
  },
  signupText: {
    fontSize: 13,
    color: "var(--text-dim)",
    textAlign: "center" as const,
  },
  signupLink: {
    color: "var(--accent)",
    fontWeight: 600,
    background: "none",
    border: "none",
    cursor: "pointer",
    fontFamily: "inherit",
    fontSize: 13,
  },
};
