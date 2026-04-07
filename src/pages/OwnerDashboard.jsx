import React, { useState, useEffect } from 'react';
import axios from 'axios';

const STATUS_COLORS = {
  pending:    { bg: '#fef3c7', text: '#92400e', label: 'Pending' },
  preparing:  { bg: '#dbeafe', text: '#1e40af', label: 'Preparing' },
  on_the_way: { bg: '#d1fae5', text: '#065f46', label: 'On the Way' },
  delivered:  { bg: '#d1fae5', text: '#065f46', label: 'Delivered' },
  cancelled:  { bg: '#fee2e2', text: '#991b1b', label: 'Cancelled' },
};

function OwnerDashboard() {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const username = localStorage.getItem('username');
  const token    = localStorage.getItem('access');
  const headers  = token ? { Authorization: `Bearer ${token}` } : {};

  useEffect(() => {
    axios.get('http://localhost:8000/api/orders/orders/', { headers })
      .then(res => { setOrders(res.data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, []);

  const updateStatus = (orderId, newStatus) => {
    axios.patch(`http://localhost:8000/api/orders/orders/${orderId}/`, { status: newStatus }, { headers })
      .then(() => setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o)))
      .catch(err => console.error(err));
  };

  const stats = {
    total:     orders.length,
    pending:   orders.filter(o => o.status === 'pending').length,
    preparing: orders.filter(o => o.status === 'preparing').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    revenue:   orders.filter(o => o.status === 'delivered').reduce((s, o) => s + parseFloat(o.total_amount), 0),
  };

  const STAT_ITEMS = [
    { label: 'Total Orders', value: stats.total,             icon: '📊', gradient: 'linear-gradient(135deg,#6366f1,#8b5cf6)' },
    { label: 'Pending',      value: stats.pending,           icon: '⏳',  gradient: 'linear-gradient(135deg,#f59e0b,#ef4444)' },
    { label: 'Preparing',    value: stats.preparing,         icon: '👨‍🍳', gradient: 'linear-gradient(135deg,#3b82f6,#06b6d4)' },
    { label: 'Revenue (₹)',  value: `₹${stats.revenue.toFixed(0)}`, icon: '💰', gradient: 'linear-gradient(135deg,#10b981,#34d399)' },
  ];

  return (
    <div className="py-3">
      {/* Header */}
      <div className="rounded-4 p-4 p-md-5 mb-4 text-white position-relative overflow-hidden"
           style={{ background: 'linear-gradient(135deg,#1a1a2e,#16213e,#0f3460)' }}>
        <div style={{ position:'absolute', top:'-40px', right:'-40px', width:'160px', height:'160px',
                      borderRadius:'50%', background:'rgba(255,255,255,0.04)' }} />
        <h1 className="fw-bold mb-1 fs-3">👨‍🍳 Welcome back, {username}!</h1>
        <p className="mb-0 opacity-75">Here's your restaurant's performance overview.</p>
      </div>

      {/* Stats */}
      <div className="row g-3 mb-4">
        {STAT_ITEMS.map((s, i) => (
          <div key={i} className="col-6 col-md-3">
            <div className="stat-card text-white no-lift"
                 style={{ background: s.gradient, borderRadius: '20px', boxShadow: '0 6px 20px rgba(0,0,0,0.12)' }}>
              <div style={{ fontSize:'1.8rem', marginBottom:'0.25rem' }}>{s.icon}</div>
              <div className="fw-bold fs-4">{loading ? '…' : s.value}</div>
              <div style={{ fontSize:'0.8rem', opacity:0.8 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Orders table */}
      <div className="card no-lift border-0" style={{ borderRadius: '20px' }}>
        <div className="card-header bg-white border-0 px-4 pt-4 pb-0 d-flex align-items-center justify-content-between">
          <h5 className="fw-bold mb-0">📋 Live Orders</h5>
          <span className="badge rounded-pill px-3 py-2" style={{ background:'rgba(232,68,31,0.1)', color:'#e8441f' }}>
            {orders.filter(o => o.status !== 'delivered').length} Active
          </span>
        </div>

        <div className="card-body p-0 mt-3">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border" style={{ color:'#e8441f' }} />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <div style={{ fontSize:'3rem' }}>📭</div>
              <p className="mt-2 fw-semibold">No orders yet.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0 align-middle">
                <thead style={{ background:'#f9f7f5' }}>
                  <tr style={{ fontSize:'0.82rem', color:'#6b7280' }}>
                    <th className="px-4 py-3 fw-semibold">Order</th>
                    <th className="py-3 fw-semibold">Restaurant</th>
                    <th className="py-3 fw-semibold">Amount</th>
                    <th className="py-3 fw-semibold">Status</th>
                    <th className="py-3 fw-semibold">Time</th>
                    <th className="px-4 py-3 text-end fw-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 15).map(order => {
                    const sc = STATUS_COLORS[order.status] || STATUS_COLORS.pending;
                    return (
                      <tr key={order.id} style={{ fontSize:'0.9rem' }}>
                        <td className="px-4 py-3 fw-bold">#{order.id}</td>
                        <td className="py-3">{order.restaurant_name || `Restaurant #${order.restaurant}`}</td>
                        <td className="py-3 fw-bold" style={{ color:'#10b981' }}>₹{parseFloat(order.total_amount).toFixed(0)}</td>
                        <td className="py-3">
                          <span className="badge rounded-pill px-3 py-2 fw-semibold"
                                style={{ background: sc.bg, color: sc.text, fontSize:'0.75rem' }}>
                            {sc.label}
                          </span>
                        </td>
                        <td className="py-3 text-muted small">
                          {new Date(order.created_at).toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' })}
                        </td>
                        <td className="px-4 py-3 text-end">
                          {order.status !== 'delivered' && order.status !== 'cancelled' && (
                            <div className="d-flex gap-1 justify-content-end flex-wrap">
                              {order.status === 'pending' && (
                                <button className="btn btn-sm fw-semibold"
                                        style={{ background:'#dbeafe', color:'#1e40af', borderRadius:'50px', padding:'0.25rem 0.8rem', fontSize:'0.78rem' }}
                                        onClick={() => updateStatus(order.id, 'preparing')}>
                                  👨‍🍳 Prepare
                                </button>
                              )}
                              {order.status === 'preparing' && (
                                <button className="btn btn-sm fw-semibold"
                                        style={{ background:'#d1fae5', color:'#065f46', borderRadius:'50px', padding:'0.25rem 0.8rem', fontSize:'0.78rem' }}
                                        onClick={() => updateStatus(order.id, 'on_the_way')}>
                                  🛵 Dispatch
                                </button>
                              )}
                              {order.status === 'on_the_way' && (
                                <button className="btn btn-sm fw-semibold"
                                        style={{ background:'linear-gradient(135deg,#e8441f,#f7971e)', color:'white', borderRadius:'50px', padding:'0.25rem 0.8rem', fontSize:'0.78rem' }}
                                        onClick={() => updateStatus(order.id, 'delivered')}>
                                  ✅ Delivered
                                </button>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OwnerDashboard;
