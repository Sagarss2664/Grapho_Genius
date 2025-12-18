import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';
import logo from './GG-removebg-preview.png'; // Import your logo here


const AdminLogin = () => {
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
      
      const response = await axios.post('https://handwritingbackendnode.onrender.com/api/admin/login', formData);
      
      // Store token and admin data
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.admin));
      localStorage.setItem('userType', 'admin');
      
      // Redirect to admin dashboard
      navigate('/admin-dashboard');
    } catch (error) {
      setError(error.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="auth-card admin-card">
          <div className="auth-header">
             <div className="logo">
                        <span className="logo-icon"></span>
                        <img src={logo} alt="GraphoGenius Logo" className="logo-image" />
                        <span className="logo-text">GraphoGenius</span>
                      </div>
            {/* <div className="admin-badge"></div> */}
            <h2>Admin Login</h2>
            <p>Access the administrative dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Admin Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter admin email"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Admin Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter admin password"
                disabled={loading}
              />
            </div>

            <button 
              type="submit" 
              className="auth-btn admin-btn"
              disabled={loading}
            >
              {loading ? (
                <span className="loading-spinner">
                  <span className="spinner"></span>
                  Logging in...
                </span>
              ) : (
                'Admin Login'
              )}
            </button>
          </form>

          <div className="auth-links">
            <p>Are you a user? <Link to="/user-login">User Login</Link></p>
            <p><Link to="/">Back to Home</Link></p>
          </div>

          <div className="auth-info">
            <div className="info-box admin-info">
              <h4>Admin Access</h4>
              <li>This area is restricted to authorized administrators only.</li>
              <li>Ensure you have the correct credentials to access the admin dashboard.</li>
            </div>
          </div>

      
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
