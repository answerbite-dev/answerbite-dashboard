'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

// ============================================
// TYPES
// ============================================
interface Restaurant {
  id: string;
  name: string;
  phone_main: string;
  phone_backup?: string;
  bulkvs_did?: string;
  square_token?: string;
  business_hours?: Record<string, string>;
  tier: string;
  status: string;
}

interface Order {
  id: string;
  customer_phone: string;
  customer_name: string;
  items?: string;
  total: number;
  status: 'new' | 'accepted' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  call_duration_seconds?: number;
  created_at: string;
  square_order_id?: string;
}

// ============================================
// CONSTANTS
// ============================================
const NAV = [
  { id: 'overview', icon: '🏠', label: 'Overview' },
  { id: 'orders', icon: '📞', label: 'Calls & Orders' },
  { id: 'menu', icon: '🍽️', label: 'Menu' },
  { id: 'reports', icon: '📊', label: 'Reports' },
  { id: 'earnings', icon: '💰', label: 'Earnings' },
  { id: 'settings', icon: '⚙️', label: 'Settings' },
  { id: 'support', icon: '💬', label: 'Support' },
];

const STATUS_COLORS = {
  new: { bg: '#FEF3C7', text: '#92400E', dot: '#F59E0B', label: 'New' },
  accepted: { bg: '#DBEAFE', text: '#1E40AF', dot: '#3B82F6', label: 'Accepted' },
  preparing: { bg: '#E0E7FF', text: '#3730A3', dot: '#6366F1', label: 'Preparing' },
  ready: { bg: '#D1FAE5', text: '#065F46', dot: '#10B981', label: 'Ready' },
  completed: { bg: '#F3F4F6', text: '#6B7280', dot: '#9CA3AF', label: 'Completed' },
  cancelled: { bg: '#FEE2E2', text: '#991B1B', dot: '#EF4444', label: 'Cancelled' },
};

const NEXT_STATUS = {
  new: 'accepted',
  accepted: 'preparing',
  preparing: 'ready',
  ready: 'completed',
};

// ============================================
// UTILITIES
// ============================================
const fmt = (ts: string) => new Date(ts).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
const fmtDate = (ts: string) => new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
const toNum = (t: string) => parseFloat((t || '0').replace(/[^0-9.]/g, '')) || 0;

const playChime = () => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.setValueAtTime(1100, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  } catch (e) {
    console.log('Audio context not available');
  }
};

