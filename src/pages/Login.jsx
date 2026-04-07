import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8000/api/accounts/login/', {
        username,
        password
      });
      localStorage.setItem('access', res.data.access);
      localStorage.setItem('refresh', res.data.refresh);
      localStorage.setItem('user_id', res.data.user_id);
      localStorage.setItem('username', res.data.username);
      localStorage.setItem('role', res.data.role);
      
      // Redirect based on role
      if (res.data.role === 'restaurant_owner') navigate('/dashboard/owner');
      else if (res.data.role === 'delivery_agent') navigate('/dashboard/delivery');
      else navigate('/');
      
      // Force reload to update Navbar state
      window.location.reload(); 
    } catch (err) {
      alert("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <div className="col-11 col-md-8 col-lg-5 col-xl-4">
        {/* Logo/Brand Icon */}
        <div className="text-center mb-4 pb-2">
           <div className="mx-auto rounded-circle d-flex align-items-center justify-content-center mb-3 shadow" 
                style={{ width: '80px', height: '80px', background: 'linear-gradient(135deg, #e8441f, #f7971e)', fontSize: '2.5rem' }}>
             😋
           </div>
           <h2 className="fw-bold mb-0">Welcome Back</h2>
           <p className="text-muted small">Login to your QuickDine account</p>
        </div>

        <div className="card shadow-md border-0 p-4 p-md-5" style={{ borderRadius: '24px' }}>
          <div className="card-body p-0">
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="form-label text-muted small fw-bold text-uppercase" style={{ letterSpacing: '1px' }}>Username</label>
                <div className="position-relative">
                   <span className="position-absolute ms-3" style={{ top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}>👤</span>
                   <input
                     type="text"
                     className="form-control form-control-lg bg-light border-0 py-3 ps-5"
                     value={username}
                     onChange={(e) => setUsername(e.target.value)}
                     placeholder="Enter your username"
                     required
                     style={{ borderRadius: '16px' }}
                   />
                </div>
              </div>
              <div className="mb-4 pb-2">
                <label className="form-label text-muted small fw-bold text-uppercase d-flex justify-content-between" style={{ letterSpacing: '1px' }}>
                  <span>Password</span>
                  <a href="#" className="text-primary text-decoration-none fw-semibold text-capitalize" style={{ letterSpacing: '0' }}>Forgot?</a>
                </label>
                <div className="position-relative">
                   <span className="position-absolute ms-3" style={{ top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}>🔒</span>
                   <input
                     type="password"
                     className="form-control form-control-lg bg-light border-0 py-3 ps-5"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     placeholder="Enter your password"
                     required
                     style={{ borderRadius: '16px' }}
                   />
                </div>
              </div>
              
              <button type="submit" 
                      className="btn btn-primary btn-lg w-100 rounded-pill py-3 fw-bold mb-4 shadow-sm" 
                      style={{ fontSize: '1.05rem', letterSpacing: '0.5px' }}
                      disabled={loading}>
                {loading ? '🔐 Authenticating...' : 'Sign In →'}
              </button>
              
              <div className="d-flex align-items-center mb-4">
                 <hr className="flex-grow-1 opacity-10" />
                 <span className="mx-3 text-muted small">or</span>
                 <hr className="flex-grow-1 opacity-10" />
              </div>

              <div className="text-center">
                <span className="text-muted small">New to QuickDine? </span>
                <Link to="/register" className="text-decoration-none fw-bold small" style={{ color: '#e8441f' }}>Create an account</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
