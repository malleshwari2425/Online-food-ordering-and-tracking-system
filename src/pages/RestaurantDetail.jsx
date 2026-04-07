import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';

function RestaurantDetail() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState({});
  const { addToCart, cartItems } = useContext(CartContext);
  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  useEffect(() => {
    axios.get(`http://localhost:8000/api/restaurants/restaurants/${id}/`)
      .then(res => {
        setRestaurant(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const handleAdd = (item) => {
    addToCart(item, restaurant.id);
    setAdded(prev => ({ ...prev, [item.id]: true }));
    setTimeout(() => setAdded(prev => ({ ...prev, [item.id]: false })), 1200);
  };

  if (loading || !restaurant) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="spinner-border" style={{ color: '#e8441f', width: '3rem', height: '3rem' }} role="status" />
        <p className="text-muted mt-3 fw-semibold">Loading menu...</p>
      </div>
    );
  }

  // Group menu items by a fake category logic for better layout? 
  // Let's just list them nicely.
  
  return (
    <div className="pb-5">
      {/* ── HERO BANNER ── */}
      <div className="position-relative mb-5 rounded-4 overflow-hidden shadow-sm pt-4" style={{ height: '320px', backgroundColor: '#1a1a2e' }}>
        {restaurant.image && (
          <img src={restaurant.image} alt={restaurant.name} 
               style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7, position: 'absolute', top: 0, left: 0 }} 
               onError={e => { e.target.onerror = null; e.target.style.display = 'none'; }} />
        )}
        <div className="position-absolute bottom-0 start-0 w-100 p-4 p-md-5" 
             style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 100%)' }}>
          <div className="d-flex align-items-end justify-content-between flex-wrap gap-3">
            <div>
              <span className="badge bg-white text-dark mb-2 px-3 py-2 rounded-pill fw-bold">⭐ 4.5 Rating</span>
              <h1 className="text-white fw-bold mb-1" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>{restaurant.name}</h1>
              <p className="text-white-50 mb-0 fs-5">{restaurant.description}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* ── MENU GRID ── */}
        <div className="col-lg-8">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="fw-bold mb-0">🍽️ Menu Main Course</h3>
          </div>

          <div className="row g-4">
            {restaurant.menu_items && restaurant.menu_items.length > 0 ? (
              restaurant.menu_items.map(item => (
                <div key={item.id} className="col-md-6">
                  <div className="card h-100 border-0" style={{ borderRadius: '20px' }}>
                    <div style={{ position: 'relative' }}>
                      {item.image ? (
                        <img src={item.image} className="img-menu" alt={item.name}
                             style={{ borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }}
                             onError={e => { 
                               e.target.onerror = null; 
                               e.target.style.display = 'none';
                               e.target.parentElement.innerHTML = `<div class="bg-light d-flex align-items-center justify-content-center" style="height:175px; border-top-left-radius:20px; border-top-right-radius:20px; font-size:3rem">🍽️</div>`;
                             }} />
                      ) : (
                        <div className="bg-light d-flex align-items-center justify-content-center" 
                             style={{ height: '175px', borderTopLeftRadius: '20px', borderTopRightRadius: '20px', fontSize: '3rem' }}>
                          🍲
                        </div>
                      )}
                      {/* Price badge overlaid on image */}
                      <div className="position-absolute bottom-0 start-0 m-3 px-3 py-1 rounded-pill bg-white text-dark fw-bold shadow-sm"
                           style={{ fontSize: '0.9rem' }}>
                        ₹{parseFloat(item.price).toFixed(0)}
                      </div>
                    </div>

                    <div className="card-body p-4 d-flex flex-column">
                      <h5 className="fw-bold mb-2">{item.name}</h5>
                      <p className="text-muted small mb-3" style={{ flexGrow: 1 }}>{item.description || 'Delicious freshly prepared meal.'}</p>
                      
                      <button
                        className={`btn w-100 fw-bold py-2 ${added[item.id] ? 'btn-success' : 'btn-outline-primary'}`}
                        onClick={() => handleAdd(item)}
                        style={{ borderRadius: '50px', transition: 'all 0.3s ease' }}
                      >
                        {added[item.id] ? '✓ Added to Cart' : '+ Add to Cart'}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12 py-5 text-center">
                <p className="text-muted fs-5">No menu items available currently.</p>
              </div>
            )}
          </div>
        </div>

        {/* ── STICKY CART SIDEBAR ── */}
        <div className="col-lg-4">
          <div className="card no-lift border-0 p-4 sticky-top shadow-sm" style={{ borderRadius: '24px', top: '90px' }}>
            <h5 className="fw-bold mb-4">🛒 Your Order</h5>
            
            {cartItems.length > 0 ? (
              <>
                <ul className="list-unstyled mb-4">
                  {cartItems.map((item, i) => (
                    <li key={item.id} className="d-flex justify-content-between align-items-center py-2"
                        style={{ borderBottom: i < cartItems.length - 1 ? '1px dashed #e5e7eb' : 'none' }}>
                      <div className="d-flex align-items-center gap-2">
                        <span className="badge bg-light text-dark border px-2 py-1 flex-shrink-0">{item.qty}x</span>
                        <span className="fw-semibold small lh-sm">{item.name}</span>
                      </div>
                      <span className="fw-bold small ps-2">₹{(item.price * item.qty).toFixed(0)}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/cart" className="btn btn-primary w-100 fw-bold py-2 shadow" style={{ borderRadius: '50px' }}>
                  Checkout • ₹{cartItems.reduce((acc, i) => acc + (i.price * i.qty), 0).toFixed(0)}
                </Link>
              </>
            ) : (
              <div className="text-center py-4">
                <div style={{ fontSize: '3rem', opacity: 0.5, marginBottom: '1rem' }}>🛍️</div>
                <p className="text-muted small mb-0">Your cart is empty.</p>
                <p className="text-muted small">Add items from the menu to start your order.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default RestaurantDetail;