// ============================================
// MAIN COMPONENT
// ============================================
export default function Dashboard() {
  const [authLoading, setAuthLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [page, setPage] = useState('overview');
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [confirmCancel, setConfirmCancel] = useState<string | null>(null);
  const [squareLoading, setSquareLoading] = useState<string | null>(null);
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(false);

  // ============================================
  // AUTH & DATA LOADING
  // ============================================
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          window.location.href = '/login';
          return;
        }
        setUserEmail(session.user.email || '');
        await loadRestaurant(session.user.id);
        setAuthLoading(false);
      } catch (err) {
        console.error('Auth error:', err);
        window.location.href = '/login';
      }
    };
    checkAuth();
  }, []);

  const loadRestaurant = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .eq('user_id', userId)
        .single();
      if (error) throw error;
      setRestaurant(data);
      loadOrders(data.id);
    } catch (err) {
      console.error('Restaurant load error:', err);
    }
  };

  const loadOrders = async (restaurantId: string) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error('Orders load error:', err);
    }
  };

  useEffect(() => {
    if (!restaurant) return;
    
    setTime(new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true }));
    const tick = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true }));
    }, 10000);

    const channel = supabase.channel(`orders:${restaurant.id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders', filter: `restaurant_id=eq.${restaurant.id}` }, (p) => {
        setOrders(prev => [p.new as Order, ...prev]);
        playChime();
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders', filter: `restaurant_id=eq.${restaurant.id}` }, (p) => {
        setOrders(prev => prev.map(o => o.id === p.new.id ? p.new as Order : o));
      })
      .subscribe();

    return () => {
      clearInterval(tick);
      supabase.removeChannel(channel);
    };
  }, [restaurant]);

  useEffect(() => {
    const newCount = orders.filter(o => o.status === 'new').length;
    document.title = newCount > 0 ? `(${newCount}) New Orders - AnswerBite` : 'AnswerBite Dashboard';
  }, [orders]);

  // ============================================
  // HANDLERS
  // ============================================
  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);
      if (error) throw error;
      setConfirmCancel(null);
    } catch (err) {
      console.error('Status update error:', err);
      alert('Failed to update order status');
    } finally {
      setLoading(false);
    }
  };

  const deleteCompletedOrders = async () => {
    try {
      setLoading(true);
      const ids = orders.filter(o => ['completed', 'cancelled'].includes(o.status)).map(o => o.id);
      if (!ids.length) return;
      const { error } = await supabase.from('orders').delete().in('id', ids);
      if (error) throw error;
      setOrders(prev => prev.filter(o => !ids.includes(o.id)));
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to clear completed orders');
    } finally {
      setLoading(false);
    }
  };

  const sendToSquare = async (orderId: string) => {
    try {
      setSquareLoading(orderId);
      const res = await fetch('/api/square-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: orderId }),
      });
      const data = await res.json();
      if (data.success) {
        alert('✅ Order sent to Square POS');
      } else {
        alert('❌ Error: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('Square error:', err);
      alert('❌ Failed to send to Square');
    } finally {
      setSquareLoading(null);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      window.location.href = '/login';
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // ============================================
  // COMPUTED VALUES
  // ============================================
  if (authLoading) {
    return (
      <div style={{ background: '#fff', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#1a1a1a', marginBottom: '8px' }}>🟠 AnswerBite</div>
          <div style={{ color: '#999' }}>Loading...</div>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div style={{ background: '#fff', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#1a1a1a', marginBottom: '8px' }}>Restaurant not found</div>
          <button onClick={logout} style={{ padding: '8px 16px', background: '#F97316', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', marginTop: '16px' }}>
            Logout
          </button>
        </div>
      </div>
    );
  }

  const revenue = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + toNum(o.total.toString()), 0);
  const counts = {
    new: orders.filter(o => o.status === 'new').length,
    accepted: orders.filter(o => o.status === 'accepted').length,
    preparing: orders.filter(o => o.status === 'preparing').length,
    ready: orders.filter(o => o.status === 'ready').length,
    completed: orders.filter(o => o.status === 'completed').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
  };

  const filtered = orders.filter(o => {
    const matchFilter = filter === 'all' || o.status === filter;
    const matchSearch = !search || o.customer_name?.toLowerCase().includes(search.toLowerCase()) || o.customer_phone?.includes(search);
    return matchFilter && matchSearch;
  });

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // ============================================
  // RENDER
  // ============================================
  return (
    <div style={{ display: 'flex', height: '100vh', background: '#F8F8F6', fontFamily: "'DM Sans', system-ui, -apple-system, sans-serif", overflow: 'hidden' }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* SIDEBAR */}
      <div style={{ width: '240px', background: '#FFFFFF', borderRight: '1px solid #E8E8E4', display: 'flex', flexDirection: 'column' as const, flexShrink: 0 }}>
        <div style={{ padding: '24px 20px', borderBottom: '1px solid #E8E8E4' }}>
          <div style={{ fontSize: '20px', fontWeight: 700, color: '#1a1a1a', letterSpacing: '-0.3px' }}>
            🟠 Answer<span style={{ color: '#F97316' }}>Bite</span>
          </div>
        </div>

        <div style={{ padding: '12px 10px', flex: 1 }}>
          {NAV.map(item => (
            <div key={item.id} onClick={() => setPage(item.id)} style={{
              display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px',
              borderRadius: '10px', margin: '2px 0', cursor: 'pointer',
              background: page === item.id ? '#F5F0EB' : 'transparent',
              color: page === item.id ? '#1a1a1a' : '#777',
              fontSize: '14px', fontWeight: page === item.id ? 600 : 400,
              transition: 'all 0.15s'
            }}>
              <span style={{ fontSize: '16px' }}>{item.icon}</span>
              <span>{item.label}</span>
              {item.id === 'orders' && counts.new > 0 && (
                <span style={{ marginLeft: 'auto', background: '#EF4444', color: '#fff', fontSize: '11px', fontWeight: 700, padding: '1px 7px', borderRadius: '10px' }}>
                  {counts.new}
                </span>
              )}
            </div>
          ))}
        </div>

        <div style={{ margin: '0 14px 12px', padding: '12px 14px', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '8px', height: '8px', background: '#22C55E', borderRadius: '50%', animation: 'pulse 2s infinite' }}></div>
            <span style={{ fontSize: '13px', color: '#15803D', fontWeight: 600 }}>Active - Sofia Running</span>
          </div>
        </div>

        <div style={{ padding: '14px 14px', borderTop: '1px solid #E8E8E4', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', background: '#F97316', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '13px', fontWeight: 700 }}>
            {userEmail.charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '12px', color: '#555', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{userEmail}</div>
          </div>
          <button onClick={logout} title="Logout" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: '#999', padding: '4px' }}>🚪</button>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' as const, overflow: 'hidden' }}>
        {/* TOP BAR */}
        <div style={{ padding: '16px 28px', background: '#FFFFFF', borderBottom: '1px solid #E8E8E4', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 600, color: '#1a1a1a' }}>
              {page === 'overview' && `${greeting()}`}
              {page === 'orders' && '📞 Calls & Orders'}
              {page === 'menu' && '🍽️ Menu'}
              {page === 'reports' && '📊 Reports'}
              {page === 'earnings' && '💰 Earnings'}
              {page === 'settings' && '⚙️ Settings'}
              {page === 'support' && '💬 Support'}
            </div>
            <div style={{ fontSize: '13px', color: '#999', marginTop: '2px' }}>
              {page === 'overview' ? `It's ${new Date().toLocaleDateString('en-US', { weekday: 'long' })} ${time}` :
               new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </div>
          </div>
          <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '20px', padding: '6px 14px', fontSize: '13px', color: '#15803D', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22C55E', display: 'inline-block' }}></span>
            {restaurant.name}
          </div>
        </div>

        {/* CONTENT */}
        <div style={{ flex: 1, overflow: 'auto' as const, padding: '24px 28px' }}>

          {/* OVERVIEW PAGE */}
          {page === 'overview' && (
            <div>
              <div style={{ fontSize: '22px', fontWeight: 700, color: '#1a1a1a', marginBottom: '24px' }}>
                You've made <span style={{ color: '#F97316' }}>${revenue.toFixed(2)}</span> this month
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '28px' }}>
                {[
                  { label: 'Staff Hours Reclaimed', val: `${Math.max(1, Math.round(orders.length * 0.05))} hours`, sub: 'This month', icon: '⏱️', color: '#F97316' },
                  { label: 'Extra Calls Captured', val: `${orders.length}`, sub: 'This month', icon: '📞', color: '#3B82F6' },
                  { label: 'Total Revenue', val: `$${revenue.toFixed(2)}`, sub: 'This month', icon: '💰', color: '#22C55E' },
                ].map((s, i) => (
                  <div key={i} style={{ background: '#fff', border: '1px solid #E8E8E4', borderRadius: '14px', padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                      <div style={{ fontSize: '13px', color: '#777' }}>{s.label}</div>
                      <div style={{ width: '36px', height: '36px', background: `${s.color}15`, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>{s.icon}</div>
                    </div>
                    <div style={{ fontSize: '28px', fontWeight: 700, color: '#1a1a1a' }}>{s.val}</div>
                    <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>{s.sub}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px' }}>
                <div style={{ background: '#fff', border: '1px solid #E8E8E4', borderRadius: '14px', padding: '20px' }}>
                  <div style={{ fontSize: '15px', fontWeight: 600, color: '#1a1a1a', marginBottom: '16px' }}>Calls This Month</div>
                  <div style={{ height: '180px', display: 'flex', alignItems: 'end', gap: '6px' }}>
                    {[12, 18, 8, 24, 15, 30, 22, 28, 35, 20, 25, 32, 28, 38].map((v, i) => (
                      <div key={i} style={{ flex: 1 }}>
                        <div style={{ width: '100%', height: `${(v / 40) * 160}px`, background: i === 13 ? '#F97316' : '#F5F0EB', borderRadius: '4px' }}></div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ background: '#fff', border: '1px solid #E8E8E4', borderRadius: '14px', padding: '20px' }}>
                  <div style={{ fontSize: '15px', fontWeight: 600, color: '#1a1a1a', marginBottom: '16px' }}>Recent Activity</div>
                  {orders.slice(0, 5).map((order, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 0', borderBottom: i < 4 ? '1px solid #F3F4F6' : 'none' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: STATUS_COLORS[order.status]?.dot || '#ccc' }}></div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '13px', fontWeight: 500, color: '#1a1a1a' }}>{order.customer_name || 'Unknown'}</div>
                        <div style={{ fontSize: '11px', color: '#999' }}>{order.customer_phone}</div>
                      </div>
                      <div style={{ textAlign: 'right' as const }}>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#1a1a1a' }}>${order.total.toFixed(2)}</div>
                        <div style={{ fontSize: '11px', color: '#999' }}>{fmt(order.created_at)}</div>
                      </div>
                    </div>
                  ))}
                  {orders.length === 0 && <div style={{ textAlign: 'center', padding: '20px', color: '#999', fontSize: '13px' }}>No recent activity</div>}
                  {orders.length > 0 && <div onClick={() => setPage('orders')} style={{ marginTop: '12px', fontSize: '13px', color: '#F97316', cursor: 'pointer', fontWeight: 500 }}>View All Calls →</div>}
                </div>
              </div>
            </div>
          )}

          {/* ORDERS PAGE */}
          {page === 'orders' && (
            <div>
              <div style={{ background: '#fff', border: '1px solid #E8E8E4', borderRadius: '12px', padding: '10px 16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: '#999' }}>🔍</span>
                <input
                  placeholder="Search by phone number, caller name..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{ flex: 1, border: 'none', outline: 'none', fontSize: '14px', color: '#1a1a1a', background: 'transparent' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' as const }}>
                {[
                  { key: 'all', label: 'All' },
                  { key: 'new', label: 'New' },
                  { key: 'accepted', label: 'Accepted' },
                  { key: 'preparing', label: 'Preparing' },
                  { key: 'ready', label: 'Ready' },
                  { key: 'completed', label: 'Completed' },
                ].map(f => (
                  <button key={f.key} onClick={() => setFilter(f.key)} style={{ padding: '6px 16px', borderRadius: '20px', fontSize: '13px', cursor: 'pointer', border: filter === f.key ? '1.5px solid #1a1a1a' : '1px solid #E0E0E0', background: filter === f.key ? '#1a1a1a' : '#fff', color: filter === f.key ? '#fff' : '#555', fontWeight: filter === f.key ? 600 : 400 }}>
                    {f.label}
                  </button>
                ))}
                <button onClick={deleteCompletedOrders} disabled={loading} style={{ marginLeft: 'auto', padding: '6px 16px', borderRadius: '20px', border: '1px solid #E0E0E0', background: '#fff', color: '#999', fontSize: '13px', cursor: 'pointer', opacity: loading ? 0.5 : 1 }}>
                  Clear Done
                </button>
              </div>

              <div style={{ background: '#fff', border: '1px solid #E8E8E4', borderRadius: '14px', overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr 1fr 80px 80px 80px 100px 140px', padding: '12px 20px', borderBottom: '1px solid #E8E8E4', fontSize: '11px', fontWeight: 600, color: '#999', textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>
                  <div></div><div>PHONE</div><div>NAME</div><div>ITEMS</div><div>TOTAL</div><div>TYPE</div><div>TIME</div><div>ACTIONS</div>
                </div>

                {filtered.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '48px', color: '#999' }}>
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>📞</div>
                    <div style={{ fontSize: '14px' }}>No orders yet. Calls will appear here.</div>
                  </div>
                ) : filtered.map(order => (
                  <div key={order.id} style={{ display: 'grid', gridTemplateColumns: '40px 1fr 1fr 80px 80px 80px 100px 140px', padding: '14px 20px', borderBottom: '1px solid #F3F4F6', alignItems: 'center', background: order.status === 'new' ? '#FFFBEB' : '#fff' }}>
                    <div><div style={{ width: '10px', height: '10px', borderRadius: '50%', background: STATUS_COLORS[order.status]?.dot || '#ccc' }}></div></div>
                    <div><a href={`tel:${order.customer_phone}`} style={{ fontSize: '13px', color: '#1a1a1a', textDecoration: 'none', fontWeight: 500 }}>{order.customer_phone}</a></div>
                    <div style={{ fontSize: '13px', color: '#1a1a1a', fontWeight: 500 }}>{order.customer_name || 'Unknown'}</div>
                    <div style={{ fontSize: '12px', color: '#777' }}>{order.items?.split(',').length || 1}</div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#1a1a1a' }}>${order.total.toFixed(2)}</div>
                    <div style={{ fontSize: '12px', color: '#777' }}>Pickup</div>
                    <div style={{ fontSize: '12px', color: '#777' }}>{fmt(order.created_at)}</div>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      {NEXT_STATUS[order.status as keyof typeof NEXT_STATUS] && (
                        <button onClick={() => updateOrderStatus(order.id, NEXT_STATUS[order.status as keyof typeof NEXT_STATUS])} disabled={loading} style={{ padding: '5px 12px', borderRadius: '6px', border: 'none', fontSize: '11px', fontWeight: 600, cursor: 'pointer', background: STATUS_COLORS[NEXT_STATUS[order.status as keyof typeof NEXT_STATUS] as keyof typeof STATUS_COLORS]?.bg, color: STATUS_COLORS[NEXT_STATUS[order.status as keyof typeof NEXT_STATUS] as keyof typeof STATUS_COLORS]?.text, opacity: loading ? 0.5 : 1 }}>
                          {STATUS_COLORS[NEXT_STATUS[order.status as keyof typeof NEXT_STATUS] as keyof typeof STATUS_COLORS]?.label}
                        </button>
                      )}
                      {!order.square_order_id ? (
                        <button onClick={() => sendToSquare(order.id)} disabled={squareLoading === order.id} style={{ padding: '5px 10px', borderRadius: '6px', border: '1px solid #DBEAFE', background: '#EFF6FF', color: '#2563EB', fontSize: '11px', fontWeight: 600, cursor: 'pointer', opacity: squareLoading === order.id ? 0.5 : 1 }}>
                          POS
                        </button>
                      ) : <span style={{ fontSize: '11px', color: '#22C55E', fontWeight: 600 }}>✓</span>}
                      {!['completed', 'cancelled'].includes(order.status) && (
                        confirmCancel === order.id ? (
                          <div style={{ display: 'flex', gap: '4px' }}>
                            <button onClick={() => updateOrderStatus(order.id, 'cancelled')} disabled={loading} style={{ padding: '5px 8px', borderRadius: '6px', border: 'none', background: '#FEE2E2', color: '#DC2626', fontSize: '10px', fontWeight: 600, cursor: 'pointer' }}>
                              Yes
                            </button>
                            <button onClick={() => setConfirmCancel(null)} style={{ padding: '5px 8px', borderRadius: '6px', border: '1px solid #E0E0E0', background: '#fff', color: '#777', fontSize: '10px', cursor: 'pointer' }}>
                              No
                            </button>
                          </div>
                        ) : <button onClick={() => setConfirmCancel(order.id)} style={{ padding: '5px 8px', borderRadius: '6px', border: 'none', background: 'transparent', color: '#DC2626', fontSize: '13px', cursor: 'pointer' }}>✕</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MENU PAGE */}
          {page === 'menu' && (
            <div>
              <div style={{ background: '#fff', border: '1px solid #E8E8E4', borderRadius: '12px', padding: '10px 16px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                  <span style={{ color: '#999' }}>🔍</span>
                  <input placeholder="Search items..." style={{ flex: 1, border: 'none', outline: 'none', fontSize: '14px', color: '#1a1a1a', background: 'transparent' }} />
                </div>
                <div style={{ fontSize: '12px', color: '#999' }}>Manage your menu items and pricing</div>
              </div>
              <div style={{ background: '#fff', border: '1px solid #E8E8E4', borderRadius: '14px', padding: '24px', textAlign: 'center' }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>🍽️</div>
                <div style={{ fontSize: '16px', fontWeight: 600, color: '#1a1a1a', marginBottom: '4px' }}>Menu Management</div>
                <div style={{ fontSize: '13px', color: '#777' }}>Menu syncs automatically from your Square catalog</div>
              </div>
            </div>
          )}

          {/* REPORTS PAGE */}
          {page === 'reports' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: '#1a1a1a' }}>Call Analytics</div>
                  <div style={{ fontSize: '13px', color: '#999' }}>Your call volume and metrics</div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: '14px', padding: '20px' }}>
                  <div style={{ fontSize: '13px', color: '#9A3412', fontWeight: 500, marginBottom: '12px' }}>📞 Total Calls</div>
                  <div style={{ fontSize: '36px', fontWeight: 700, color: '#1a1a1a' }}>{orders.length}</div>
                  <div style={{ fontSize: '12px', color: '#999' }}>All time</div>
                </div>
                <div style={{ background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: '14px', padding: '20px' }}>
                  <div style={{ fontSize: '13px', color: '#9A3412', fontWeight: 500, marginBottom: '12px' }}>✅ Completed</div>
                  <div style={{ fontSize: '36px', fontWeight: 700, color: '#1a1a1a' }}>{counts.completed}</div>
                  <div style={{ fontSize: '12px', color: '#999' }}>Orders completed</div>
                </div>
              </div>
            </div>
          )}

          {/* EARNINGS PAGE */}
          {page === 'earnings' && (
            <div>
              <div style={{ background: '#fff', border: '1px solid #E8E8E4', borderRadius: '14px', padding: '28px', marginBottom: '20px' }}>
                <div style={{ fontSize: '13px', color: '#999', marginBottom: '8px' }}>Total Earnings</div>
                <div style={{ fontSize: '42px', fontWeight: 700, color: '#1a1a1a' }}>${revenue.toFixed(2)}</div>
                <div style={{ fontSize: '13px', color: '#22C55E', marginTop: '4px' }}>This month</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                <div style={{ background: '#fff', border: '1px solid #E8E8E4', borderRadius: '14px', padding: '20px' }}>
                  <div style={{ fontSize: '13px', color: '#999' }}>Orders Completed</div>
                  <div style={{ fontSize: '28px', fontWeight: 700, color: '#1a1a1a', marginTop: '8px' }}>{counts.completed}</div>
                </div>
                <div style={{ background: '#fff', border: '1px solid #E8E8E4', borderRadius: '14px', padding: '20px' }}>
                  <div style={{ fontSize: '13px', color: '#999' }}>Average Order</div>
                  <div style={{ fontSize: '28px', fontWeight: 700, color: '#1a1a1a', marginTop: '8px' }}>
                    ${orders.length > 0 ? (revenue / Math.max(1, counts.completed)).toFixed(2) : '0.00'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SETTINGS PAGE */}
          {page === 'settings' && (
            <div>
              <div style={{ background: '#fff', border: '1px solid #E8E8E4', borderRadius: '14px', padding: '24px', marginBottom: '20px' }}>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#1a1a1a', marginBottom: '20px' }}>Restaurant Information</div>
                {[
                  { label: 'Restaurant Name', value: restaurant.name },
                  { label: 'Phone Number', value: restaurant.phone_main },
                  { label: 'BulkVS DID', value: restaurant.bulkvs_did || 'Not configured' },
                  { label: 'Tier', value: restaurant.tier },
                  { label: 'Status', value: restaurant.status },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: i < 4 ? '1px solid #F3F4F6' : 'none' }}>
                    <div style={{ fontSize: '13px', fontWeight: 500, color: '#1a1a1a' }}>{item.label}</div>
                    <div style={{ fontSize: '13px', color: '#777' }}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SUPPORT PAGE */}
          {page === 'support' && (
            <div style={{ maxWidth: '600px' }}>
              <div style={{ background: '#fff', border: '1px solid #E8E8E4', borderRadius: '14px', padding: '28px' }}>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#1a1a1a', marginBottom: '4px' }}>Need Help?</div>
                <div style={{ fontSize: '13px', color: '#777', marginBottom: '20px' }}>Contact our support team</div>
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', background: '#F8F8F6', borderRadius: '10px' }}>
                    <span style={{ fontSize: '20px' }}>📧</span>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#1a1a1a' }}>Email Support</div>
                      <div style={{ fontSize: '12px', color: '#777' }}>admin@answerbite.online</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', background: '#F8F8F6', borderRadius: '10px' }}>
                    <span style={{ fontSize: '20px' }}>📞</span>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#1a1a1a' }}>Phone Support</div>
                      <div style={{ fontSize: '12px', color: '#777' }}>313-398-9898</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #D1D5DB; border-radius: 3px; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input::placeholder { color: #999; }
        body { margin: 0; }
        button:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>
    </div>
  );
}
