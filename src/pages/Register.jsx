import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    role: 'customer'
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:8000/api/accounts/register/', form);
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (error) {
      alert('Registration failed. Username may already exist.');
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center align-items-center mb-5" style={{ minHeight: '82vh' }}>
      <div className="col-11 col-md-8 col-lg-5 col-xl-4 py-4">
        
        {/* Header */}
        <div className="text-center mb-4">
           <div className="mx-auto rounded-circle d-flex align-items-center justify-content-center mb-3 shadow-sm" 
                style={{ width: '70px', height: '70px', background: 'linear-gradient(135deg, #e8441f, #f7971e)', fontSize: '2rem' }}>
             🚀
           </div>
           <h2 className="fw-bold mb-0">Join QuickDine</h2>
           <p className="text-muted small">Create an account to get started</p>
        </div>

        <div className="card shadow-md border-0 p-4 p-md-5" style={{ borderRadius: '24px' }}>
          <div className="card-body p-0">
            <form onSubmit={handleRegister}>
              
              <div className="mb-3">
                <label className="form-label text-muted small fw-bold text-uppercase" style={{ letterSpacing: '1px' }}>Username</label>
                <div className="position-relative">
                   <span className="position-absolute ms-3" style={{ top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}>👤</span>
                   <input
                     type="text"
                     className="form-control bg-light border-0 py-3 ps-5"
                     placeholder="Choose a username"
                     onChange={e => setForm({...form, username: e.target.value})}
                     required
                     style={{ borderRadius: '14px' }}
                   />
                </div>
              </div>
              
              <div className="mb-3">
                <label className="form-label text-muted small fw-bold text-uppercase" style={{ letterSpacing: '1px' }}>Email</label>
                <div className="position-relative">
                   <span className="position-absolute ms-3" style={{ top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}>✉️</span>
                   <input
                     type="email"
                     className="form-control bg-light border-0 py-3 ps-5"
                     placeholder="Enter your email"
                     onChange={e => setForm({...form, email: e.target.value})}
                     required
                     style={{ borderRadius: '14px' }}
                   />
                </div>
              </div>
              
              <div className="mb-3">
                <label className="form-label text-muted small fw-bold text-uppercase" style={{ letterSpacing: '1px' }}>Password</label>
                <div className="position-relative">
                   <span className="position-absolute ms-3" style={{ top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}>🔒</span>
                   <input
                     type="password"
                     className="form-control bg-light border-0 py-3 ps-5"
                     placeholder="Create a password"
                     onChange={e => setForm({...form, password: e.target.value})}
                     required
                     style={{ borderRadius: '14px' }}
                   />
                </div>
              </div>
              
              <div className="mb-4 pb-2">
                <label className="form-label text-muted small fw-bold text-uppercase" style={{ letterSpacing: '1px' }}>Account Type</label>
                <div className="position-relative">
                  <span className="position-absolute ms-3" style={{ top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', zIndex: 1 }}>⭐</span>
                  <select 
                    className="form-select bg-light border-0 py-3 ps-5 pe-4" 
                    onChange={e => setForm({...form, role: e.target.value})} 
                    value={form.role}
                    style={{ borderRadius: '14px', appearance: 'none', cursor: 'pointer' }}
                  >
                    <option value="customer">I'm a Customer (Order Food)</option>
                    <option value="restaurant_owner">I'm a Restaurant Owner</option>
                    <option value="delivery_agent">I'm a Delivery Partner</option>
                  </select>
                  <span className="position-absolute end-0 me-3" style={{ top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }}>
                    ▼
                  </span>
                </div>
              </div>
              
              <button type="submit" 
                      className="btn btn-primary btn-lg w-100 rounded-pill py-3 fw-bold mb-4 shadow-sm"
                      disabled={loading}>
                {loading ? '⏳ Creating Account...' : 'Create Account'}
              </button>
              
              <div className="text-center">
                <span className="text-muted small">Already have an account? </span>
                <Link to="/login" className="text-decoration-none fw-bold small" style={{ color: '#e8441f' }}>Sign in here</Link>
              </div>
              
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
