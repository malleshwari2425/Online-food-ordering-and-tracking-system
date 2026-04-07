import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const CATEGORIES = ['All', 'Indian', 'Burgers', 'Pizza', 'Sushi', 'Street Food'];

const CATEGORY_MAP = {
  'Indian':     ['Taste of India'],
  'Burgers':    ['Burger King'],
  'Pizza':      ['Pizza Hut'],
  'Sushi':      ['Sushi World'],
  'Street Food':['Mumbai Spice House'],
};

const RESTAURANT_META = {
  'Taste of India':     { cuisine: 'North Indian', rating: '4.7', time: '30-40', emoji: '🍛' },
  'Mumbai Spice House': { cuisine: 'Street Food',  rating: '4.5', time: '20-30', emoji: '🌶️' },
  'Burger King':        { cuisine: 'Fast Food',    rating: '4.3', time: '25-35', emoji: '🍔' },
  'Pizza Hut':          { cuisine: 'Italian',      rating: '4.4', time: '35-45', emoji: '🍕' },
  'Sushi World':        { cuisine: 'Japanese',     rating: '4.8', time: '40-50', emoji: '🍣' },
};

function StarRating({ rating }) {
  const stars = Math.round(parseFloat(rating));
  return (
    <span className="rating">
      {'★'.repeat(stars)}{'☆'.repeat(5 - stars)}
      <span style={{ color: '#6b7280', marginLeft: '4px', fontSize: '0.78rem' }}>{rating}</span>
    </span>
  );
}

function RestaurantCard({ restaurant }) {
  const meta = RESTAURANT_META[restaurant.name] || { cuisine: 'Multi-cuisine', rating: '4.5', time: '30-45', emoji: '🍽️' };
  return (
    <div className="card h-100 border-0" style={{ borderRadius: '20px' }}>
      <div style={{ overflow: 'hidden', borderRadius: '20px 20px 0 0' }}>
        {restaurant.image ? (
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="img-restaurant"
            onError={e => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=75';
            }}
          />
        ) : (
          <div className="d-flex align-items-center justify-content-center bg-light"
               style={{ height: '200px', fontSize: '4rem' }}>
            {meta.emoji}
          </div>
        )}
      </div>

      <div className="card-body p-4 d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-1">
          <h5 className="card-title fw-bold mb-0" style={{ fontSize: '1.05rem' }}>{restaurant.name}</h5>
          <span className="badge rounded-pill ms-2 flex-shrink-0"
                style={{ background: 'rgba(232,68,31,0.1)', color: '#e8441f', fontWeight: 700 }}>
            {meta.emoji}
          </span>
        </div>

        <p className="text-muted small mb-2">{meta.cuisine} · {restaurant.description}</p>

        <div className="d-flex align-items-center gap-3 mb-3">
          <StarRating rating={meta.rating} />
          <span className="text-muted" style={{ fontSize: '0.8rem' }}>⏱ {meta.time} min</span>
          <span className="text-success fw-semibold" style={{ fontSize: '0.78rem' }}>FREE delivery</span>
        </div>

        <Link
          to={`/restaurant/${restaurant.id}`}
          className="btn btn-primary mt-auto fw-bold"
          style={{ borderRadius: '50px', padding: '0.55rem 1.2rem' }}
        >
          View Menu →
        </Link>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="card h-100" style={{ borderRadius: '20px' }}>
      <div className="skeleton" style={{ height: '200px', borderRadius: '20px 20px 0 0' }} />
      <div className="card-body p-4">
        <div className="skeleton mb-2" style={{ height: '22px', width: '60%' }} />
        <div className="skeleton mb-3" style={{ height: '16px', width: '80%' }} />
        <div className="skeleton" style={{ height: '38px', borderRadius: '50px' }} />
      </div>
    </div>
  );
}

