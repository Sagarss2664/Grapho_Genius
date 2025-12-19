import React, { useState, useRef, useEffect } from 'react';
import { Bar, Radar } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler
} from 'chart.js';
import { Upload, FileText, BarChart3, Settings, Brain, Activity, Eye, Zap, Download, TrendingUp } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './AnalysisDashboard.css'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler
);

// FileUpload Component
const ModernFileUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (selectedFile) => {
    if (!selectedFile) return;

    setError('');
    const fileExt = selectedFile.name.split('.').pop().toLowerCase();
    const validExtensions = ['png', 'jpg', 'jpeg'];
    
    if (!validExtensions.includes(fileExt)) {
      setError('Please upload a PNG, JPEG, or JPG file');
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setFile(selectedFile);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileChange(droppedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setIsUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('https://handwriting-backend-239409431927.asia-south1.run.app/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        timeout: 120000
      });

      if (response.data.status === 'success') {
        onUploadSuccess(response.data);
      } else {
        throw new Error(response.data.error || 'Processing failed');
      }
    } catch (err) {
      console.error('Upload error:', err);
      let errorMsg = 'Upload failed';
      if (err.code === 'ECONNABORTED') {
        errorMsg = 'The request took too long. Try a smaller image or check your connection.';
      } else if (err.response) {
        errorMsg = err.response.data?.error || `Server error: ${err.response.status}`;
      } else if (err.message) {
        errorMsg = err.message;
      }
      setError(errorMsg);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="hwa-upload-card">
      <div className="hwa-upload-header">
        <Upload className="hwa-upload-icon" />
        <h3>Upload Handwriting Sample</h3>
        <p>Drag & drop your handwriting image or click to browse</p>
      </div>
      
      <div 
        className={`hwa-drop-zone ${dragActive ? 'hwa-drag-active' : ''} ${file ? 'hwa-has-file' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => document.getElementById('fileInput').click()}
      >
        <input
          id="fileInput"
          type="file"
          onChange={(e) => handleFileChange(e.target.files[0])}
          accept=".png,.jpg,.jpeg"
          disabled={isUploading}
          style={{ display: 'none' }}
        />
        
        {file ? (
          <div className="hwa-file-preview">
            <FileText className="hwa-file-icon" />
            <div>
              <p className="hwa-file-name">{file.name}</p>
              <p className="hwa-file-details">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
          </div>
        ) : (
          <div className="hwa-drop-zone-content">
            <Upload className="hwa-drop-icon" />
            <p>Drop your handwriting image here</p>
            <span>PNG, JPG, JPEG up to 5MB</span>
          </div>
        )}
      </div>

      {error && (
        <div className="hwa-error-message">
          <span>{error}</span>
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={isUploading || !file}
        className={`hwa-upload-button ${isUploading ? 'hwa-uploading' : ''}`}
      >
        {isUploading ? (
          <>
            <div className="hwa-spinner"></div>
            Processing...
          </>
        ) : (
          <>
            <Brain className="hwa-button-icon" />
            Analyze Handwriting
          </>
        )}
      </button>
    </div>
  );
};

// Questionnaire Component
const ModernQuestionnaire = ({ onSubmit }) => {
  const [scores, setScores] = useState({
    Cumulative: 0,
    Investigative: 0,
    Comprehensive: 0,
    Analytical: 0
  });

  const handleScoreChange = (pattern, value) => {
    const numValue = parseFloat(value) || 0;
    setScores(prev => ({
      ...prev,
      [pattern]: Math.min(100, Math.max(0, numValue))
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(scores);
  };

  const scoreIcons = {
    Cumulative: Activity,
    Investigative: Eye,
    Comprehensive: BarChart3,
    Analytical: Zap
  };

  return (
    <div className="hwa-questionnaire-card">
      <div className="hwa-questionnaire-header">
        <Settings className="hwa-questionnaire-icon" />
        <h3>Questionnaire Scores</h3>
        <p>Enter your assessment scores for each category</p>
      </div>
      
      <form onSubmit={handleSubmit} className="hwa-questionnaire-form">
        {Object.entries(scores).map(([pattern, value]) => {
          const IconComponent = scoreIcons[pattern];
          return (
            <div key={pattern} className="hwa-score-input-group">
              <label className="hwa-score-label">
                <IconComponent className="hwa-score-icon" />
                <span>{pattern} Score</span>
              </label>
              <div className="hwa-input-container">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={value}
                  onChange={(e) => handleScoreChange(pattern, e.target.value)}
                  className="hwa-score-input"
                />
                <span className="hwa-input-suffix">%</span>
              </div>
              <div className="hwa-progress-bar">
                <div 
                  className="hwa-progress-fill"
                  style={{ width: `${value}%` }}
                ></div>
              </div>
            </div>
          );
        })}
        
        <button type="submit" className="hwa-submit-button">
          <BarChart3 className="hwa-button-icon" />
          Submit Scores
        </button>
      </form>
    </div>
  );
};

// Weight Slider Component
const ModernWeightSlider = ({ weight, onChange }) => {
  return (
    <div className="hwa-weight-slider-card">
      <div className="hwa-slider-header">
        <Settings className="hwa-slider-icon" />
        <h3>Analysis Weight Distribution</h3>
      </div>
      
      <div className="hwa-weight-display">
        <div className="hwa-weight-item hwa-script-weight">
          <span className="hwa-weight-label">Script Analysis</span>
          <span className="hwa-weight-value">{weight}%</span>
        </div>
        <div className="hwa-weight-item hwa-questionnaire-weight">
          <span className="hwa-weight-label">Questionnaire</span>
          <span className="hwa-weight-value">{100 - weight}%</span>
        </div>
      </div>
      
      <div className="hwa-slider-container">
        <input
          type="range"
          min="0"
          max="100"
          value={weight}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="hwa-weight-slider"
        />
        <div className="hwa-slider-track">
          <div 
            className="hwa-slider-fill"
            style={{ width: `${weight}%` }}
          ></div>
        </div>
      </div>
      
      <div className="hwa-slider-labels">
        <span>0%</span>
        <span>25%</span>
        <span>50%</span>
        <span>75%</span>
        <span>100%</span>
      </div>
    </div>
  );
};

// Add this to your frontend (before any API calls)
axios.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshResponse = await axios.post(
          'https://handwritingbackendnode.onrender.com/api/refresh-token',
          {},
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }}
        );
        
        localStorage.setItem('token', refreshResponse.data.token);
        originalRequest.headers['Authorization'] = `Bearer ${refreshResponse.data.token}`;
        return axios(originalRequest);
      } catch (refreshError) {
        // Redirect to login if refresh fails
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);
// ✅ SIMPLE & SAFE AXIOS INTERCEPTOR

// Client Management Component
const ClientManagement = ({ onClientSelect }) => {
  const [clients, setClients] = useState([]);
  const [newClient, setNewClient] = useState({ name: '', email: '' });
  const [editingClient, setEditingClient] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchClients = async () => {
    try {
      setIsLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Authentication required. Please log in again.');
        setIsLoading(false);
        return;
      }

      console.log('Fetching clients with token:', token.substring(0, 20) + '...');
      
      const response = await axios.get('https://handwritingbackendnode.onrender.com/api/clients', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('API Response:', response);
      console.log('Response data:', response.data);
      
      // Handle different response structures
      let clientsData = response.data;
      
      // If response.data is an object with a clients property
      if (response.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
        console.log('Response is an object, checking for array inside...');
        
        if (response.data.clients && Array.isArray(response.data.clients)) {
          console.log('Found clients array in response.data.clients');
          clientsData = response.data.clients;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          console.log('Found clients array in response.data.data');
          clientsData = response.data.data;
        } else {
          // Try to extract array from object values
          console.log('Checking object values for array...');
          const values = Object.values(response.data);
          if (values.length > 0 && Array.isArray(values[0])) {
            console.log('Found array in object values');
            clientsData = values[0];
          } else {
            console.log('No array found in response, treating as empty');
            clientsData = [];
          }
        }
      }
      
      // Ensure it's an array
      if (!Array.isArray(clientsData)) {
        console.warn('Clients data is not an array, converting to array:', clientsData);
        // If it's a single object, wrap it in an array
        if (clientsData && typeof clientsData === 'object') {
          clientsData = [clientsData];
        } else {
          clientsData = [];
        }
      }
      
      console.log('Final clients data:', clientsData);
      setClients(clientsData);
      
    } catch (err) {
      console.error('Error fetching clients:', err);
      console.error('Error details:', err.response?.data);
      console.error('Error status:', err.response?.status);
      
      let errorMessage = 'Failed to load clients. Please try again.';
      
      if (err.response?.status === 401) {
        errorMessage = 'Session expired. Please log in again.';
        // Redirect to login
        window.location.href = '/login';
      } else if (err.response?.status === 404) {
        errorMessage = 'API endpoint not found. Please check the server.';
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      setClients([]); // Reset to empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateClient = async () => {
    if (!newClient.name || !newClient.email) {
      setError('Please enter both name and email');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Authentication required. Please log in again.');
        setIsLoading(false);
        return;
      }

      console.log('Creating client with data:', newClient);
      
      const response = await axios.post('https://handwritingbackendnode.onrender.com/api/clients', newClient, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Create client response:', response.data);
      
      // Handle different response structures
      const newClientData = response.data?.client || response.data?.data || response.data;
      
      if (newClientData) {
        setClients(prevClients => {
          // Ensure we're working with an array
          const currentClients = Array.isArray(prevClients) ? prevClients : [];
          return [newClientData, ...currentClients];
        });
      }
      
      setNewClient({ name: '', email: '' });
      setSuccess('Client created successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
      
      // Send the form link to the client
      try {
        if (newClientData?._id) {
          await axios.post('https://handwritingbackendnode.onrender.com/api/clients/send-form', {
            clientId: newClientData._id
          }, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
        }
      } catch (emailError) {
        console.error('Error sending form:', emailError);
        // Don't show error to user - creation was successful
      }
      
    } catch (err) {
      console.error('Error creating client:', err);
      console.error('Error response:', err.response?.data);
      
      if (err.response?.status === 401) {
        setError('Session expired. Please log in again.');
        window.location.href = '/login';
      } else if (err.response?.status === 404) {
        setError('API endpoint not found. Please check the server.');
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to create client. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClient = (client) => {
    setEditingClient(client);
    setNewClient({ name: client.name, email: client.email });
  };

  const handleUpdateClient = async () => {
    if (!editingClient || !newClient.name || !newClient.email) {
      setError('Please enter both name and email');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Authentication required. Please log in again.');
        setIsLoading(false);
        return;
      }

      const clientId = editingClient._id || editingClient.id;
      if (!clientId) {
        setError('Invalid client data');
        setIsLoading(false);
        return;
      }

      console.log('Updating client:', clientId, 'with data:', newClient);
      
      const response = await axios.put(`https://handwritingbackendnode.onrender.com/api/clients/${clientId}`, newClient, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Update client response:', response.data);
      
      const updatedClient = response.data?.client || response.data?.data || response.data;
      
      setClients(prevClients => {
        if (!Array.isArray(prevClients)) return [updatedClient];
        return prevClients.map(c => {
          const currentId = c._id || c.id;
          return currentId === clientId ? updatedClient : c;
        });
      });
      
      setEditingClient(null);
      setNewClient({ name: '', email: '' });
      setSuccess('Client updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error updating client:', err);
      setError(err.response?.data?.error || 'Failed to update client');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClient = async (clientId) => {
    if (!window.confirm('Are you sure you want to delete this client?')) {
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Authentication required. Please log in again.');
        setIsLoading(false);
        return;
      }

      console.log('Deleting client:', clientId);
      
      await axios.delete(`https://handwritingbackendnode.onrender.com/api/clients/${clientId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      setClients(prevClients => {
        if (!Array.isArray(prevClients)) return [];
        return prevClients.filter(c => {
          const currentId = c._id || c.id;
          return currentId !== clientId;
        });
      });
      
      setSuccess('Client deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error deleting client:', err);
      setError(err.response?.data?.error || 'Failed to delete client');
    } finally {
      setIsLoading(false);
    }
  };

  const cancelEdit = () => {
    setEditingClient(null);
    setNewClient({ name: '', email: '' });
  };

  useEffect(() => {
    console.log('ClientManagement component mounted');
    console.log('Token exists:', !!localStorage.getItem('token'));
    fetchClients();
  }, []);

  // Safe rendering of clients
  const renderClients = () => {
    if (!Array.isArray(clients)) {
      console.error('clients is not an array:', clients);
      return <div className="hwa-no-clients">Error: Clients data format is invalid</div>;
    }

    if (clients.length === 0) {
      return <div className="hwa-no-clients">No clients yet. Add your first client above.</div>;
    }

    return (
      <ul className="hwa-clients-list">
        {clients.map((client, index) => {
          // Ensure client has required properties
          if (!client || typeof client !== 'object') {
            console.warn('Invalid client data at index', index, ':', client);
            return null;
          }
          
          const clientId = client._id || client.id || `client-${index}`;
          const clientName = client.name || 'Unnamed Client';
          const clientEmail = client.email || 'No email';
          const hasScores = client.questionnaireScores || client.scriptScores || client.combinedScores;
          
          return (
            <li key={clientId} className="hwa-client-item">
              <div className="hwa-client-info" onClick={() => onClientSelect(client)}>
                <span className="hwa-client-name">{clientName}</span>
                <span className="hwa-client-email">{clientEmail}</span>
              </div>
              <div className="hwa-client-actions">
                <button 
                  className="hwa-edit-button"
                  onClick={() => handleEditClient(client)}
                  disabled={isLoading}
                >
                  Edit
                </button>
                <button 
                  className="hwa-delete-button"
                  onClick={() => handleDeleteClient(clientId)}
                  disabled={isLoading}
                >
                  Delete
                </button>
                <div className="hwa-client-status">
                  {hasScores ? (
                    <span className="hwa-status-completed">✓ Completed</span>
                  ) : (
                    <span className="hwa-status-pending">⏳ Pending</span>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className="hwa-client-management-card">
      <div className="hwa-client-header">
        <h3>Client Management</h3>
        <p>Manage your handwriting analysis clients</p>
      </div>

      {error && (
        <div className="hwa-error-message">
          <span>{error}</span>
        </div>
      )}
      
      {success && (
        <div className="hwa-success-message">
          <span>{success}</span>
        </div>
      )}

      <div className="hwa-client-form">
        <div className="hwa-form-group">
          <label>Client Name</label>
          <input
            type="text"
            value={newClient.name}
            onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
            placeholder="Enter client name"
            disabled={isLoading}
          />
        </div>
        <div className="hwa-form-group">
          <label>Client Email</label>
          <input
            type="email"
            value={newClient.email}
            onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
            placeholder="Enter client email"
            disabled={isLoading}
          />
        </div>
        {editingClient ? (
          <div className="hwa-edit-buttons">
            <button
              onClick={handleUpdateClient}
              disabled={isLoading}
              className="hwa-update-client-button"
            >
              {isLoading ? 'Updating...' : 'Update Client'}
            </button>
            <button
              onClick={cancelEdit}
              disabled={isLoading}
              className="hwa-cancel-edit-button"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={handleCreateClient}
            disabled={isLoading}
            className="hwa-add-client-button"
          >
            {isLoading ? 'Adding...' : 'Add Client & Send Form'}
          </button>
        )}
      </div>

      <div className="hwa-client-list">
        <h4>Your Clients</h4>
        {isLoading && (!clients || clients.length === 0) ? (
          <div className="hwa-loading-clients">Loading clients...</div>
        ) : (
          renderClients()
        )}
      </div>
    </div>
  );
};

// Enhanced Results Component with PDF Generation
const ModernResults = ({ scriptScores, questionnaireScores, combinedScores, mImages }) => {
  const resultsRef = useRef();
  const scriptChartRef = useRef();
  const radarChartRef = useRef();
  const questionnaireChartRef = useRef();

  if (!scriptScores) return null;

  const chartColors = {
    script: {
      background: 'rgba(99, 102, 241, 0.8)',
      border: 'rgb(99, 102, 241)'
    },
    combined: {
      background: 'rgba(16, 185, 129, 0.8)',
      border: 'rgb(16, 185, 129)'
    },
    questionnaire: {
      background: 'rgba(245, 101, 101, 0.8)',
      border: 'rgb(245, 101, 101)'
    }
  };

  const scriptBarData = {
    labels: Object.keys(scriptScores),
    datasets: [
      {
        label: 'Script Analysis',
        data: Object.values(scriptScores).map(score => score || 0),
        backgroundColor: chartColors.script.background,
        borderColor: chartColors.script.border,
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false
      }
    ]
  };

  const questionnaireBarData = questionnaireScores ? {
    labels: Object.keys(questionnaireScores),
    datasets: [
      {
        label: 'Questionnaire Scores',
        data: Object.values(questionnaireScores).map(score => score || 0),
        backgroundColor: chartColors.questionnaire.background,
        borderColor: chartColors.questionnaire.border,
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false
      }
    ]
  } : null;

  const radarData = combinedScores ? {
    labels: Object.keys(combinedScores),
    datasets: [
      {
        label: 'Script Analysis',
        data: Object.keys(combinedScores).map(key => scriptScores[key] || 0),
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        borderColor: 'rgb(99, 102, 241)',
        pointBackgroundColor: 'rgb(99, 102, 241)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(99, 102, 241)',
        borderWidth: 2
      },
      questionnaireScores && {
        label: 'Questionnaire',
        data: Object.keys(combinedScores).map(key => questionnaireScores[key] || 0),
        backgroundColor: 'rgba(245, 101, 101, 0.2)',
        borderColor: 'rgb(245, 101, 101)',
        pointBackgroundColor: 'rgb(245, 101, 101)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(245, 101, 101)',
        borderWidth: 2
      },
      {
        label: 'Combined Analysis',
        data: Object.values(combinedScores).map(score => score || 0),
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        borderColor: 'rgb(16, 185, 129)',
        pointBackgroundColor: 'rgb(16, 185, 129)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(16, 185, 129)',
        borderWidth: 2
      }
    ].filter(Boolean)
  } : null;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${(context.parsed.y || 0).toFixed(1)}%`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          callback: function(value) {
            return value + '%';
          }
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${(context.parsed.r || 0).toFixed(1)}%`;
          }
        }
      }
    },
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        pointLabels: {
          font: {
            size: 11
          }
        },
        ticks: {
          callback: function(value) {
            return value + '%';
          },
          font: {
            size: 10
          }
        }
      }
    }
  };

  const generatePDF = async () => {
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      let yPosition = 20;
      const lineHeight = 6;

      const addWrappedText = (text, x, y, maxWidth, fontSize = 11) => {
        pdf.setFontSize(fontSize);
        const lines = pdf.splitTextToSize(text, maxWidth);
        let currentY = y;
        lines.forEach(line => {
          if (currentY > pageHeight - 20) {
            pdf.addPage();
            currentY = 20;
          }
          pdf.text(line, x, currentY);
          currentY += lineHeight;
        });
        return currentY;
      };

      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Handwriting Analysis Report', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 15;

      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'normal');
      const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      pdf.text(`Generated on: ${currentDate}`, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 30;

      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Script Analysis Results', 20, yPosition);
      yPosition += 15;

      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      Object.entries(scriptScores).forEach(([pattern, score]) => {
        pdf.text(`${pattern}: ${(score || 0).toFixed(1)}%`, 25, yPosition);
        yPosition += 8;
      });
      yPosition += 10;

      if (scriptChartRef.current) {
        try {
          const scriptCanvas = await html2canvas(scriptChartRef.current, { 
            scale: 2, 
            useCORS: true, 
            allowTaint: true, 
            backgroundColor: '#ffffff' 
          });
          const scriptImgData = scriptCanvas.toDataURL('image/png');
          const imgWidth = pageWidth - 40;
          const imgHeight = Math.min((scriptCanvas.height * imgWidth) / scriptCanvas.width, 80);
          if (yPosition + imgHeight > pageHeight - 20) {
            pdf.addPage();
            yPosition = 20;
          }
          pdf.addImage(scriptImgData, 'PNG', 20, yPosition, imgWidth, imgHeight);
          yPosition += imgHeight + 15;
        } catch (error) {
          console.warn('Could not add script chart to PDF:', error);
        }
      }

      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'italic');
      pdf.text('This report is generated by GraphoGenius', pageWidth / 2, pageHeight - 10, { align: 'center' });

      const filename = `handwriting-analysis-report-${currentDate.replace(/\s/g, '-').replace(/,/g, '')}.pdf`;
      pdf.save(filename);

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  return (
    <div className="hwa-results-section" ref={resultsRef}>
      <div className="hwa-results-header">
        <div className="hwa-results-title">
          <BarChart3 className="hwa-results-icon" />
          <h2>Analysis Results</h2>
        </div>
        <button 
          className="hwa-download-pdf-btn" 
          onClick={generatePDF}
        >
          <Download className="hwa-button-icon" />
          Download Report
        </button>
      </div>
      
      <div className="hwa-results-grid">
        <div className="hwa-chart-card">
          <div className="hwa-card-header">
            <FileText className="hwa-card-icon" />
            <h3>Script Analysis Overview</h3>
          </div>
          <div className="hwa-chart-container" ref={scriptChartRef}>
            <Bar data={scriptBarData} options={chartOptions} />
          </div>
          <div className="hwa-scores-grid">
            {Object.entries(scriptScores).map(([pattern, score]) => (
              <div key={pattern} className="hwa-score-card">
                <span className="hwa-score-pattern">{pattern}</span>
                <span className="hwa-score-value">{(score || 0).toFixed(1)}%</span>
                <div className="hwa-score-bar">
                  <div 
                    className="hwa-score-fill"
                    style={{ width: `${score || 0}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {questionnaireScores && (
          <div className="hwa-chart-card">
            <div className="hwa-card-header">
              <TrendingUp className="hwa-card-icon" />
              <h3>Questionnaire Scores</h3>
            </div>
            <div className="hwa-chart-container" ref={questionnaireChartRef}>
              <Bar data={questionnaireBarData} options={chartOptions} />
            </div>
            <div className="hwa-scores-grid">
              {Object.entries(questionnaireScores).map(([pattern, score]) => (
                <div key={pattern} className="hwa-score-card hwa-questionnaire">
                  <span className="hwa-score-pattern">{pattern}</span>
                  <span className="hwa-score-value">{(score || 0)}%</span>
                  <div className="hwa-score-bar">
                    <div 
                      className="hwa-score-fill hwa-questionnaire"
                      style={{ width: `${score || 0}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {combinedScores && (
          <div className="hwa-chart-card hwa-full-width">
            <div className="hwa-card-header">
              <BarChart3 className="hwa-card-icon" />
              <h3>Comprehensive Analysis</h3>
            </div>
            <div className="hwa-chart-container hwa-radar-container" ref={radarChartRef}>
              <Radar data={radarData} options={radarOptions} />
            </div>
            <div className="hwa-scores-grid">
              {Object.entries(combinedScores).map(([pattern, score]) => (
                <div key={pattern} className="hwa-score-card hwa-combined">
                  <span className="hwa-score-pattern">{pattern}</span>
                  <span className="hwa-score-value">{(score || 0).toFixed(1)}%</span>
                  <div className="hwa-score-bar">
                    <div 
                      className="hwa-score-fill hwa-combined"
                      style={{ width: `${score || 0}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Main Dashboard Component
const Dashboard = () => {
  const [scriptScores, setScriptScores] = useState(null);
  const [questionnaireScores, setQuestionnaireScores] = useState(null);
  const [combinedScores, setCombinedScores] = useState(null);
  const [mImages, setMImages] = useState(null);
  const [weight, setWeight] = useState(50);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedClient, setSelectedClient] = useState(null);
  const [showClientManagement, setShowClientManagement] = useState(false);

  useEffect(() => {
    console.log('Dashboard mounted, checking authentication...');
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');
    
    if (!token || userType !== 'user') {
      console.log('No token or wrong user type, redirecting...');
      window.location.href = '/user-login';
    }
  }, []);

  const checkForResponses = async (client) => {
    try {
      setIsAnalyzing(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert('Authentication required. Please log in again.');
        window.location.href = '/user-login';
        return;
      }

      const clientId = client._id || client.id;
      if (!clientId) {
        alert('Invalid client data');
        return;
      }

      const response = await axios.get(`https://handwritingbackendnode.onrender.com/api/clients/${clientId}/check-responses`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Check responses response:', response.data);
      
      if (response.data.updated) {
        const updatedClient = response.data.client;
        setQuestionnaireScores(updatedClient.questionnaireScores || null);
        setCombinedScores(updatedClient.combinedScores || null);
        setCurrentStep(3);
        alert('Questionnaire responses found and updated!');
      } else {
        alert('No new responses found yet.');
      }
    } catch (err) {
      console.error('Error checking responses:', err);
      alert('Failed to check responses. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClientSelect = (client) => {
    console.log('Client selected:', client);
    setSelectedClient(client);
    setQuestionnaireScores(client.questionnaireScores || null);
    setScriptScores(client.scriptScores || null);
    setCombinedScores(client.combinedScores || null);
    setWeight(client.weight || 50);
    setCurrentStep(client.scriptScores ? 3 : 1);
    setShowClientManagement(false);
  };

  const handleUploadSuccess = async (data) => {
    console.log('Upload success:', data);
    setScriptScores(data.script_scores || data.scriptScores);
    setMImages(data.m_images || data.mImages);
    setQuestionnaireScores(null);
    setCombinedScores(null);
    setCurrentStep(2);
    
    if (selectedClient) {
      try {
        const token = localStorage.getItem('token');
        const clientId = selectedClient._id || selectedClient.id;
        
        if (!token || !clientId) return;

        await axios.put(`https://handwritingbackendnode.onrender.com/api/clients/${clientId}`, {
          scriptScores: data.script_scores || data.scriptScores
        }, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      } catch (err) {
        console.error('Error updating client with script scores:', err);
      }
    }
  };

  const handleQuestionnaireSubmit = async (scores) => {
    setQuestionnaireScores(scores);
    setIsAnalyzing(true);
    setCurrentStep(3);
    
    try {
      const combined = {};
      if (scriptScores) {
        Object.keys(scriptScores).forEach(key => {
          const scriptValue = scriptScores[key] || 0;
          const questionnaireValue = scores[key] || 0;
          combined[key] = (scriptValue * weight / 100) + (questionnaireValue * (100 - weight) / 100);
        });
      }
      
      setCombinedScores(combined);
      
      if (selectedClient) {
        const token = localStorage.getItem('token');
        const clientId = selectedClient._id || selectedClient.id;
        
        if (!token || !clientId) {
          console.warn('No token or client ID for saving analysis');
          return;
        }

        await axios.put(`https://handwritingbackendnode.onrender.com/api/clients/${clientId}`, {
          questionnaireScores: scores,
          combinedScores: combined,
          weight
        }, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }
    } catch (err) {
      console.error('Error saving analysis:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleWeightChange = async (newWeight) => {
    setWeight(newWeight);
    
    if (questionnaireScores && scriptScores) {
      const combined = {};
      Object.keys(scriptScores).forEach(key => {
        const scriptValue = scriptScores[key] || 0;
        const questionnaireValue = questionnaireScores[key] || 0;
        combined[key] = (scriptValue * newWeight / 100) + (questionnaireValue * (100 - newWeight) / 100);
      });
      
      setCombinedScores(combined);
      
      if (selectedClient) {
        try {
          const token = localStorage.getItem('token');
          const clientId = selectedClient._id || selectedClient.id;
          
          if (!token || !clientId) return;

          await axios.put(`https://handwritingbackendnode.onrender.com/api/clients/${clientId}`, {
            weight: newWeight,
            combinedScores: combined
          }, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
        } catch (err) {
          console.error('Error updating weights:', err);
        }
      }
    }
  };

  return (
    <div className="hwa-dashboard-container">
      <div className="hwa-dashboard-header">
        <h1 className="hwa-dashboard-title">Handwriting Analysis</h1>
        <p className="hwa-dashboard-subtitle">Advanced AI-powered personality insights from handwriting patterns</p>
        
        
      </div>

      {showClientManagement && (
        <div className="hwa-client-management-modal">
          <div className="hwa-modal-content">
            <button 
              className="hwa-close-modal"
              onClick={() => setShowClientManagement(false)}
            >
              &times;
            </button>
            <ClientManagement onClientSelect={handleClientSelect} />
          </div>
        </div>
      )}

      <div className="hwa-progress-indicator">
        <div className={`hwa-progress-step ${currentStep >= 1 ? 'hwa-active' : ''} ${scriptScores ? 'hwa-completed' : ''}`}>
          <Upload className="hwa-button-icon" />
          <span>Upload Sample</span>
        </div>
        <div className={`hwa-progress-step ${currentStep >= 2 ? 'hwa-active' : ''} ${questionnaireScores ? 'hwa-completed' : ''}`}>
          <Settings className="hwa-button-icon" />
          <span>Questionnaire</span>
        </div>
        <div className={`hwa-progress-step ${currentStep >= 3 ? 'hwa-active' : ''} ${combinedScores ? 'hwa-completed' : ''}`}>
          <BarChart3 className="hwa-button-icon" />
          <span>Analysis</span>
        </div>
      </div>

      <div className="hwa-main-content">
        <div className="hwa-input-section">
          {!selectedClient ? (
            <div className="hwa-select-client-prompt">
              <p>Please select a client to begin analysis</p>
              <button 
                onClick={() => setShowClientManagement(true)}
                className="hwa-select-client-button"
              >
                Select Client
              </button>
            </div>
          ) : (
            <>
              <ModernFileUpload onUploadSuccess={handleUploadSuccess} />
              
              {scriptScores && (
                <>
                  {questionnaireScores ? (
                    <div className="hwa-questionnaire-completed">
                      <h3>Questionnaire Completed</h3>
                      <p>The client has submitted their questionnaire responses.</p>
                    </div>
                  ) : (
                    <div className="hwa-questionnaire-pending">
                      <h3>Questionnaire Pending</h3>
                      <p>Waiting for client to complete the questionnaire.</p>
                      <p>An email with the form link has been sent to {selectedClient.email || 'the client'}.</p>
                      <button 
                        onClick={() => checkForResponses(selectedClient)}
                        className="hwa-check-responses-btn"
                      >
                        Check for Responses
                      </button>
                    </div>
                  )}
                  
                  <ModernWeightSlider weight={weight} onChange={handleWeightChange} />
                </>
              )}
            </>
          )}
        </div>
        
        {selectedClient && scriptScores && (
          <ModernResults
            scriptScores={scriptScores}
            questionnaireScores={questionnaireScores}
            combinedScores={combinedScores}
            mImages={mImages}
          />
        )}
        
        {isAnalyzing && (
          <div className="hwa-loading-overlay">
            <div className="hwa-loading-content">
              <div className="hwa-loading-spinner"></div>
              <div>Analyzing handwriting patterns...</div>
              <div className="hwa-loading-subtitle">
                Processing psychological insights from your handwriting
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
