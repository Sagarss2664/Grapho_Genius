// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import './Dashboard.css';

// const AdminDashboard = () => {
//   const [admin, setAdmin] = useState(null);
//   const [pendingUsers, setPendingUsers] = useState([]);
//   const [allUsers, setAllUsers] = useState([]);
//   const [userActivities, setUserActivities] = useState([]);
//   const [activeTab, setActiveTab] = useState('pending');
//   const [loading, setLoading] = useState(true);
//   const [actionLoading, setActionLoading] = useState(null);
//   const [darkMode, setDarkMode] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     const userType = localStorage.getItem('userType');
    
//     if (!token || userType !== 'admin') {
//       navigate('/admin-login');
//       return;
//     }

//     const storedAdmin = JSON.parse(localStorage.getItem('user'));
//     setAdmin(storedAdmin);
    
//     fetchData();
//   }, [navigate]);

//   const fetchData = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const headers = { Authorization: `Bearer ${token}` };

//       const [pendingResponse, usersResponse, activitiesResponse] = await Promise.all([
//         axios.get('https://handwritingbackendnode-yllj.onrender.com/api/admin/pending-users', { headers }),
//         axios.get('https://handwritingbackendnode-yllj.onrender.com/api/admin/users', { headers }),
//         axios.get('https://handwritingbackendnode-yllj.onrender.com/api/admin/user-activities', { headers })
//       ]);

