import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminDashboard.css';
import logo from './GG-removebg-preview.png';

const AdminDashboard = () => {
  const [admin, setAdmin] = useState(null);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [userActivities, setUserActivities] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'urgent',
      time: '2 min ago',
      text: 'New registration requests pending approval'
    },
    {
      id: 2,
      type: 'success',
      time: '1 hour ago',
      text: 'System backup completed successfully'
    },
    {
      id: 3,
      type: 'info',
      time: '3 hours ago',
      text: '5 users logged in today'
    }
  ]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');
    
    if (!token || userType !== 'admin') {
      navigate('/admin-login');
      return;
    }

    const storedAdmin = JSON.parse(localStorage.getItem('user'));
    setAdmin(storedAdmin);
    
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.body.classList.add('dark-mode');
    }
    
    fetchData();
    createParticles();

    return () => {
      const particleSystem = document.querySelector('.particle-system');
      if (particleSystem) {
        particleSystem.innerHTML = '';
      }
    };
  }, [navigate]);

  const createParticles = () => {
    const particleSystem = document.querySelector('.particle-system');
    if (particleSystem) {
      particleSystem.innerHTML = '';
      
      for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (15 + Math.random() * 10) + 's';
        particleSystem.appendChild(particle);
      }
    }
  };

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      console.log('📡 Fetching dashboard data...');
      
      const [pendingResponse, usersResponse, activitiesResponse] = await Promise.all([
        axios.get('https://handwritingbackendnode.onrender.com/api/admin/pending-users', { headers }),
        axios.get('https://handwritingbackendnode.onrender.com/api/admin/users', { headers }),
        axios.get('https://handwritingbackendnode.onrender.com/api/admin/user-activities', { headers })
      ]);

      console.log('📥 API Responses:', {
        pending: pendingResponse.data,
        users: usersResponse.data,
        activities: activitiesResponse.data
      });

      // FIX 1: Handle pending users response format
      let pendingUsersData = [];
      if (pendingResponse.data && pendingResponse.data.success) {
        pendingUsersData = Array.isArray(pendingResponse.data.users) ? pendingResponse.data.users : 
                          Array.isArray(pendingResponse.data.data) ? pendingResponse.data.data : [];
      } else if (Array.isArray(pendingResponse.data)) {
        pendingUsersData = pendingResponse.data;
      }
      console.log('📋 Pending users:', pendingUsersData.length);
      setPendingUsers(pendingUsersData);

      // FIX 2: Handle all users response format
      let allUsersData = [];
      if (usersResponse.data && usersResponse.data.success) {
        allUsersData = Array.isArray(usersResponse.data.users) ? usersResponse.data.users : 
                      Array.isArray(usersResponse.data.data) ? usersResponse.data.data : [];
      } else if (Array.isArray(usersResponse.data)) {
        allUsersData = usersResponse.data;
      }
      console.log('👥 All users:', allUsersData.length);
      setAllUsers(allUsersData);

      // FIX 3: Handle activities response format
      let activitiesData = [];
      if (activitiesResponse.data && activitiesResponse.data.success) {
        activitiesData = Array.isArray(activitiesResponse.data.activities) ? activitiesResponse.data.activities : 
                        Array.isArray(activitiesResponse.data.data) ? activitiesResponse.data.data : [];
      } else if (Array.isArray(activitiesResponse.data)) {
        activitiesData = activitiesResponse.data;
      }
      console.log('📊 Activities:', activitiesData.length);
      setUserActivities(activitiesData);
      
      // Update notifications
      setNotifications(prev => [
        {
          ...prev[0],
          text: `${pendingUsersData.length} registration requests pending approval`
        },
        ...prev.slice(1)
      ]);
    } catch (error) {
      console.error('❌ Error fetching data:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      if (error.response?.status === 401) {
        handleLogout();
      }
      
      let errorMessage = 'Error fetching data';
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      showNotification(errorMessage, 'error');
      
      // Set empty arrays to prevent filter errors
      setPendingUsers([]);
      setAllUsers([]);
      setUserActivities([]);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyUser = async (userId) => {
    setActionLoading(userId);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `https://handwritingbackendnode.onrender.com/api/admin/verify-user/${userId}`, 
        {}, 
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      console.log('✅ User verification response:', response.data);
      
      await fetchData();
      showNotification(response.data.message || 'User verified successfully! Credentials sent via email.', 'success');
    } catch (error) {
      console.error('❌ Error verifying user:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      let errorMsg = 'Error verifying user';
      if (error.response?.data?.error) {
        errorMsg = error.response.data.error;
      } else if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      }
      
      showNotification(errorMsg, 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
    localStorage.removeItem('theme');
    document.body.classList.remove('dark-mode');
    navigate('/');
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    document.body.classList.toggle('dark-mode', newDarkMode);
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
  };

  const showNotification = (message, type = 'info') => {
    const toast = document.createElement('div');
    toast.className = `toast-notification ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add('show');
    }, 100);
    
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      }, 300);
    }, 3000);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortedData = (data, key) => {
    if (!sortConfig.key || !data || !Array.isArray(data) || data.length === 0) return data || [];
    
    return [...data].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];
      
      if (sortConfig.key === 'userId.name' && a.userId && b.userId) {
        aValue = a.userId.name;
        bValue = b.userId.name;
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;
      
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  const getActivityIcon = (action) => {
    const icons = {
      login: '🔓',
      logout: '🔒',
      register: '📝',
      verify: '✅',
      analysis: '📊',
      upload: '📤',
      download: '📥',
      update: '✏️',
      delete: '🗑️',
      default: '⚡'
    };
    return icons[action] || icons.default;
  };

  const getStatusBadge = (user) => {
    return user?.isVerified ? (
      <span className="status-badge verified pulse">✅ Verified</span>
    ) : (
      <span className="status-badge pending pulse">⏳ Pending</span>
    );
  };

  const getRoleBadgeClass = (role) => {
    const roleClasses = {
      'Graphologist': 'teacher',
      'Hiring Manager': 'student',
      'Psychiatrist': 'researcher',
      'Other': 'other'
    };
    return roleClasses[role] || 'other';
  };

  // FIX 4: Safe array filtering
  const filteredUsers = Array.isArray(allUsers) ? allUsers.filter(user => 
    user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user?.role?.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  const filteredPendingUsers = Array.isArray(pendingUsers) ? pendingUsers.filter(user => 
    user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user?.role?.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  const filteredActivities = Array.isArray(userActivities) ? userActivities.filter(activity => 
    (activity.userId?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    activity.action?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (activity.ipAddress || '').toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  const exportData = () => {
    try {
      const csvData = Array.isArray(allUsers) ? allUsers.map(user => ({
        Name: user.name || '',
        Email: user.email || '',
        Role: user.role || '',
        Status: user.isVerified ? 'Verified' : 'Pending',
        'Registration Date': user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '',
        'Last Login': user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never',
        Mobile: user.mobile || '',
        'Other Role': user.otherRole || ''
      })) : [];
      
      if (csvData.length === 0) {
        showNotification('No data to export', 'info');
        return;
      }
      
      const headers = Object.keys(csvData[0]);
      const csvContent = [
        headers.join(','),
        ...csvData.map(row => 
          headers.map(header => {
            const value = row[header] || '';
            return typeof value === 'string' && (value.includes(',') || value.includes('"')) 
              ? `"${value.replace(/"/g, '""')}"` 
              : value;
          }).join(',')
        )
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `users-data-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      showNotification('Data exported successfully!', 'success');
    } catch (error) {
      console.error('Export error:', error);
      showNotification('Error exporting data: ' + error.message, 'error');
    }
  };

  const handleNotificationClick = (notification) => {
    if (notification.type === 'urgent') {
      setActiveTab('pending');
      setNotificationOpen(false);
    }
  };

  const getSortIconClass = (columnKey) => {
    if (sortConfig.key !== columnKey) return '';
    return sortConfig.direction === 'asc' ? 'asc' : 'desc';
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const notificationPanel = document.querySelector('.notification-panel');
      const notificationToggle = document.querySelector('.notification-toggle');
      
      if (notificationOpen && 
          notificationPanel && 
          !notificationPanel.contains(event.target) &&
          notificationToggle &&
          !notificationToggle.contains(event.target)) {
        setNotificationOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [notificationOpen]);

  if (loading) {
    return (
      <div className={`dashboard-loading ${darkMode ? 'dark' : ''}`}>
        <div className="floating-shapes">
          <div className="shape-1"></div>
          <div className="shape-2"></div>
          <div className="shape-3"></div>
          <div className="shape-4"></div>
          <div className="shape-5"></div>
        </div>
        <div className="loading-animation">
          <div className="orbit">
            <div className="moon"></div>
            <div className="moon"></div>
            <div className="moon"></div>
          </div>
          <p>Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  // FIX 5: Safe array length checks in the JSX
  const verifiedUsersCount = Array.isArray(allUsers) ? allUsers.filter(u => u.isVerified).length : 0;
  const loginActivitiesCount = Array.isArray(userActivities) ? userActivities.filter(a => a.action === 'login').length : 0;

  return (
    <div className={`dashboard-container ${darkMode ? 'dark' : ''}`}>
      {/* Floating Background Elements */}
      <div className="floating-shapes">
        <div className="shape-1"></div>
        <div className="shape-2"></div>
        <div className="shape-3"></div>
        <div className="shape-4"></div>
        <div className="shape-5"></div>
      </div>

      {/* Particle System */}
      <div className="particle-system"></div>

      {/* Notification Panel */}
      <div className={`notification-panel ${notificationOpen ? 'active' : ''}`}>
        <div className="notification-header">
          <h3>Notifications</h3>
          <button 
            className="notification-close"
            onClick={() => setNotificationOpen(false)}
            aria-label="Close notifications"
          >
            ✕
          </button>
        </div>
        <div className="notification-list">
          {notifications.map(notification => (
            <div 
              key={notification.id}
              className={`notification-item ${notification.type}`}
              onClick={() => handleNotificationClick(notification)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleNotificationClick(notification);
                }
              }}
            >
              <div className="notification-time">{notification.time}</div>
              <div className="notification-text">{notification.text}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="brand">
            <div className="logo">
              <span className="logo-icon"></span>
              <img src={logo} alt="GraphoGenius Logo" className="logo-image" />
              <span className="logo-text">GraphoGenius</span>
            </div>
          </div>
          
          <div className="header-actions">
            <div className="search-bar">
              <input 
                type="text" 
                placeholder="Search dashboard..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search dashboard"
              />
              <span className="search-icon">🔍</span>
            </div>
            
            <div className="user-menu">
              <div 
                className="notification-toggle" 
                onClick={() => setNotificationOpen(!notificationOpen)}
                role="button"
                tabIndex={0}
                aria-label="Toggle notifications"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setNotificationOpen(!notificationOpen);
                  }
                }}
              >
                🔔
                {Array.isArray(pendingUsers) && pendingUsers.length > 0 && (
                  <span className="notification-badge">{pendingUsers.length}</span>
                )}
              </div>
              
              <div className="user-avatar">
                {admin?.name?.charAt(0)?.toUpperCase() || 'A'}
              </div>
              <span className="user-name">{admin?.name || 'Admin'}</span>
              
              <div 
                className="theme-toggle" 
                onClick={toggleDarkMode}
                role="button"
                tabIndex={0}
                aria-label={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    toggleDarkMode();
                  }
                }}
              >
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
        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card" data-aos="fade-up">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <h3>{Array.isArray(allUsers) ? allUsers.length : 0}</h3>
              <p>Total Users</p>
              <div className="stat-progress">
                <div className="progress-bar" style={{ width: '100%' }}></div>
              </div>
            </div>
          </div>
          
          <div className="stat-card pending" data-aos="fade-up" data-aos-delay="100">
            <div className="stat-icon">⏳</div>
            <div className="stat-info">
              <h3>{Array.isArray(pendingUsers) ? pendingUsers.length : 0}</h3>
              <p>Pending Approvals</p>
              <div className="stat-progress">
                <div 
                  className="progress-bar warning" 
                  style={{ 
                    width: `${Array.isArray(allUsers) && allUsers.length > 0 ? 
                      (Array.isArray(pendingUsers) ? pendingUsers.length : 0 / allUsers.length) * 100 : 0}%`
                  }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="stat-card verified" data-aos="fade-up" data-aos-delay="200">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <h3>{verifiedUsersCount}</h3>
              <p>Verified Users</p>
              <div className="stat-progress">
                <div 
                  className="progress-bar success" 
                  style={{ 
                    width: `${Array.isArray(allUsers) && allUsers.length > 0 ? 
                      (verifiedUsersCount / allUsers.length) * 100 : 0}%`
                  }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="stat-card cosmic" data-aos="fade-up" data-aos-delay="300">
            <div className="stat-icon">🔑</div>
            <div className="stat-info">
              <h3>{loginActivitiesCount}</h3>
              <p>Recent Logins</p>
              <div className="stat-progress">
                <div 
                  className="progress-bar cosmic" 
                  style={{ 
                    width: `${Math.min(100, (loginActivitiesCount / 10) * 100)}%`
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="tab-navigation" data-aos="fade-up">
          <button 
            className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            <span className="tab-icon">⏳</span>
            Pending Requests
            <span className="badge">{Array.isArray(pendingUsers) ? pendingUsers.length : 0}</span>
          </button>
          
          <button 
            className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <span className="tab-icon">👥</span>
            All Users
            <span className="badge">{Array.isArray(allUsers) ? allUsers.length : 0}</span>
          </button>
          
          <button 
            className={`tab-btn ${activeTab === 'activities' ? 'active' : ''}`}
            onClick={() => setActiveTab('activities')}
          >
            <span className="tab-icon">📊</span>
            Activities
            <span className="badge">{Array.isArray(userActivities) ? userActivities.length : 0}</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content" data-aos="fade-up">
          {activeTab === 'pending' && (
            <div className="data-table-container">
              <div className="table-header">
                <h3>🔍 Pending Approval Requests</h3>
                <div className="table-actions">
                  <button className="refresh-btn" onClick={fetchData}>
                    <span>🔄</span> Refresh
                  </button>
                </div>
              </div>
              
              {!Array.isArray(filteredPendingUsers) || filteredPendingUsers.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">🎉</div>
                  <h4>No Pending Requests</h4>
                  <p>All registration requests have been processed</p>
                </div>
              ) : (
                <div className="data-table">
                  <table>
                    <thead>
                      <tr>
                        <th 
                          className={`sortable ${getSortIconClass('name')}`} 
                          onClick={() => handleSort('name')}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              handleSort('name');
                            }
                          }}
                        >
                          User
                        </th>
                        <th>Contact</th>
                        <th 
                          className={`sortable ${getSortIconClass('role')}`} 
                          onClick={() => handleSort('role')}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              handleSort('role');
                            }
                          }}
                        >
                          Role
                        </th>
                        <th 
                          className={`sortable ${getSortIconClass('createdAt')}`} 
                          onClick={() => handleSort('createdAt')}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              handleSort('createdAt');
                            }
                          }}
                        >
                          Registered
                        </th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getSortedData(filteredPendingUsers, sortConfig.key).map(user => (
                        <tr key={user._id || user.id || Math.random()}>
                          <td>
                            <div className="user-info">
                              <div className="user-avatar-sm">
                                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                              </div>
                              <div>
                                <strong>{user?.name || 'Unknown'}</strong>
                                <small>{user?.email || 'No email'}</small>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="contact-info">
                              <span>{user?.email || 'No email'}</span>
                              <small>{user?.mobile || 'No mobile'}</small>
                            </div>
                          </td>
                          <td>
                            <span className={`role-badge ${getRoleBadgeClass(user?.role)}`}>
                              {user?.role || 'Unknown'}
                              {user?.role === 'Other' && user?.otherRole && (
                                <small> ({user.otherRole})</small>
                              )}
                            </span>
                          </td>
                          <td>
                            <div className="activity-time">
                              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                              <small>
                                {user?.createdAt ? new Date(user.createdAt).toLocaleTimeString() : ''}
                              </small>
                            </div>
                          </td>
                          <td>
                            <button
                              className="action-btn approve"
                              onClick={() => user?._id && handleVerifyUser(user._id)}
                              disabled={actionLoading === user?._id || !user?._id}
                            >
                              {actionLoading === user?._id ? (
                                <span className="loading-spinner">
                                  <span className="spinner-sm"></span>
                                  Processing...
                                </span>
                              ) : (
                                <>
                                  <span>✅</span>
                                  Approve
                                </>
                              )}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'users' && (
            <div className="data-table-container">
              <div className="table-header">
                <h3>👥 User Management</h3>
                <div className="table-actions">
                  <input 
                    type="text" 
                    placeholder="Filter users..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                    aria-label="Filter users"
                  />
                  <button className="export-btn" onClick={exportData}>
                    <span>📊</span> Export
                  </button>
                  <button className="refresh-btn" onClick={fetchData}>
                    <span>🔄</span> Refresh
                  </button>
                </div>
              </div>
              
              {!Array.isArray(filteredUsers) || filteredUsers.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">👥</div>
                  <h4>No Users Found</h4>
                  <p>No users registered yet or data couldn't be loaded</p>
                </div>
              ) : (
                <div className="data-table">
                  <table>
                    <thead>
                      <tr>
                        <th 
                          className={`sortable ${getSortIconClass('name')}`} 
                          onClick={() => handleSort('name')}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              handleSort('name');
                            }
                          }}
                        >
                          User
                        </th>
                        <th>Status</th>
                        <th 
                          className={`sortable ${getSortIconClass('role')}`} 
                          onClick={() => handleSort('role')}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              handleSort('role');
                            }
                          }}
                        >
                          Role
                        </th>
                        <th 
                          className={`sortable ${getSortIconClass('lastLogin')}`} 
                          onClick={() => handleSort('lastLogin')}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              handleSort('lastLogin');
                            }
                          }}
                        >
                          Last Activity
                        </th>
                        <th>Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getSortedData(filteredUsers, sortConfig.key).map(user => (
                        <tr key={user._id || user.id || Math.random()}>
                          <td>
                            <div className="user-info">
                              <div className="user-avatar-sm">
                                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                              </div>
                              <div>
                                <strong>{user?.name || 'Unknown'}</strong>
                                <small>{user?.email || 'No email'}</small>
                              </div>
                            </div>
                          </td>
                          <td>{user ? getStatusBadge(user) : <span>Unknown</span>}</td>
                          <td>
                            <span className={`role-badge ${getRoleBadgeClass(user?.role)}`}>
                              {user?.role || 'Unknown'}
                              {user?.role === 'Other' && user?.otherRole && (
                                <small> ({user.otherRole})</small>
                              )}
                            </span>
                          </td>
                          <td>
                            {user?.lastLogin ? (
                              <div className="activity-time">
                                {new Date(user.lastLogin).toLocaleDateString()}
                                <small>{new Date(user.lastLogin).toLocaleTimeString()}</small>
                              </div>
                            ) : (
                              <span className="never-logged">Never</span>
                            )}
                          </td>
                          <td>
                            <button className="view-btn">
                              <span>👁️</span> View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'activities' && (
            <div className="data-table-container">
              <div className="table-header">
                <h3>📊 User Activities</h3>
                <div className="table-actions">
                  <input 
                    type="text" 
                    placeholder="Filter activities..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                    aria-label="Filter activities"
                  />
                  <button className="refresh-btn" onClick={fetchData}>
                    <span>🔄</span> Refresh
                  </button>
                </div>
              </div>
              
              {!Array.isArray(filteredActivities) || filteredActivities.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📊</div>
                  <h4>No Activities Found</h4>
                  <p>No user activities recorded yet</p>
                </div>
              ) : (
                <div className="data-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Activity</th>
                        <th 
                          className={`sortable ${getSortIconClass('userId.name')}`} 
                          onClick={() => handleSort('userId.name')}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              handleSort('userId.name');
                            }
                          }}
                        >
                          User
                        </th>
                        <th 
                          className={`sortable ${getSortIconClass('timestamp')}`} 
                          onClick={() => handleSort('timestamp')}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              handleSort('timestamp');
                            }
                          }}
                        >
                          Timestamp
                        </th>
                        <th>IP Address</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getSortedData(filteredActivities, sortConfig.key).map(activity => (
                        <tr key={activity._id || activity.id || Math.random()}>
                          <td>
                            <div className="activity-info">
                              <span className="activity-icon">
                                {getActivityIcon(activity?.action)}
                              </span>
                              <span className="activity-text">
                                {activity?.action ? 
                                  activity.action.charAt(0).toUpperCase() + activity.action.slice(1) : 
                                  'Unknown'
                                }
                              </span>
                            </div>
                          </td>
                          <td>
                            {activity?.userId ? (
                              <div className="user-info">
                                <div className="user-avatar-sm">
                                  {activity.userId.name?.charAt(0)?.toUpperCase() || 'U'}
                                </div>
                                <div>
                                  <strong>{activity.userId.name || 'Unknown'}</strong>
                                  <small>{activity.userId.email || 'No email'}</small>
                                </div>
                              </div>
                            ) : (
                              <span className="unknown-user">System</span>
                            )}
                          </td>
                          <td>
                            <div className="activity-time">
                              {activity?.timestamp ? 
                                new Date(activity.timestamp).toLocaleDateString() : 
                                'Unknown'
                              }
                              <small>
                                {activity?.timestamp ? 
                                  new Date(activity.timestamp).toLocaleTimeString() : 
                                  ''
                                }
                              </small>
                            </div>
                          </td>
                          <td>
                            <code className="ip-address">{activity?.ipAddress || 'N/A'}</code>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions Panel */}
      <div className="quick-actions">
        <button 
          className="quick-action" 
          onClick={() => setActiveTab('pending')} 
          title="View Pending Requests"
          aria-label="View Pending Requests"
        >
          <span className="action-icon">⏳</span>
          <span className="action-text">Pending</span>
        </button>
        <button 
          className="quick-action" 
          onClick={scrollToTop} 
          title="Scroll to Top"
          aria-label="Scroll to Top"
        >
          <span className="action-icon">⬆️</span>
          <span className="action-text">Top</span>
        </button>
        <button 
          className="quick-action" 
          onClick={fetchData} 
          title="Refresh Data"
          aria-label="Refresh Data"
        >
          <span className="action-icon">🔄</span>
          <span className="action-text">Refresh</span>
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
