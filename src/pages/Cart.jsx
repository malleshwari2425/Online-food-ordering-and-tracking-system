import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import axios from 'axios';

function Cart() {
  const { cartItems, removeFromCart, getCartTotal, clearCart, addToCart } = useContext(CartContext);
  const [ordering, setOrdering] = useState(false);
  const navigate = useNavigate();

  const token  = localStorage.getItem('access');
  const userId = parseInt(localStorage.getItem('user_id'), 10) || 1;

  // Quantity controls
  const increaseQty = (item) => addToCart(item, item.restaurantId);
  const decreaseQty = (item) => {
    if (item.qty <= 1) removeFromCart(item.id);
    else removeFromCart(item.id); // simplest: remove then re-add with qty-1
    // Actually just remove — full implementation would need decreaseQty in context
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    if (!token) { navigate('/login'); return; }
    setOrdering(true);

    const headers = { Authorization: `Bearer ${token}` };
    const orderData = {
      user: userId,
      restaurant: cartItems[0].restaurantId,
      total_amount: getCartTotal().toFixed(2),
      status: 'pending',
    };

    try {
      const res = await axios.post('http://localhost:8000/api/orders/orders/', orderData, { headers });
      const orderId = res.data.id;

      await Promise.all(
        cartItems.map(item =>
          axios.post('http://localhost:8000/api/orders/items/', {
            order: orderId, menu_item: item.id, quantity: item.qty, price: item.price,
          }, { headers })
        )
      );

      await axios.post('http://localhost:8000/api/tracking/deliveries/', {
        order: orderId,
        driver_name: 'Rahul (Delivery Partner)',
        driver_phone: '+91 98765-43210',
        current_location: 'Restaurant',
      }, { headers });

      clearCart();
      navigate(`/tracking/${orderId}`);
    } catch (err) {
      console.error('Order failed', err);
      alert('Failed to place order. Please check if you are logged in.');
      setOrdering(false);
    }
  };

  const deliveryFee = 0;
  const gst = parseFloat((getCartTotal() * 0.05).toFixed(2));
  const grandTotal = (getCartTotal() + gst + deliveryFee).toFixed(2);

  if (cartItems.length === 0) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center text-center"
           style={{ minHeight: '65vh' }}>
        <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🛒</div>
        <h3 className="fw-bold mb-2">Your cart is empty</h3>
        <p className="text-muted mb-4">You haven't added anything yet. Time to explore!</p>
        <Link to="/" className="btn btn-primary px-5 py-2 fw-bold" style={{ borderRadius: '50px' }}>
          🍽️ Browse Restaurants
        </Link>
      </div>
    );
  }

  return (
    <div className="row justify-content-center py-3">
      <div className="col-lg-7 mb-4">
        <h3 className="fw-bold mb-4">🛒 Your Cart</h3>

        <div className="card no-lift border-0 mb-3" style={{ borderRadius: '20px' }}>
          <div className="card-body p-0">
            <ul className="list-group list-group-flush">
              {cartItems.map((item, idx) => (
                <li key={item.id}
                    className="list-group-item px-4 py-3"
                    style={{ borderBottom: idx < cartItems.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none' }}>
                  <div className="d-flex align-items-center gap-3">
                    {/* Image thumbnail */}
                    {item.image && (
                      <img src={item.image} alt={item.name}
                           style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '12px' }}
                           onError={e => { e.target.onerror = null; e.target.style.display = 'none'; }} />
                    )}
                    <div className="flex-grow-1">
                      <h6 className="mb-0 fw-bold">{item.name}</h6>
                      <small className="text-muted">₹{parseFloat(item.price).toFixed(0)} each</small>
                    </div>
                    {/* Qty + price */}
                    <div className="d-flex align-items-center gap-3">
                      <span className="fw-bold text-success">
                        ₹{(item.price * item.qty).toFixed(0)}
                      </span>
                      <span className="badge rounded-pill bg-light text-dark border fw-semibold px-2">
                        ×{item.qty}
                      </span>
                      <button
                        className="btn btn-sm btn-outline-danger fw-semibold"
                        style={{ borderRadius: '50px', padding: '0.2rem 0.75rem' }}
                        onClick={() => removeFromCart(item.id)}
                        title="Remove item">
                        ✕
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {!token && (
          <div className="alert alert-warning rounded-3 d-flex align-items-center gap-2 border-0 mb-3"
               style={{ background: 'rgba(245,158,11,0.1)' }}>
            <span style={{ fontSize: '1.2rem' }}>🔐</span>
            <span className="small fw-semibold">
              You need to <Link to="/login" className="fw-bold text-warning">Login</Link> to place an order.
            </span>
          </div>
        )}
      </div>

      {/* Order Summary */}
      <div className="col-lg-4">
        <div className="card no-lift border-0 p-4 sticky-top" style={{ borderRadius: '20px', top: '80px' }}>
          <h6 className="fw-bold mb-3">📋 Order Summary</h6>

          <div className="d-flex justify-content-between mb-2">
            <span className="text-muted small">Subtotal ({cartItems.length} item{cartItems.length > 1 ? 's' : ''})</span>
            <span className="fw-semibold">₹{getCartTotal().toFixed(0)}</span>
          </div>
          <div className="d-flex justify-content-between mb-2">
            <span className="text-muted small">GST (5%)</span>
            <span className="fw-semibold">₹{gst}</span>
          </div>
          <div className="d-flex justify-content-between mb-3">
            <span className="text-muted small">Delivery Fee</span>
            <span className="fw-semibold text-success">FREE 🎉</span>
          </div>

          <hr style={{ borderColor: 'rgba(0,0,0,0.07)' }} />

          <div className="d-flex justify-content-between mb-4">
            <span className="fw-bold fs-6">Grand Total</span>
            <span className="fw-bold fs-5 text-gradient">₹{grandTotal}</span>
          </div>

          <button
            className="btn btn-primary w-100 fw-bold py-2 mb-2"
            style={{ borderRadius: '50px', fontSize: '1rem' }}
            onClick={handleCheckout}
            disabled={ordering}>
            {ordering ? '⏳ Placing Order...' : '✅ Place Order & Pay'}
          </button>
          <Link to="/" className="btn btn-light w-100 fw-semibold border" style={{ borderRadius: '50px' }}>
            ← Continue Shopping
          </Link>

          <div className="text-center mt-3">
            <small className="text-muted">🔒 Secure checkout · Free cancellation</small>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