//       setPendingUsers(pendingResponse.data);
//       setAllUsers(usersResponse.data);
//       setUserActivities(activitiesResponse.data);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//       if (error.response?.status === 401) {
//         handleLogout();
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleVerifyUser = async (userId) => {
//     setActionLoading(userId);
//     try {
//       const token = localStorage.getItem('token');
//       await axios.post(`https://handwritingbackendnode-yllj.onrender.com/api/admin/verify-user/${userId}`, {}, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
      
//       await fetchData();
//       alert('User verified successfully! Credentials sent via email.');
//     } catch (error) {
//       console.error('Error verifying user:', error);
//       alert('Error verifying user: ' + (error.response?.data?.error || 'Unknown error'));
//     } finally {
//       setActionLoading(null);
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     localStorage.removeItem('userType');
//     navigate('/');
//   };

//   const toggleDarkMode = () => {
//     setDarkMode(!darkMode);
//     document.body.classList.toggle('dark-mode');
//   };

//   const getActivityIcon = (action) => {
//     const icons = {
//       login: '🔓',
//       logout: '🔒',
//       register: '📝',
//       verify: '✅',
//       analysis: '📊',
//       default: '⚡'
//     };
//     return icons[action] || icons.default;
//   };

//   const getStatusBadge = (user) => {
//     return user.isVerified ? (
//       <span className="status-badge verified pulse">✅ Verified</span>
//     ) : (
//       <span className="status-badge pending">⏳ Pending</span>
//     );
//   };

//   const filteredUsers = allUsers.filter(user => 
//     user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     user.email.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const filteredActivities = userActivities.filter(activity => 
//     (activity.userId?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
//     activity.action.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   if (loading) {
//     return (
//       <div className={`dashboard-loading ${darkMode ? 'dark' : ''}`}>
//         <div className="loading-animation">
//           <div className="orbit">
//             <div className="moon"></div>
//             <div className="moon"></div>
//             <div className="moon"></div>
//           </div>
//           <p>Loading Admin Dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className={`dashboard-container ${darkMode ? 'dark' : ''}`}>
//       {/* Floating Background Elements */}
//       <div className="floating-shapes">
//         <div className="shape-1"></div>
//         <div className="shape-2"></div>
//         <div className="shape-3"></div>
//       </div>

//       {/* Header */}
//       <header className="dashboard-header">
//         <div className="header-content">
//           <div className="brand">
//             <span className="logo-icon">🛡️</span>
//             <h1>GraphoGenius <span className="admin-badge">Admin</span></h1>
//           </div>
          
//           <div className="header-actions">
//             <div className="search-bar">
//               <input 
//                 type="text" 
//                 placeholder="Search..." 
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//               <span className="search-icon">🔍</span>
//             </div>
            
//             <div className="user-menu">
//               <div className="user-avatar">
//                 {admin?.name.charAt(0).toUpperCase()}
//               </div>
//               <span className="user-name">{admin?.name}</span>
              
//               <div className="theme-toggle" onClick={toggleDarkMode}>
//                 {darkMode ? '☀️' : '🌙'}
//               </div>
              
//               <button onClick={handleLogout} className="logout-btn">
//                 Logout
//               </button>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <div className="dashboard-content">
//         {/* Stats Cards */}
//         <div className="stats-grid">
//           <div className="stat-card" data-aos="fade-up">
//             <div className="stat-icon">👥</div>
//             <div className="stat-info">
//               <h3>{allUsers.length}</h3>
//               <p>Total Users</p>
//               <div className="stat-progress">
//                 <div className="progress-bar" style={{ width: '100%' }}></div>
//               </div>
//             </div>
//           </div>
          
//           <div className="stat-card pending" data-aos="fade-up" data-aos-delay="100">
//             <div className="stat-icon">⏳</div>
//             <div className="stat-info">
//               <h3>{pendingUsers.length}</h3>
//               <p>Pending Approvals</p>
//               <div className="stat-progress">
//                 <div 
//                   className="progress-bar" 
//                   style={{ 
//                     width: `${(pendingUsers.length / allUsers.length) * 100}%`,
//                     background: 'var(--accent)'
//                   }}
//                 ></div>
//               </div>
//             </div>
//           </div>
          
//           <div className="stat-card verified" data-aos="fade-up" data-aos-delay="200">
//             <div className="stat-icon">✅</div>
//             <div className="stat-info">
//               <h3>{allUsers.filter(u => u.isVerified).length}</h3>
//               <p>Verified Users</p>
//               <div className="stat-progress">
//                 <div 
//                   className="progress-bar" 
//                   style={{ 
//                     width: `${(allUsers.filter(u => u.isVerified).length / allUsers.length) * 100}%`,
//                     background: 'var(--success)'
//                   }}
//                 ></div>
//               </div>
//             </div>
//           </div>
          
//           <div className="stat-card active" data-aos="fade-up" data-aos-delay="300">
//             <div className="stat-icon">🔑</div>
//             <div className="stat-info">
//               <h3>{userActivities.filter(a => a.action === 'login').length}</h3>
//               <p>Recent Logins</p>
//               <div className="stat-progress">
//                 <div 
//                   className="progress-bar" 
//                   style={{ 
//                     width: `${Math.min(100, userActivities.filter(a => a.action === 'login').length)}%`,
//                     background: 'var(--primary)'
//                   }}
//                 ></div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Tabs Navigation */}
//         <div className="tab-navigation" data-aos="fade-up">
//           <button 
//             className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
//             onClick={() => setActiveTab('pending')}
//           >
//             <span className="tab-icon">⏳</span>
//             Pending Requests
//             <span className="badge">{pendingUsers.length}</span>
//           </button>
          
//           <button 
//             className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
//             onClick={() => setActiveTab('users')}
//           >
//             <span className="tab-icon">👥</span>
//             All Users
//             <span className="badge">{allUsers.length}</span>
//           </button>
          
//           <button 
//             className={`tab-btn ${activeTab === 'activities' ? 'active' : ''}`}
//             onClick={() => setActiveTab('activities')}
//           >
//             <span className="tab-icon">📊</span>
//             Activities
//             <span className="badge">{userActivities.length}</span>
//           </button>
//         </div>

//         {/* Tab Content */}
//         <div className="tab-content" data-aos="fade-up">
//           {activeTab === 'pending' && (
//             <div className="data-table-container">
//               <div className="table-header">
//                 <h3>Pending Approval Requests</h3>
//                 <div className="table-actions">
//                   <button className="refresh-btn" onClick={fetchData}>
//                     🔄 Refresh
//                   </button>
//                 </div>
//               </div>
              
//               {pendingUsers.length === 0 ? (
//                 <div className="empty-state">
//                   <div className="empty-icon">🎉</div>
//                   <h4>No Pending Requests</h4>
//                   <p>All registration requests have been processed</p>
//                 </div>
//               ) : (
//                 <div className="data-table">
//                   <table>
//                     <thead>
//                       <tr>
//                         <th>User</th>
//                         <th>Contact</th>
//                         <th>Role</th>
//                         <th>Registered</th>
//                         <th>Actions</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {pendingUsers.map(user => (
//                         <tr key={user._id}>
//                           <td>
//                             <div className="user-info">
//                               <div className="user-avatar-sm">
//                                 {user.name.charAt(0).toUpperCase()}
//                               </div>
//                               <div>
//                                 <strong>{user.name}</strong>
//                                 <small>{user.email}</small>
//                               </div>
//                             </div>
//                           </td>
//                           <td>
//                             <div className="contact-info">
//                               <span>{user.email}</span>
//                               <small>{user.mobile}</small>
//                             </div>
//                           </td>
//                           <td>
//                             <span className={`role-badge ${user.role.toLowerCase()}`}>
//                               {user.role}
//                               {user.role === 'Other' && user.otherRole && (
//                                 <small> ({user.otherRole})</small>
//                               )}
//                             </span>
//                           </td>
//                           <td>
//                             {new Date(user.createdAt).toLocaleDateString()}
//                             <small>{new Date(user.createdAt).toLocaleTimeString()}</small>
//                           </td>
//                           <td>
//                             <button
//                               className="action-btn approve"
//                               onClick={() => handleVerifyUser(user._id)}
//                               disabled={actionLoading === user._id}
//                             >
//                               {actionLoading === user._id ? (
//                                 <span className="loading-spinner">
//                                   <span className="spinner-sm"></span>
//                                 </span>
//                               ) : (
//                                 '✅ Approve'
//                               )}
//                             </button>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//             </div>
//           )}

//           {activeTab === 'users' && (
//             <div className="data-table-container">
//               <div className="table-header">
//                 <h3>User Management</h3>
//                 <div className="table-actions">
//                   <input 
//                     type="text" 
//                     placeholder="Filter users..." 
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     className="search-input"
//                   />
//                   <button className="refresh-btn" onClick={fetchData}>
//                     🔄 Refresh
//                   </button>
//                 </div>
//               </div>
              
//               <div className="data-table">
//                 <table>
//                   <thead>
//                     <tr>
//                       <th>User</th>
//                       <th>Status</th>
//                       <th>Role</th>
//                       <th>Last Activity</th>
//                       <th>Details</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {filteredUsers.map(user => (
//                       <tr key={user._id}>
//                         <td>
//                           <div className="user-info">
//                             <div className="user-avatar-sm">
//                               {user.name.charAt(0).toUpperCase()}
//                             </div>
//                             <div>
//                               <strong>{user.name}</strong>
//                               <small>{user.email}</small>
//                             </div>
//                           </div>
//                         </td>
//                         <td>{getStatusBadge(user)}</td>
//                         <td>
//                           <span className={`role-badge ${user.role.toLowerCase()}`}>
//                             {user.role}
//                             {user.role === 'Other' && user.otherRole && (
//                               <small> ({user.otherRole})</small>
//                             )}
//                           </span>
//                         </td>
//                         <td>
//                           {user.lastLogin ? (
//                             <div className="activity-time">
//                               {new Date(user.lastLogin).toLocaleDateString()}
//                               <small>{new Date(user.lastLogin).toLocaleTimeString()}</small>
//                             </div>
//                           ) : (
//                             <span className="never-logged">Never</span>
//                           )}
//                         </td>
//                         <td>
//                           <button className="view-btn">
//                             👁️ View
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}

