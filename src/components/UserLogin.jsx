import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';
import logo from './GG-removebg-preview.png'; // Import your logo here


const UserLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('https://handwritingbackendnode.onrender.com/api/user/login', formData);
      
      // Store token and user data
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('userType', 'user');
      
      // Redirect to user dashboard
      navigate('/user-dashboard');
    } catch (error) {
      setError(error.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="auth-card">
          <div className="auth-header">
             <div className="logo">
                                    <span className="logo-icon"></span>
                                    <img src={logo} alt="GraphoGenius Logo" className="logo-image" />
                                    <span className="logo-text">GraphoGenius</span>
                                  </div>
            <h2>User Login</h2>
            <p>Access your handwriting analysis dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                disabled={loading}
              />
            </div>

            <button 
              type="submit" 
              className="auth-btn"
              disabled={loading}
            >
              {loading ? (
                <span className="loading-spinner">
                  <span className="spinner"></span>
                  Logging in...
                </span>
              ) : (
                'Login'
              )}
            </button>
          </form>

          <div className="auth-links">
            <p>Don't have an account? <Link to="/register">Register here</Link></p>
            <p>Are you an admin? <Link to="/admin-login">Admin Login</Link></p>
            <p><Link to="/">Back to Home</Link></p>
          </div>

          <div className="auth-info">
            <div className="info-box">
              <h4>Account Not Verified?</h4>
              <p>If you've registered but can't log in, please wait for admin approval. You'll receive your login credentials via email once approved.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
