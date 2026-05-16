"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/* ── Icons ─────────────────────────────────────────────────────────────────── */
const I = {
  back: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>,
  check: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>,
  plus: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>,
  trash: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>,
  store: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
  phone: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>,
  clock: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>,
  mic: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" /></svg>,
  utensils: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" /><path d="M7 2v20" /><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7" /></svg>,
  zap: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>,
};

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

interface MenuItem {
  id: string;
  name: string;
  price: string;
  category: string;
}

interface Hours {
  day: string;
  open: string;
  close: string;
  closed: boolean;
}

export default function SetupPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);

  // Step 0: Restaurant Info
  const [name, setName] = useState("Tony's Pizza");
  const [address, setAddress] = useState("742 Evergreen Terrace, Detroit, MI 48201");
  const [cuisine, setCuisine] = useState("Pizza");
  const [phone, setPhone] = useState("");

  // Step 1: Hours
  const [hours, setHours] = useState<Hours[]>(
    DAYS.map((d) => ({
      day: d,
      open: d === "Sunday" ? "12:00" : "11:00",
      close: d === "Friday" || d === "Saturday" ? "23:00" : "22:00",
      closed: false,
    }))
  );

  // Step 2: Menu
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    { id: "1", name: "Margherita Pizza", price: "12.99", category: "Pizzas" },
    { id: "2", name: "Pepperoni Pizza", price: "14.99", category: "Pizzas" },
    { id: "3", name: "BBQ Chicken Pizza", price: "16.99", category: "Pizzas" },
    { id: "4", name: "Garlic Knots (6pc)", price: "5.99", category: "Sides" },
    { id: "5", name: "Caesar Salad", price: "8.99", category: "Sides" },
    { id: "6", name: "Buffalo Wings (10pc)", price: "11.99", category: "Sides" },
    { id: "7", name: "Tiramisu", price: "7.99", category: "Desserts" },
    { id: "8", name: "Cannoli", price: "4.99", category: "Desserts" },
    { id: "9", name: "2L Coca-Cola", price: "3.99", category: "Drinks" },
    { id: "10", name: "Sparkling Water", price: "2.49", category: "Drinks" },
  ]);
  const [newItem, setNewItem] = useState({ name: "", price: "", category: "Pizzas" });

  // Step 3: AI Agent Config
  const [greeting, setGreeting] = useState(
    "Thank you for calling Tony's Pizza! How can I help you today?"
  );
  const [voiceStyle, setVoiceStyle] = useState("friendly");
  const [canTakeOrders, setCanTakeOrders] = useState(true);
  const [canBookReservations, setCanBookReservations] = useState(true);
  const [canTransfer, setCanTransfer] = useState(true);
  const [transferNumber, setTransferNumber] = useState("");

  const steps = [
    { icon: I.store, label: "Restaurant Info" },
    { icon: I.clock, label: "Hours" },
    { icon: I.utensils, label: "Menu" },
    { icon: I.mic, label: "AI Agent" },
    { icon: I.zap, label: "Go Live" },
  ];

  const addMenuItem = () => {
    if (newItem.name && newItem.price) {
      setMenuItems([...menuItems, { ...newItem, id: Date.now().toString() }]);
      setNewItem({ name: "", price: "", category: newItem.category });
    }
  };

  const removeMenuItem = (id: string) => {
    setMenuItems(menuItems.filter((m) => m.id !== id));
  };

  const handleFinish = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 2000));
    router.push("/dashboard");
  };

  const categories = [...new Set(menuItems.map((m) => m.category))];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", display: "flex" }}>
      {/* Sidebar Steps */}
      <aside style={{ width: 280, background: "var(--bg-secondary)", borderRight: "1px solid var(--border)", padding: "32px 0", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "0 24px 28px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <svg width="28" height="28" viewBox="0 0 44 44" fill="none">
              <rect width="44" height="44" rx="11" fill="#E8FF5A" />
              <path d="M22 10a8 8 0 0 0-8 8v3a1 1 0 0 0 1 1h2l1.5 3h7l1.5-3h2a1 1 0 0 0 1-1v-3a8 8 0 0 0-8-8z" fill="#0a0a0b" />
              <circle cx="19" cy="17" r="1.5" fill="#E8FF5A" />
              <circle cx="25" cy="17" r="1.5" fill="#E8FF5A" />
            </svg>
            <span style={{ fontSize: 17, fontWeight: 700, letterSpacing: "-0.02em" }}>AnswerBite</span>
          </div>
          <p style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 8 }}>AI Agent Setup</p>
        </div>

        <nav style={{ padding: "20px 16px", flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
          {steps.map((s, i) => (
            <button key={i} onClick={() => i <= step && setStep(i)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 10, fontSize: 13, fontWeight: step === i ? 600 : 400, color: i <= step ? "var(--text-primary)" : "var(--text-dim)", background: step === i ? "var(--bg-card)" : "transparent", border: step === i ? "1px solid var(--border)" : "1px solid transparent", cursor: i <= step ? "pointer" : "default", fontFamily: "inherit", width: "100%", textAlign: "left", opacity: i > step ? 0.4 : 1, transition: "all 0.15s" }}>
              <span style={{ width: 28, height: 28, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", background: i < step ? "#4ADE8020" : i === step ? "#E8FF5A15" : "var(--bg-secondary)", color: i < step ? "#4ADE80" : i === step ? "var(--accent)" : "var(--text-dim)", fontSize: 12 }}>
                {i < step ? I.check : s.icon}
              </span>
              {s.label}
            </button>
          ))}
        </nav>

        <div style={{ padding: "0 16px" }}>
          <button onClick={() => router.push("/dashboard")} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", fontSize: 13, color: "var(--text-dim)", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
            {I.back} Back to Dashboard
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, overflow: "auto", display: "flex", justifyContent: "center" }}>
        <div style={{ width: "100%", maxWidth: 640, padding: "40px 32px" }}>

          {/* Step 0: Restaurant Info */}
          {step === 0 && (
            <div style={{ animation: "fadeUp 0.4s ease both" }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Restaurant Information</h2>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 28 }}>Tell us about your restaurant so the AI agent knows what to say.</p>

              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <Field label="Restaurant Name" value={name} onChange={setName} placeholder="Tony's Pizza" />
                <Field label="Address" value={address} onChange={setAddress} placeholder="123 Main St, City, State" />
                <Field label="Cuisine Type" value={cuisine} onChange={setCuisine} placeholder="Pizza, Italian, Mexican..." />
                <Field label="Restaurant Phone Number" value={phone} onChange={setPhone} placeholder="(313) 555-0100" />
              </div>
            </div>
          )}

          {/* Step 1: Hours */}
          {step === 1 && (
            <div style={{ animation: "fadeUp 0.4s ease both" }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Business Hours</h2>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 28 }}>Set your hours so the AI knows when you&apos;re open and can inform callers.</p>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {hours.map((h, i) => (
                  <div key={h.day} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10 }}>
                    <span style={{ fontSize: 13, fontWeight: 500, width: 90 }}>{h.day}</span>
                    <button onClick={() => { const u = [...hours]; u[i].closed = !u[i].closed; setHours(u); }} style={{ padding: "4px 10px", fontSize: 11, borderRadius: 6, border: "1px solid var(--border)", background: h.closed ? "#F8717115" : "#4ADE8015", color: h.closed ? "#F87171" : "#4ADE80", cursor: "pointer", fontFamily: "inherit", fontWeight: 600, width: 60 }}>
                      {h.closed ? "Closed" : "Open"}
                    </button>
                    {!h.closed && (
                      <>
                        <input type="time" value={h.open} onChange={(e) => { const u = [...hours]; u[i].open = e.target.value; setHours(u); }} style={timeInput} />
                        <span style={{ color: "var(--text-dim)", fontSize: 12 }}>to</span>
                        <input type="time" value={h.close} onChange={(e) => { const u = [...hours]; u[i].close = e.target.value; setHours(u); }} style={timeInput} />
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Menu */}
          {step === 2 && (
            <div style={{ animation: "fadeUp 0.4s ease both" }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Menu</h2>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 28 }}>Add your menu items so the AI can take orders and answer menu questions.</p>

              {/* Add Item */}
              <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                <input placeholder="Item name" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} style={inputStyle} />
                <input placeholder="Price" value={newItem.price} onChange={(e) => setNewItem({ ...newItem, price: e.target.value })} style={{ ...inputStyle, width: 90, flexShrink: 0 }} />
                <select value={newItem.category} onChange={(e) => setNewItem({ ...newItem, category: e.target.value })} style={{ ...inputStyle, width: 120, flexShrink: 0 }}>
                  <option>Pizzas</option><option>Sides</option><option>Desserts</option><option>Drinks</option><option>Specials</option>
                </select>
                <button onClick={addMenuItem} style={{ padding: "0 14px", borderRadius: 8, background: "var(--accent)", color: "#0a0a0b", border: "none", cursor: "pointer", display: "flex", alignItems: "center", flexShrink: 0 }}>{I.plus}</button>
              </div>

              {/* Menu List */}
              {categories.map((cat) => (
                <div key={cat} style={{ marginBottom: 20 }}>
                  <h4 style={{ fontSize: 12, fontWeight: 600, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>{cat}</h4>
                  {menuItems.filter((m) => m.category === cat).map((item) => (
                    <div key={item.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 13, fontWeight: 500 }}>{item.name}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <span style={{ fontSize: 13, color: "var(--accent)", fontFamily: "'JetBrains Mono', monospace" }}>${item.price}</span>
                        <button onClick={() => removeMenuItem(item.id)} style={{ color: "var(--text-dim)", background: "none", border: "none", cursor: "pointer", display: "flex", padding: 4 }}>{I.trash}</button>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* Step 3: AI Agent Config */}
          {step === 3 && (
            <div style={{ animation: "fadeUp 0.4s ease both" }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>AI Agent Configuration</h2>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 28 }}>Customize how your AI phone agent talks to customers.</p>

              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                  <label style={labelStyle}>Greeting Message</label>
                  <textarea value={greeting} onChange={(e) => setGreeting(e.target.value)} rows={3} style={{ ...inputStyle, resize: "vertical" }} />
                  <span style={{ fontSize: 11, color: "var(--text-dim)" }}>This is the first thing callers hear when the AI picks up.</span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                  <label style={labelStyle}>Voice Style</label>
                  <div style={{ display: "flex", gap: 8 }}>
                    {["friendly", "professional", "casual"].map((v) => (
                      <button key={v} onClick={() => setVoiceStyle(v)} style={{ flex: 1, padding: "10px 0", fontSize: 13, borderRadius: 8, border: `1px solid ${voiceStyle === v ? "var(--accent)" : "var(--border)"}`, background: voiceStyle === v ? "#E8FF5A15" : "var(--bg-card)", color: voiceStyle === v ? "var(--accent)" : "var(--text-secondary)", cursor: "pointer", fontFamily: "inherit", fontWeight: voiceStyle === v ? 600 : 400, textTransform: "capitalize" }}>
                        {v}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <label style={labelStyle}>Capabilities</label>
                  <Toggle label="Take phone orders" checked={canTakeOrders} onChange={setCanTakeOrders} />
                  <Toggle label="Book reservations" checked={canBookReservations} onChange={setCanBookReservations} />
                  <Toggle label="Transfer to staff when needed" checked={canTransfer} onChange={setCanTransfer} />
                </div>

                {canTransfer && (
                  <Field label="Transfer Phone Number" value={transferNumber} onChange={setTransferNumber} placeholder="Manager's direct line" />
                )}
              </div>
            </div>
          )}

          {/* Step 4: Go Live */}
          {step === 4 && (
            <div style={{ animation: "fadeUp 0.4s ease both", textAlign: "center", paddingTop: 40 }}>
              <div style={{ width: 72, height: 72, borderRadius: 20, background: "#E8FF5A15", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", color: "var(--accent)" }}>{I.zap}</div>
              <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Ready to go live!</h2>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 32, maxWidth: 400, margin: "0 auto 32px", lineHeight: 1.6 }}>
                Your AI agent for <strong>{name}</strong> is configured with {menuItems.length} menu items and will answer calls with a {voiceStyle} tone.
              </p>

              <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: "24px", textAlign: "left", marginBottom: 28, maxWidth: 420, margin: "0 auto 28px" }}>
                <h4 style={{ fontSize: 13, fontWeight: 600, marginBottom: 14, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Summary</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <SummaryRow label="Restaurant" value={name} />
                  <SummaryRow label="Address" value={address} />
                  <SummaryRow label="Menu Items" value={`${menuItems.length} items`} />
                  <SummaryRow label="Voice Style" value={voiceStyle} />
                  <SummaryRow label="Orders" value={canTakeOrders ? "Enabled" : "Disabled"} />
                  <SummaryRow label="Reservations" value={canBookReservations ? "Enabled" : "Disabled"} />
                  <SummaryRow label="Transfer" value={canTransfer ? "Enabled" : "Disabled"} />
                </div>
              </div>

              <button onClick={handleFinish} disabled={saving} style={{ padding: "14px 40px", fontSize: 15, fontWeight: 600, borderRadius: 10, background: "var(--accent)", color: "#0a0a0b", border: "none", cursor: "pointer", fontFamily: "inherit", opacity: saving ? 0.7 : 1, display: "inline-flex", alignItems: "center", gap: 8 }}>
                {saving ? <span style={{ width: 18, height: 18, border: "2px solid #0a0a0b40", borderTopColor: "#0a0a0b", borderRadius: "50%", display: "inline-block", animation: "spin 0.6s linear infinite" }} /> : "Activate AI Agent"}
              </button>
            </div>
          )}

          {/* Navigation */}
          {step < 4 && (
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 36, paddingTop: 24, borderTop: "1px solid var(--border)" }}>
              <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} style={{ padding: "10px 20px", fontSize: 13, fontWeight: 500, borderRadius: 8, border: "1px solid var(--border)", background: "var(--bg-card)", color: "var(--text-secondary)", cursor: step === 0 ? "default" : "pointer", fontFamily: "inherit", opacity: step === 0 ? 0.3 : 1 }}>
                Back
              </button>
              <button onClick={() => setStep(step + 1)} style={{ padding: "10px 24px", fontSize: 13, fontWeight: 600, borderRadius: 8, background: "var(--accent)", color: "#0a0a0b", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
                {step === 3 ? "Review" : "Next"}
              </button>
            </div>
          )}
        </div>
      </main>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

/* ── Reusable Components ───────────────────────────────────────────────────── */
function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
      <label style={labelStyle}>{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} style={inputStyle} />
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!checked)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, cursor: "pointer", fontFamily: "inherit", width: "100%" }}>
      <span style={{ fontSize: 13, color: "var(--text-primary)" }}>{label}</span>
      <div style={{ width: 40, height: 22, borderRadius: 11, background: checked ? "var(--accent)" : "var(--border)", position: "relative", transition: "background 0.2s" }}>
        <div style={{ width: 16, height: 16, borderRadius: "50%", background: checked ? "#0a0a0b" : "var(--text-dim)", position: "absolute", top: 3, left: checked ? 21 : 3, transition: "left 0.2s" }} />
      </div>
    </button>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
      <span style={{ color: "var(--text-dim)" }}>{label}</span>
      <span style={{ fontWeight: 500, textTransform: "capitalize" }}>{value}</span>
    </div>
  );
}

const labelStyle: React.CSSProperties = { fontSize: 13, fontWeight: 500, color: "var(--text-secondary)" };
const inputStyle: React.CSSProperties = { width: "100%", padding: "10px 14px", fontSize: 14, borderRadius: 8, border: "1px solid var(--border)", background: "var(--bg-input)", color: "var(--text-primary)", outline: "none", fontFamily: "inherit" };
const timeInput: React.CSSProperties = { padding: "6px 10px", fontSize: 12, borderRadius: 6, border: "1px solid var(--border)", background: "var(--bg-input)", color: "var(--text-primary)", outline: "none", fontFamily: "'JetBrains Mono', monospace" };