function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    axios.get('http://localhost:8000/api/restaurants/restaurants/')
      .then(res => { setRestaurants(res.data); setLoading(false); })
      .catch(() => {
        setRestaurants([
          { id: 1, name: 'Burger King', description: 'Best burgers in town', image: null },
          { id: 2, name: 'Pizza Hut', description: 'Delicious hot pizzas', image: null },
          { id: 3, name: 'Sushi World', description: 'Fresh sushi daily', image: null },
        ]);
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(() => {
    let list = restaurants;
    if (activeCategory !== 'All') {
      const names = CATEGORY_MAP[activeCategory] || [];
      list = list.filter(r => names.includes(r.name));
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(r =>
        r.name.toLowerCase().includes(q) ||
        r.description?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [restaurants, search, activeCategory]);

  return (
    <div>
      {/* ── HERO ── */}
      <div
        className="rounded-4 mb-5 text-white text-center position-relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #e8441f 0%, #f7971e 100%)', padding: '3.5rem 2rem' }}
      >
        <div className="hero-blob-1" />
        <div className="hero-blob-2" />
        <div className="position-relative" style={{ zIndex: 1 }}>
          <div className="mb-3" style={{ fontSize: '3.2rem' }}>😋</div>
          <h1 className="fw-bold mb-2" style={{ fontSize: 'clamp(1.8rem, 5vw, 3rem)', letterSpacing: '-0.5px' }}>
            Hungry? We've <span style={{ color: '#fff9c4' }}>got you.</span>
          </h1>
          <p className="mb-4 opacity-90" style={{ fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto 1.5rem' }}>
            Order from your favourite restaurants and track your delivery in real-time.
          </p>
          <a href="#restaurants"
             className="btn btn-light btn-lg fw-bold shadow-sm"
             style={{ color: '#e8441f', borderRadius: '50px', padding: '0.75rem 2.2rem' }}>
            🍽️ Find Food
          </a>
        </div>
      </div>

      {/* ── STATS ROW ── */}
      <div className="row g-3 mb-5">
        {[
          { icon: '🏪', value: `${restaurants.length}+`, label: 'Restaurants' },
          { icon: '🍽️', value: '60+', label: 'Dishes' },
          { icon: '🛵', value: '30 min', label: 'Avg delivery' },
          { icon: '⭐', value: '4.6', label: 'Avg rating' },
        ].map((s, i) => (
          <div key={i} className="col-6 col-md-3">
            <div className="stat-card no-lift text-center"
                 style={{ background: i % 2 === 0 ? 'linear-gradient(135deg,#e8441f,#f7971e)' : 'white',
                           color: i % 2 === 0 ? 'white' : '#1a1a1a', boxShadow: '0 4px 16px rgba(0,0,0,0.07)' }}>
              <div style={{ fontSize: '1.8rem' }}>{s.icon}</div>
              <div className="fw-bold fs-4">{s.value}</div>
              <div style={{ fontSize: '0.82rem', opacity: 0.75 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── SEARCH & FILTER ── */}
      <div id="restaurants" className="mb-4">
        <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
          <h3 className="fw-bold mb-0">🏪 Popular Restaurants</h3>
          <div className="search-wrapper" style={{ width: 'min(100%, 340px)' }}>
            <span className="search-icon">🔍</span>
            <input
              type="search"
              className="search-bar"
              placeholder="Search restaurants or cuisine..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Category pills */}
        <div className="d-flex gap-2 flex-wrap mb-4">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`category-pill ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat === 'All' && '🍴 '}{cat === 'Indian' && '🍛 '}{cat === 'Burgers' && '🍔 '}
              {cat === 'Pizza' && '🍕 '}{cat === 'Sushi' && '🍣 '}{cat === 'Street Food' && '🌶️ '}
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="row g-4">
          {loading
            ? Array(3).fill(0).map((_, i) => (
                <div key={i} className="col-md-4"><SkeletonCard /></div>
              ))
            : filtered.length === 0
              ? (
                <div className="col-12 text-center py-5">
                  <div style={{ fontSize: '3.5rem' }}>🔍</div>
                  <h5 className="mt-3 text-muted">No restaurants match "{search || activeCategory}"</h5>
                  <button className="btn btn-outline-primary mt-2 px-4"
                          onClick={() => { setSearch(''); setActiveCategory('All'); }}>
                    Clear filters
                  </button>
                </div>
              )
              : filtered.map(restaurant => (
                  <div key={restaurant.id} className="col-md-6 col-lg-4">
                    <RestaurantCard restaurant={restaurant} />
                  </div>
                ))
          }
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <div className="rounded-4 p-4 p-md-5 mt-5 mb-2"
           style={{ background: 'linear-gradient(135deg,rgba(232,68,31,0.04),rgba(247,151,30,0.06))', border: '1px solid rgba(232,68,31,0.1)' }}>
        <h4 className="fw-bold text-center mb-4">How QuickDine works</h4>
        <div className="row g-4 text-center">
          {[
            { step: '1', icon: '🏪', title: 'Choose Restaurant', desc: 'Browse our curated list of restaurants near you.' },
            { step: '2', icon: '🛒', title: 'Add to Cart',       desc: 'Pick your favourite dishes and customise your order.' },
            { step: '3', icon: '💳', title: 'Place Order',       desc: 'Confirm and pay in one tap — no hassle.' },
            { step: '4', icon: '🛵', title: 'Track Live',        desc: 'Follow your order from kitchen to doorstep.' },
          ].map(s => (
            <div key={s.step} className="col-6 col-md-3">
              <div style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>{s.icon}</div>
              <h6 className="fw-bold mb-1">{s.title}</h6>
              <p className="text-muted small mb-0">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