//           {activeTab === 'activities' && (
//             <div className="data-table-container">
//               <div className="table-header">
//                 <h3>User Activities</h3>
//                 <div className="table-actions">
//                   <input 
//                     type="text" 
//                     placeholder="Filter activities..." 
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     className="search-input"
//                   />
//                   <button className="refresh-btn" onClick={fetchData}>
//                     🔄 Refresh
//                   </button>
//                 </div>
//               </div>
              
//               <div className="data-table">
//                 <table>
//                   <thead>
//                     <tr>
//                       <th>Activity</th>
//                       <th>User</th>
//                       <th>Timestamp</th>
//                       <th>IP Address</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {filteredActivities.map(activity => (
//                       <tr key={activity._id}>
//                         <td>
//                           <div className="activity-info">
//                             <span className="activity-icon">
//                               {getActivityIcon(activity.action)}
//                             </span>
//                             <span className="activity-text">
//                               {activity.action.charAt(0).toUpperCase() + activity.action.slice(1)}
//                             </span>
//                           </div>
//                         </td>
//                         <td>
//                           {activity.userId ? (
//                             <div className="user-info">
//                               <div className="user-avatar-sm">
//                                 {activity.userId.name.charAt(0).toUpperCase()}
//                               </div>
//                               <div>
//                                 <strong>{activity.userId.name}</strong>
//                                 <small>{activity.userId.email}</small>
//                               </div>
//                             </div>
//                           ) : (
//                             <span className="unknown-user">System</span>
//                           )}
//                         </td>
//                         <td>
//                           <div className="activity-time">
//                             {new Date(activity.timestamp).toLocaleDateString()}
//                             <small>{new Date(activity.timestamp).toLocaleTimeString()}</small>
//                           </div>
//                         </td>
//                         <td>
//                           <code className="ip-address">{activity.ipAddress || 'N/A'}</code>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Quick Actions Panel */}
//       <div className="quick-actions">
//         <button className="quick-action" onClick={() => setActiveTab('pending')}>
//           <span className="action-icon">⏳</span>
//           <span className="action-text">Pending</span>
//         </button>
//         <button className="quick-action" onClick={() => window.scrollTo(0, 0)}>
//           <span className="action-icon">⬆️</span>
//           <span className="action-text">Top</span>
//         </button>
//         <button className="quick-action" onClick={fetchData}>
//           <span className="action-icon">🔄</span>
//           <span className="action-text">Refresh</span>
//         </button>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminDashboard.css';
import logo from './GG-removebg-preview.png'; // Import your logo here


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
    
    // Check for dark mode preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.body.classList.add('dark-mode');
    }
    
    fetchData();
    createParticles();

    // Cleanup function to remove particles
    return () => {
      const particleSystem = document.querySelector('.particle-system');
      if (particleSystem) {
        particleSystem.innerHTML = '';
      }
    };
  }, [navigate]);

  // Create floating particles
  const createParticles = () => {
    const particleSystem = document.querySelector('.particle-system');
    if (particleSystem) {
      // Clear existing particles
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

      const [pendingResponse, usersResponse, activitiesResponse] = await Promise.all([
        axios.get('https://handwritingbackendnode-yllj.onrender.com/api/admin/pending-users', { headers }),
        axios.get('https://handwritingbackendnode-yllj.onrender.com/api/admin/users', { headers }),
        axios.get('https://handwritingbackendnode-yllj.onrender.com/api/admin/user-activities', { headers })
      ]);

      setPendingUsers(pendingResponse.data);
      setAllUsers(usersResponse.data);
      setUserActivities(activitiesResponse.data);
      
      // Update notifications with current pending count
      setNotifications(prev => [
        {
          ...prev[0],
          text: `${pendingResponse.data.length} registration requests pending approval`
        },
        ...prev.slice(1)
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
      if (error.response?.status === 401) {
        handleLogout();
      }
      showNotification('Error fetching data: ' + (error.response?.data?.error || 'Unknown error'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyUser = async (userId) => {
    setActionLoading(userId);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`https://handwritingbackendnode-yllj.onrender.com/api/admin/verify-user/${userId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      await fetchData();
      showNotification('User verified successfully! Credentials sent via email.', 'success');
    } catch (error) {
      console.error('Error verifying user:', error);
      showNotification('Error verifying user: ' + (error.response?.data?.error || 'Unknown error'), 'error');
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
    // Create a temporary toast notification
    const toast = document.createElement('div');
    toast.className = `toast-notification ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // Trigger the animation
    setTimeout(() => {
      toast.classList.add('show');
    }, 100);
    
    // Remove the toast after 3 seconds
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
    if (!sortConfig.key || !data.length) return data;
    
    return [...data].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];
      
      // Handle nested properties
      if (sortConfig.key === 'userId.name' && a.userId && b.userId) {
        aValue = a.userId.name;
        bValue = b.userId.name;
      }
      
      // Handle string comparison
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      // Handle null/undefined values
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
    return user.isVerified ? (
      <span className="status-badge verified pulse">✅ Verified</span>
    ) : (
      <span className="status-badge pending pulse">⏳ Pending</span>
    );
  };

  const getRoleBadgeClass = (role) => {
    const roleClasses = {
      'Teacher': 'teacher',
      'Student': 'student',
      'Researcher': 'researcher',
      'Other': 'other'
    };
    return roleClasses[role] || 'other';
  };

  const filteredUsers = allUsers.filter(user => 
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPendingUsers = pendingUsers.filter(user => 
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredActivities = userActivities.filter(activity => 
    (activity.userId?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    activity.action?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (activity.ipAddress || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const exportData = () => {
    try {
      const csvData = allUsers.map(user => ({
        Name: user.name || '',
        Email: user.email || '',
        Role: user.role || '',
        Status: user.isVerified ? 'Verified' : 'Pending',
        'Registration Date': user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '',
        'Last Login': user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never',
        Mobile: user.mobile || '',
        'Other Role': user.otherRole || ''
      }));
      
      // Simple CSV export
      const headers = Object.keys(csvData[0]);
      const csvContent = [
        headers.join(','),
        ...csvData.map(row => 
          headers.map(header => {
            const value = row[header] || '';
            // Escape commas and quotes in values
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
      showNotification('Error exporting data', 'error');
    }
  };

  const handleNotificationClick = (notification) => {
    if (notification.type === 'urgent') {
      setActiveTab('pending');
      setNotificationOpen(false);
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMs = now - time;
    const diffInMins = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMins < 60) {
      return `${diffInMins} min ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
  };

  const getSortIconClass = (columnKey) => {
    if (sortConfig.key !== columnKey) return '';
    return sortConfig.direction === 'asc' ? 'asc' : 'desc';
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle click outside notification panel
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
            <span className="logo-icon"></span>
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
                {pendingUsers.length > 0 && (
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
              <h3>{allUsers.length}</h3>
              <p>Total Users</p>
              <div className="stat-progress">
                <div className="progress-bar" style={{ width: '100%' }}></div>
              </div>
            </div>
          </div>
          
          <div className="stat-card pending" data-aos="fade-up" data-aos-delay="100">
            <div className="stat-icon">⏳</div>
            <div className="stat-info">
              <h3>{pendingUsers.length}</h3>
              <p>Pending Approvals</p>
              <div className="stat-progress">
                <div 
                  className="progress-bar warning" 
                  style={{ 
                    width: `${allUsers.length > 0 ? (pendingUsers.length / allUsers.length) * 100 : 0}%`
                  }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="stat-card verified" data-aos="fade-up" data-aos-delay="200">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <h3>{allUsers.filter(u => u.isVerified).length}</h3>
              <p>Verified Users</p>
              <div className="stat-progress">
                <div 
                  className="progress-bar success" 
                  style={{ 
                    width: `${allUsers.length > 0 ? (allUsers.filter(u => u.isVerified).length / allUsers.length) * 100 : 0}%`
                  }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="stat-card cosmic" data-aos="fade-up" data-aos-delay="300">
            <div className="stat-icon">🔑</div>
            <div className="stat-info">
              <h3>{userActivities.filter(a => a.action === 'login').length}</h3>
              <p>Recent Logins</p>
              <div className="stat-progress">
                <div 
                  className="progress-bar cosmic" 
                  style={{ 
                    width: `${Math.min(100, (userActivities.filter(a => a.action === 'login').length / 10) * 100)}%`
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
            <span className="badge">{pendingUsers.length}</span>
          </button>
          
          <button 
            className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <span className="tab-icon">👥</span>
            All Users
            <span className="badge">{allUsers.length}</span>
          </button>
          
          <button 
            className={`tab-btn ${activeTab === 'activities' ? 'active' : ''}`}
            onClick={() => setActiveTab('activities')}
          >
            <span className="tab-icon">📊</span>
            Activities
            <span className="badge">{userActivities.length}</span>
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
              
              {filteredPendingUsers.length === 0 ? (
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
                        <tr key={user._id}>
                          <td>
                            <div className="user-info">
                              <div className="user-avatar-sm">
                                {user.name?.charAt(0)?.toUpperCase() || 'U'}
                              </div>
                              <div>
                                <strong>{user.name || 'Unknown'}</strong>
                                <small>{user.email || 'No email'}</small>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="contact-info">
                              <span>{user.email || 'No email'}</span>
                              <small>{user.mobile || 'No mobile'}</small>
                            </div>
                          </td>
                          <td>
                            <span className={`role-badge ${getRoleBadgeClass(user.role)}`}>
                              {user.role || 'Unknown'}
                              {user.role === 'Other' && user.otherRole && (
                                <small> ({user.otherRole})</small>
                              )}
                            </span>
                          </td>
                          <td>
                            <div className="activity-time">
                              {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                              <small>
                                {user.createdAt ? new Date(user.createdAt).toLocaleTimeString() : ''}
                              </small>
                            </div>
                          </td>
                          <td>
                            <button
                              className="action-btn approve"
                              onClick={() => handleVerifyUser(user._id)}
                              disabled={actionLoading === user._id}
                            >
                              {actionLoading === user._id ? (
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
                      <tr key={user._id}>
                        <td>
                          <div className="user-info">
                            <div className="user-avatar-sm">
                              {user.name?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            <div>
                              <strong>{user.name || 'Unknown'}</strong>
                              <small>{user.email || 'No email'}</small>
                            </div>
                          </div>
                        </td>
                        <td>{getStatusBadge(user)}</td>
                        <td>
                          <span className={`role-badge ${getRoleBadgeClass(user.role)}`}>
                            {user.role || 'Unknown'}
                            {user.role === 'Other' && user.otherRole && (
                              <small> ({user.otherRole})</small>
                            )}
                          </span>
                        </td>
                        <td>
                          {user.lastLogin ? (
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
                      <tr key={activity._id}>
                        <td>
                          <div className="activity-info">
                            <span className="activity-icon">
                              {getActivityIcon(activity.action)}
                            </span>
                            <span className="activity-text">
                              {activity.action ? 
                                activity.action.charAt(0).toUpperCase() + activity.action.slice(1) : 
                                'Unknown'
                              }
                            </span>
                          </div>
                        </td>
                        <td>
                          {activity.userId ? (
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
                            {activity.timestamp ? 
                              new Date(activity.timestamp).toLocaleDateString() : 
                              'Unknown'
                            }
                            <small>
                              {activity.timestamp ? 
                                new Date(activity.timestamp).toLocaleTimeString() : 
                                ''
                              }
                            </small>
                          </div>
                        </td>
                        <td>
                          <code className="ip-address">{activity.ipAddress || 'N/A'}</code>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
