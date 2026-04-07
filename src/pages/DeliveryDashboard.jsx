import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DeliveryDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const username = localStorage.getItem('username');
  const token    = localStorage.getItem('access');
  const headers  = token ? { Authorization: `Bearer ${token}` } : {};

  useEffect(() => {
    // Fetch all active orders
    axios.get('http://localhost:8000/api/orders/orders/', { headers })
      .then(res => {
        // In a real app, only those assigned to local hub. Here we just show 'on_the_way' orders.
        setOrders(res.data.filter(o => o.status === 'on_the_way'));
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const updateStatus = (orderId, newStatus) => {
    axios.patch(`http://localhost:8000/api/orders/orders/${orderId}/`, { status: newStatus }, { headers })
      .then(() => {
        setOrders(orders.filter(o => o.id !== orderId)); // remove from dashboard once delivered
      })
      .catch(err => console.error(err));
  };

  return (
    <div className="py-3">
      {/* ── HEADER ── */}
      <div className="rounded-4 p-4 p-md-5 mb-5 text-white position-relative overflow-hidden" 
           style={{ background: 'linear-gradient(135deg, #059669, #10b981)' }}>
        <div style={{ position:'absolute', top:'-40px', right:'-40px', width:'180px', height:'180px',
                      borderRadius:'50%', background:'rgba(255,255,255,0.08)' }} />
        <h1 className="fw-bold mb-2 position-relative" style={{ zIndex: 1 }}>🛵 Delivery Zone</h1>
        <p className="lead opacity-90 mb-0 position-relative" style={{ zIndex: 1 }}>
          Welcome back, <span className="fw-bold">{username}</span>. You have {orders.length} deliveries assigned.
        </p>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">Active Deliveries</h4>
        <span className="badge bg-success rounded-pill px-3 py-2 fw-semibold shadow-sm text-uppercase" style={{ letterSpacing: '0.05em' }}>
          {orders.length} Pending
        </span>
      </div>

      <div className="row g-4">
        {loading ? (
          <div className="col-12 py-5 text-center">
            <div className="spinner-border text-success" style={{ width: '3rem', height: '3rem' }} />
          </div>
        ) : orders.length === 0 ? (
          <div className="col-12 text-center py-5">
            <div className="mb-3" style={{ fontSize: '4rem', opacity: 0.8 }}>😴</div>
            <h4 className="fw-bold text-muted">No pending deliveries.</h4>
            <p className="text-muted">Take a break! Check back later for new assignments.</p>
          </div>
        ) : (
          orders.map(order => (
            <div key={order.id} className="col-md-6 col-lg-4">
              <div className="card border-0 h-100" style={{ borderRadius: '24px', position: 'relative' }}>
                <div className="position-absolute top-0 end-0 p-3">
                   <div className="rounded-circle bg-success shadow-sm" style={{ width: '12px', height: '12px', border: '2px solid white' }}></div>
                </div>
                
                <div className="card-body p-4 p-md-5 d-flex flex-column">
                  <div className="mb-4">
                    <span className="badge bg-light text-success border border-success fw-bold px-3 py-1 mb-2 rounded-pill">To Deliver</span>
                    <h4 className="fw-bold mb-1">Order #{order.id}</h4>
                    <p className="text-muted small mb-0">Prepared by: <span className="fw-bold text-dark">{order.restaurant_name}</span></p>
                  </div>
                  
                  <div className="rounded p-3 mb-4" style={{ background: '#f9f7f5', border: '1px solid #e5e7eb' }}>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted small">Customer:</span>
                      <span className="fw-semibold">User_{order.user}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted small">Time:</span>
                      <span className="fw-semibold text-dark">{new Date(order.created_at).toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' })}</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-muted small">Payment to collect:</span>
                      <span className="fw-bold text-success fs-6">₹{parseFloat(order.total_amount).toFixed(0)}</span>
                    </div>
                  </div>

                  <div className="mt-auto d-flex gap-2">
                     <a href={`tel:000000000`} className="btn btn-light rounded-pill flex-shrink-0" style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid #e5e7eb' }}>📞</a>
                     <button className="btn btn-success flex-grow-1 rounded-pill py-2 fw-bold shadow-sm"
                             style={{ background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none' }}
                             onClick={() => updateStatus(order.id, 'delivered')}>
                       ✅ Mark Delivered
                     </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default DeliveryDashboard;
