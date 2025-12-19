import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';
import logo from './GG-removebg-preview.png';

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');
    const storedUser = localStorage.getItem('user');
    
    console.log('Token exists:', !!token);
    console.log('UserType:', userType);
    console.log('Stored user:', storedUser);
    
    if (!token || userType !== 'user') {
      console.log('No token or wrong user type, redirecting to login');
      navigate('/user-login');
      return;
    }

    // Try to use stored user data first
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log('Parsed stored user:', parsedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing stored user:', error);
      }
    }

    fetchUserProfile();
  }, [navigate]);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Fetching profile with token:', token ? 'Token exists' : 'No token');
      
      const response = await axios.get('https://handwritingbackendnode.onrender.com/api/user/profile', {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Profile API Response:', response);
      console.log('Response data:', response.data);
      console.log('Response data.user:', response.data?.user);
      
      // Handle different response structures
      const userData = response.data?.user || response.data;
      
      if (userData) {
        console.log('Setting user data:', userData);
        setUser(userData);
        
        // Store in localStorage for future use
        localStorage.setItem('user', JSON.stringify(userData));
      } else {
        console.warn('No user data found in response');
      }
      
    } catch (error) {
      console.error('Error fetching profile:', error);
      console.error('Error response:', error.response);
      console.error('Error message:', error.message);
      
      if (error.response?.status === 401) {
        console.log('Unauthorized, logging out');
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await axios.post('https://handwritingbackendnode.onrender.com/api/user/logout', {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userType');
      navigate('/');
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark-mode');
  };

  // Get user initial safely
  const getUserInitial = () => {
    console.log('Getting user initial for:', user);
    if (user?.name) {
      return user.name.charAt(0).toUpperCase();
    } else if (user?.username) {
      return user.username.charAt(0).toUpperCase();
    } else if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U'; // Default to 'U' for User
  };

  // Format date safely
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString();
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'N/A';
    }
  };

  // Format date time safely
  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? 'N/A' : date.toLocaleString();
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'N/A';
    }
  };

  if (loading) {
    return (
      <div className={`dashboard-loading ${darkMode ? 'dark' : ''}`}>
        <div className="loading-animation">
          <div className="orbit">
            <div className="moon"></div>
            <div className="moon"></div>
            <div className="moon"></div>
          </div>
          <p>Loading Your Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`dashboard-container ${darkMode ? 'dark' : ''}`}>
      {/* Floating Background Elements */}
      <div className="floating-shapes">
        <div className="shape-1"></div>
        <div className="shape-2"></div>
        <div className="shape-3"></div>
      </div>

      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon"></span>
            <img src={logo} alt="GraphoGenius Logo" className="logo-image" />
            <span className="logo-text">GraphoGenius</span>
          </div>

          <div className="header-actions">
            <div className="user-menu">
              <div className="user-avatar">
                {getUserInitial()}
              </div>
              <span className="user-name">
                {user?.name || user?.username || user?.email || 'User'}
              </span>
              
              <div className="theme-toggle" onClick={toggleDarkMode}>
                {darkMode ? '☀️' : '🌙'}
              </div>
              
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="dashboard-content">
        <div className="dashboard-grid">
          {/* Profile Card */}
          <div className="dashboard-card profile-card floating" data-aos="fade-up">
            <div className="card-header">
              <div className="card-icon">👤</div>
              <h3>Profile Information</h3>
            </div>
            <div className="card-content">
              <div className="profile-info">
                <div className="info-row">
                  <label>Name:</label>
                  <span>{user?.name || user?.username || 'N/A'}</span>
                </div>
                <div className="info-row">
                  <label>Email:</label>
                  <span>{user?.email || 'N/A'}</span>
                </div>
                <div className="info-row">
                  <label>Mobile:</label>
                  <span>{user?.mobile || user?.phone || 'N/A'}</span>
                </div>
                <div className="info-row">
                  <label>Role:</label>
                  <span className="role-badge">
                    {user?.role || 'User'}
                    {user?.role === 'Other' && user?.otherRole && ` (${user.otherRole})`}
                  </span>
                </div>
                <div className="info-row">
                  <label>Status:</label>
                  <span className="status-badge verified pulse">
                    {user?.isVerified || user?.verified ? '✅ Verified' : '⏳ Pending'}
                  </span>
                </div>
                <div className="info-row">
                  <label>Member Since:</label>
                  <span>{formatDate(user?.createdAt || user?.created_at || user?.dateCreated)}</span>
                </div>
                <div className="info-row">
                  <label>Last Login:</label>
                  <span>{formatDateTime(user?.lastLogin || user?.last_login || user?.lastLoginDate)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="dashboard-card floating" data-aos="fade-up" data-aos-delay="100">
            <div className="card-header">
              <div className="card-icon">🚀</div>
              <h3>Quick Actions</h3>
            </div>
            <div className="card-content">
              <div className="action-buttons">
                <button
                  className="action-btn primary neon-hover"
                  onClick={() => navigate('/dashboard')}
                >
                  <span className="btn-icon">📝</span>
                  New Analysis
                </button>
                <button className="action-btn secondary neon-hover">
                  <span className="btn-icon">📊</span>
                  View Reports
                </button>
                <button className="action-btn tertiary neon-hover">
                  <span className="btn-icon">📁</span>
                  My Files
                </button>
                <button className="action-btn quaternary neon-hover">
                  <span className="btn-icon">⚙️</span>
                  Settings
                </button>
              </div>
            </div>
          </div>

          {/* Recent Activity Card */}
          <div className="dashboard-card floating" data-aos="fade-up" data-aos-delay="200">
            <div className="card-header">
              <div className="card-icon">📈</div>
              <h3>Recent Activity</h3>
            </div>
            <div className="card-content">
              <div className="activity-list">
                <div className="activity-item">
                  <div className="activity-icon">🔑</div>
                  <div className="activity-details">
                    <span className="activity-text">Logged in to dashboard</span>
                    <span className="activity-time">Just now</span>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon">✅</div>
                  <div className="activity-details">
                    <span className="activity-text">
                      {user?.isVerified || user?.verified ? 'Account verified' : 'Account pending verification'}
                    </span>
                    <span className="activity-time">
                      {user?.verifiedAt ? formatDate(user.verifiedAt) : 'Recently'}
                    </span>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon">📝</div>
                  <div className="activity-details">
                    <span className="activity-text">Account created</span>
                    <span className="activity-time">{formatDate(user?.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* System Info Card */}
          <div className="dashboard-card floating" data-aos="fade-up" data-aos-delay="300">
            <div className="card-header">
              <div className="card-icon">ℹ️</div>
              <h3>System Information</h3>
            </div>
            <div className="card-content">
              <div className="system-info">
                <div className="info-item">
                  <span className="info-label">System Status:</span>
                  <span className="status-online">🟢 Online</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Version:</span>
                  <span>v2.1.0</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Last Update:</span>
                  <span>Today</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Support:</span>
                  <span>24/7 Available</span>
                </div>
              </div>
            </div>
          </div>

          {/* Coming Soon Card */}
          <div className="dashboard-card coming-soon floating" data-aos="fade-up" data-aos-delay="400">
            <div className="card-header">
              <div className="card-icon">🔮</div>
              <h3>Coming Soon</h3>
            </div>
            <div className="card-content">
              <div className="coming-soon-content">
                <div className="feature-item">
                  <span className="feature-icon">🎯</span>
                  <span>Advanced Analytics</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">📱</span>
                  <span>Mobile App</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🤖</span>
                  <span>AI Insights</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">👥</span>
                  <span>Team Features</span>
                </div>
              </div>
            </div>
          </div>

          {/* Help Card */}
          <div className="dashboard-card floating" data-aos="fade-up" data-aos-delay="500">
            <div className="card-header">
              <div className="card-icon">🆘</div>
              <h3>Help & Support</h3>
            </div>
            <div className="card-content">
              <div className="help-links">
                <a href="#" className="help-link neon-hover">
                  <span className="help-icon">📚</span>
                  User Guide
                </a>
                <a href="#" className="help-link neon-hover">
                  <span className="help-icon">❓</span>
                  FAQ
                </a>
                <a href="#" className="help-link neon-hover">
                  <span className="help-icon">💬</span>
                  Live Chat
                </a>
                <a href="#" className="help-link neon-hover">
                  <span className="help-icon">🎥</span>
                  Tutorials
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Panel */}
      <div className="quick-actions">
        <button className="quick-action" onClick={() => window.scrollTo(0, 0)}>
          <span className="action-icon">⬆️</span>
          <span className="action-text">Top</span>
        </button>
        <button className="quick-action" onClick={fetchUserProfile}>
          <span className="action-icon">🔄</span>
          <span className="action-text">Refresh</span>
        </button>
        <button className="quick-action" onClick={toggleDarkMode}>
          <span className="action-icon">{darkMode ? '☀️' : '🌙'}</span>
          <span className="action-text">Theme</span>
        </button>
      </div>
    </div>
  );
};

export default UserDashboard;
