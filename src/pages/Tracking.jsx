import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const STEPS = [
  { key: 'pending',     label: 'Order Placed', icon: '📋', desc: 'Your order has been received.' },
  { key: 'preparing',  label: 'Preparing',     icon: '👨‍🍳', desc: 'The restaurant is cooking your food.' },
  { key: 'on_the_way', label: 'On the Way',    icon: '🛵', desc: 'Your order is out for delivery.' },
  { key: 'delivered',  label: 'Delivered',     icon: '✅', desc: 'Enjoy your meal!' },
];

const stepIndex = (status) => STEPS.findIndex(s => s.key === status);

function Tracking() {
  const { orderId } = useParams();
  const [order,    setOrder]    = useState(null);
  const [delivery, setDelivery] = useState(null);
  const [prevStep, setPrevStep] = useState(null);
  const [flash,    setFlash]    = useState(false);

  const fetchData = async () => {
    try {
      const [orderRes, deliveryRes] = await Promise.all([
        axios.get(`http://localhost:8000/api/orders/orders/${orderId}/`),
        axios.get('http://localhost:8000/api/tracking/deliveries/'),
      ]);
      setOrder(prev => {
        if (prev && prev.status !== orderRes.data.status) {
          setFlash(true);
          setTimeout(() => setFlash(false), 1000);
        }
        return orderRes.data;
      });
      const del = deliveryRes.data.find(d => d.order === parseInt(orderId));
      if (del) setDelivery(del);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [orderId]);

  if (!order) return (
    <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '70vh' }}>
      <div className="spinner-border" style={{ color: '#e8441f', width: '3rem', height: '3rem' }} role="status" />
      <p className="text-muted mt-3 fw-semibold">Loading your order...</p>
    </div>
  );

  const currentStep = stepIndex(order.status);
  const progressPct = currentStep === 0 ? 5 : currentStep === 1 ? 36 : currentStep === 2 ? 68 : 100;

  const statusColors = {
    pending:    { bg: '#fef3c7', text: '#92400e' },
    preparing:  { bg: '#dbeafe', text: '#1e40af' },
    on_the_way: { bg: '#d1fae5', text: '#065f46' },
    delivered:  { bg: '#d1fae5', text: '#065f46' },
    cancelled:  { bg: '#fee2e2', text: '#991b1b' },
  };
  const scol = statusColors[order.status] || statusColors.pending;

  return (
    <div>
      {/* ── HEADER ── */}
      <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold mb-1">Track Your Order 🚚</h2>
          <p className="text-muted mb-0 small">
            Order <span className="fw-bold text-dark">#{order.id}</span>
            {order.restaurant_name && <> from <span className="fw-semibold">{order.restaurant_name}</span></>}
          </p>
        </div>
        <span className="badge fs-6 rounded-pill px-3 py-2 fw-bold"
              style={{ background: scol.bg, color: scol.text, border: 'none' }}>
          {order.status.replace('_', ' ').toUpperCase()}
        </span>
      </div>

      <div className="row g-4">
        {/* ── LEFT COLUMN ── */}
        <div className="col-lg-8">

          {/* Timeline Card */}
          <div className={`card no-lift border-0 mb-4 ${flash ? 'animate-pulse' : ''}`}
               style={{ borderRadius: '24px' }}>
            <div className="card-body p-4 p-md-5">
              <h6 className="fw-bold mb-4 text-muted text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.1em' }}>
                Delivery Status
              </h6>

              {/* Progress bar */}
              <div className="progress mb-5" style={{ height: '6px', backgroundColor: '#f0f0f0', borderRadius: '10px' }}>
                <div className="progress-bar progress-bar-animated"
                     role="progressbar"
                     style={{ width: `${progressPct}%`, background: 'linear-gradient(90deg,#e8441f,#f7971e)', borderRadius: '10px', transition: 'width 0.8s ease' }} />
              </div>

              {/* Steps */}
              <div className="d-flex justify-content-between position-relative">
                {/* Connector line */}
                <div style={{ position: 'absolute', top: '22px', left: '5%', right: '5%', height: '2px',
                              background: '#f0f0f0', zIndex: 0 }} />

                {STEPS.map((step, i) => {
                  const done    = i <= currentStep;
                  const current = i === currentStep;
                  return (
                    <div key={step.key} className={`timeline-step ${current ? 'active' : ''}`}
                         style={{ textAlign: 'center', width: '80px', zIndex: 1, position: 'relative' }}>
                      <div className="mx-auto d-flex align-items-center justify-content-center rounded-circle mb-2"
                           style={{
                             width: '46px', height: '46px', fontSize: '1.2rem',
                             background: done ? 'linear-gradient(135deg,#e8441f,#f7971e)' : '#f0f0f0',
                             boxShadow: current ? '0 0 0 4px rgba(232,68,31,0.18)' : 'none',
                             border: done ? 'none' : '2px solid #e5e7eb',
                             transition: 'all 0.4s ease',
                           }}>
                        {step.icon}
                      </div>
                      <p className="mb-0 fw-bold" style={{ fontSize: '0.68rem', color: done ? '#1a1a1a' : '#9ca3af' }}>
                        {step.label}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Current step description */}
              <div className="text-center mt-4 p-3 rounded-3"
                   style={{ background: 'rgba(232,68,31,0.05)' }}>
                <p className="mb-0 fw-semibold" style={{ color: '#e8441f' }}>
                  {STEPS[currentStep]?.desc}
                </p>
              </div>

              {/* Live Map */}
              {(order.status === 'on_the_way' || order.status === 'delivered') && (
                <div className="mt-4">
                  <h6 className="fw-bold mb-2 small text-muted text-uppercase" style={{ letterSpacing: '0.08em' }}>
                    🛰️ Live Location
                  </h6>
                  <div className="rounded-4 position-relative overflow-hidden"
                       style={{ height: '200px', background: 'linear-gradient(135deg,#e8f5e9,#e3f2fd)',
                                border: '1px solid rgba(0,0,0,0.07)' }}>
                    {/* Grid background */}
                    <div style={{ position:'absolute', inset:0,
                                  backgroundImage:'linear-gradient(rgba(0,0,0,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,0.04) 1px,transparent 1px)',
                                  backgroundSize:'30px 30px' }} />
                    {/* Road line */}
                    <div style={{ position:'absolute', top:'50%', left:'5%', right:'5%', height:'4px',
                                  background:'rgba(0,0,0,0.1)', borderRadius:'2px',
                                  transform:'translateY(-50%)' }} />
                    {/* Live badge */}
                    <div className="position-absolute badge bg-white text-dark shadow-sm border px-3 py-2 rounded-pill"
                         style={{ top:'12px', left:'12px', fontSize:'0.75rem' }}>
                      <span style={{ display:'inline-block', width:'8px', height:'8px', borderRadius:'50%',
                                     background:'#10b981', marginRight:'6px',
                                     boxShadow:'0 0 0 3px rgba(16,185,129,0.25)',
                                     animation:'pulse 1.5s infinite' }} />
                      Live Tracking
                    </div>
                    {/* Scooter */}
                    <div className={order.status === 'delivered' ? 'position-absolute' : 'animate-deliver'}
                         style={{ fontSize:'2.2rem', top:'50%', transform:'translateY(-50%)',
                                  ...(order.status === 'delivered' && { left:'82%', top:'50%' }) }}>
                      🛵
                    </div>
                    {/* Destination */}
                    <div className="position-absolute" style={{ right:'20px', top:'50%', transform:'translateY(-50%)', fontSize:'2rem' }}>
                      🏠
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Items Card */}
          {order.items && order.items.length > 0 && (
            <div className="card no-lift border-0 mb-4" style={{ borderRadius: '20px' }}>
              <div className="card-body p-4">
                <h6 className="fw-bold mb-3">🍽️ Items Ordered</h6>
                <ul className="list-unstyled mb-0">
                  {order.items.map((item, i) => (
                    <li key={item.id}
                        className="d-flex align-items-center gap-3 py-2"
                        style={{ borderBottom: i < order.items.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none' }}>
                      {item.menu_item_image && (
                        <img src={item.menu_item_image} alt={item.menu_item_name}
                             style={{ width:'46px', height:'46px', objectFit:'cover', borderRadius:'10px' }}
                             onError={e => { e.target.onerror=null; e.target.style.display='none'; }} />
                      )}
                      <span className="flex-grow-1 fw-semibold small">{item.menu_item_name}</span>
                      <span className="text-muted small">×{item.quantity}</span>
                      <span className="fw-bold small">₹{parseFloat(item.price * item.quantity).toFixed(0)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="col-lg-4 d-print-none">

          {/* Delivery partner */}
          <div className="card no-lift border-0 mb-4" style={{ borderRadius: '20px' }}>
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3">🛵 Delivery Partner</h6>
              {delivery ? (
                <div className="d-flex align-items-center gap-3">
                  <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white flex-shrink-0"
                       style={{ width:'48px', height:'48px', fontSize:'1.4rem',
                                background:'linear-gradient(135deg,#10b981,#34d399)' }}>
                    👤
                  </div>
                  <div>
                    <p className="mb-0 fw-bold">{delivery.driver_name || 'Rahul Kumar'}</p>
                    <div className="text-muted small">⭐ 4.8 Rating</div>
                    <div className="text-muted small">📞 {delivery.driver_phone || '+91 98765-43210'}</div>
                  </div>
                </div>
              ) : (
                <div className="text-muted small animate-pulse">⏳ Assigning delivery partner...</div>
              )}
            </div>
          </div>

          {/* Order summary */}
          <div className="card no-lift border-0 mb-4" style={{ borderRadius: '20px' }}>
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3">📦 Order Summary</h6>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted small">Items Total</span>
                <span className="fw-semibold">₹{parseFloat(order.total_amount).toFixed(0)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted small">Delivery</span>
                <span className="text-success fw-bold small">FREE</span>
              </div>
              <hr style={{ borderColor:'rgba(0,0,0,0.07)' }} />
              <div className="d-flex justify-content-between">
                <span className="fw-bold">Grand Total</span>
                <span className="fw-bold fs-5 text-gradient">₹{parseFloat(order.total_amount).toFixed(0)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="d-flex flex-column gap-2">
            <Link to="/" className="btn btn-light border fw-semibold">
              🏠 Back to Home
            </Link>
            <button onClick={() => window.print()}
                    className="btn btn-dark fw-semibold">
              🖨️ Print Invoice
            </button>
          </div>
        </div>
      </div>

      {/* ── PRINT-ONLY INVOICE ── */}
      <div className="d-none d-print-block mt-4">
        <div className="invoice-header">
          <div>
            <div className="invoice-brand">😋 QuickDine</div>
            <div style={{ fontSize:'0.85rem', color:'#6b7280' }}>Your favourite food, delivered fast.</div>
          </div>
          <div style={{ textAlign:'right', fontSize:'0.85rem' }}>
            <strong>Invoice</strong><br/>
            Order #{order.id}<br/>
            {new Date(order.created_at).toLocaleDateString('en-IN', { dateStyle:'long' })}
          </div>
        </div>

        {order.items && (
          <table className="table invoice-table">
            <thead>
              <tr>
                <th>Item</th>
                <th className="text-center">Qty</th>
                <th className="text-end">Unit Price</th>
                <th className="text-end">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map(item => (
                <tr key={item.id}>
                  <td>{item.menu_item_name}</td>
                  <td className="text-center">{item.quantity}</td>
                  <td className="text-end">₹{parseFloat(item.price).toFixed(0)}</td>
                  <td className="text-end">₹{(item.price * item.quantity).toFixed(0)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3" className="text-end fw-bold">Delivery</td>
                <td className="text-end fw-bold text-success">FREE</td>
              </tr>
              <tr>
                <td colSpan="3" className="text-end fw-bold">Grand Total</td>
                <td className="text-end fw-bold" style={{ color:'#e8441f' }}>₹{parseFloat(order.total_amount).toFixed(0)}</td>
              </tr>
            </tfoot>
          </table>
        )}
        <div className="invoice-footer">
          Thank you for ordering with QuickDine! 😋<br/>
          For support: support@quickdine.in | +91 1800 XXX XXXX
        </div>
      </div>
    </div>
  );
}

export default Tracking;
