import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token     = localStorage.getItem('access');
  const role      = localStorage.getItem('role') || 'customer';
  const username  = localStorage.getItem('username');
  const { cartItems } = useContext(CartContext);
  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar navbar-expand-lg sticky-top">
      <div className="container">
        {/* Brand */}
        <Link className="navbar-brand d-flex align-items-center gap-2 fw-bold" to="/"
              style={{ color: '#e8441f', fontSize: '1.3rem', letterSpacing: '-0.3px' }}>
          <span style={{ fontSize: '1.6rem' }}>😋</span>
          QuickDine
        </Link>

        {/* Mobile toggler */}
        <button className="navbar-toggler border-0 shadow-none" type="button"
                data-bs-toggle="collapse" data-bs-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center gap-1">

            <li className="nav-item">
              <Link className={`nav-link fw-semibold ${isActive('/') ? 'text-primary' : ''}`} to="/">
                🏠 Home
              </Link>
            </li>

            {/* Customer-only: cart */}
            {(!token || role === 'customer') && (
              <li className="nav-item">
                <Link className="nav-link position-relative fw-semibold" to="/cart">
                  🛒 <span className="d-lg-none">Cart</span>
                  {cartCount > 0 && (
                    <span className="position-absolute badge rounded-pill bg-danger"
                          style={{ top: 0, right: '-4px', fontSize: '0.6rem', padding: '3px 5px' }}>
                      {cartCount}
                    </span>
                  )}
                </Link>
              </li>
            )}

            {/* Logged-in state */}
            {token ? (
              <>
                {role === 'restaurant_owner' && (
                  <li className="nav-item">
                    <Link className="nav-link fw-semibold" to="/dashboard/owner"
                          style={{ color: '#3b82f6' }}>
                      👨‍🍳 Owner Portal
                    </Link>
                  </li>
                )}
                {role === 'delivery_agent' && (
                  <li className="nav-item">
                    <Link className="nav-link fw-semibold" to="/dashboard/delivery"
                          style={{ color: '#10b981' }}>
                      🛵 Delivery Jobs
                    </Link>
                  </li>
                )}

                {/* User pill */}
                <li className="nav-item ms-2">
                  <div className="d-flex align-items-center gap-2">
                    <div className="d-flex align-items-center gap-2 px-3 py-1 rounded-pill"
                         style={{ background: 'rgba(232,68,31,0.08)', border: '1px solid rgba(232,68,31,0.15)' }}>
                      <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white"
                           style={{ width: '26px', height: '26px', fontSize: '0.7rem',
                                    background: 'linear-gradient(135deg,#e8441f,#f7971e)' }}>
                        {username ? username[0].toUpperCase() : '?'}
                      </div>
                      <span className="fw-semibold d-none d-lg-inline" style={{ fontSize: '0.88rem', color: '#e8441f' }}>
                        {username}
                      </span>
                    </div>
                    <button className="btn btn-outline-danger btn-sm fw-semibold px-3"
                            style={{ borderRadius: '50px' }}
                            onClick={handleLogout}>
                      Logout
                    </button>
                  </div>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link fw-semibold" to="/login">Login</Link>
                </li>
                <li className="nav-item ms-1">
                  <Link className="btn btn-primary btn-sm px-4 fw-bold" to="/register"
                        style={{ borderRadius: '50px', padding: '0.45rem 1.2rem' }}>
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
