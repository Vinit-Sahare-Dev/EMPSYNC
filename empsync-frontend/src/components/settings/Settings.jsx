// src/components/settings/Settings.jsx
import React, { useState, useEffect } from 'react';
import { useToast } from '../ui/Toast';
import { empSyncAPI } from '../../services/apiService';
import '../../styles/Settings.css';

const Settings = () => {
  const [settings, setSettings] = useState({
    // Application Settings
    appName: 'EMPSYNC',
    companyName: 'Your Company',
    currency: 'INR',
    dateFormat: 'DD/MM/YYYY',
    timezone: 'Asia/Kolkata',
    
    // Notification Settings
    emailNotifications: true,
    pushNotifications: false,
    salaryUpdateAlerts: true,
    newEmployeeAlerts: true,
    
    // Data & Sync Settings
    autoSync: true,
    syncInterval: 30,
    backupEnabled: true,
    backupFrequency: 'daily',
    
    // Security Settings
    sessionTimeout: 60,
    twoFactorAuth: false,
    passwordPolicy: 'medium',
    
    // API Settings
    apiUrl: 'http://localhost:8888/api',
    apiTimeout: 10000,
    
    // Display Settings
    theme: 'light',
    language: 'en',
    itemsPerPage: 10,
  });

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [connectionStatus, setConnectionStatus] = useState('unknown');
  const { showToast } = useToast();

  useEffect(() => {
    loadSavedSettings();
    testBackendConnection();
  }, []);

  const loadSavedSettings = () => {
    try {
      const savedSettings = localStorage.getItem('empsync-settings');
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsedSettings }));
      }
    } catch (error) {
      console.error('Error loading saved settings:', error);
    }
  };

  const testBackendConnection = async () => {
    try {
      setConnectionStatus('testing');
      const result = await empSyncAPI.healthCheck();
      setConnectionStatus(result.success ? 'connected' : 'failed');
    } catch (error) {
      setConnectionStatus('failed');
    }
  };

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const saveSettings = async () => {
    setLoading(true);
    try {
      // Save to localStorage
      localStorage.setItem('empsync-settings', JSON.stringify(settings));
      
      // If API URL changed, update the API client
      if (settings.apiUrl !== empSyncAPI.client.defaults.baseURL) {
        empSyncAPI.client.defaults.baseURL = settings.apiUrl;
        showToast('info', 'API URL updated. Testing connection...');
        await testBackendConnection();
      }
      
      showToast('success', 'Settings saved successfully!');
    } catch (error) {
      showToast('error', 'Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const resetSettings = () => {
    if (window.confirm('Are you sure you want to reset all settings to default?')) {
      localStorage.removeItem('empsync-settings');
      setSettings({
        appName: 'EMPSYNC',
        companyName: 'Your Company',
        currency: 'INR',
        dateFormat: 'DD/MM/YYYY',
        timezone: 'Asia/Kolkata',
        emailNotifications: true,
        pushNotifications: false,
        salaryUpdateAlerts: true,
        newEmployeeAlerts: true,
        autoSync: true,
        syncInterval: 30,
        backupEnabled: true,
        backupFrequency: 'daily',
        sessionTimeout: 60,
        twoFactorAuth: false,
        passwordPolicy: 'medium',
        apiUrl: 'http://localhost:8888/api',
        apiTimeout: 10000,
        theme: 'light',
        language: 'en',
        itemsPerPage: 10,
      });
      showToast('info', 'Settings reset to defaults');
    }
  };

  const exportData = () => {
    try {
      const employees = localStorage.getItem('employees');
      const settings = localStorage.getItem('empsync-settings');
      
      const exportData = {
        employees: employees ? JSON.parse(employees) : [],
        settings: settings ? JSON.parse(settings) : {},
        exportDate: new Date().toISOString()
      };
      
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `empsync-backup-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
      
      showToast('success', 'Data exported successfully!');
    } catch (error) {
      showToast('error', 'Failed to export data');
    }
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        
        if (data.employees) {
          localStorage.setItem('employees', JSON.stringify(data.employees));
        }
        if (data.settings) {
          localStorage.setItem('empsync-settings', JSON.stringify(data.settings));
          setSettings(prev => ({ ...prev, ...data.settings }));
        }
        
        showToast('success', 'Data imported successfully!');
        // Reset file input
        event.target.value = '';
      } catch (error) {
        showToast('error', 'Invalid backup file');
      }
    };
    reader.readAsText(file);
  };

  const clearAllData = () => {
    if (window.confirm('⚠️ DANGER: This will delete ALL employee data and cannot be undone. Are you sure?')) {
      localStorage.removeItem('employees');
      showToast('warning', 'All employee data has been cleared');
      // Refresh the page to reflect changes
      setTimeout(() => window.location.reload(), 2000);
    }
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return '#27ae60';
      case 'failed': return '#e74c3c';
      case 'testing': return '#f39c12';
      default: return '#95a5a6';
    }
  };

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return 'Connected to Backend';
      case 'failed': return 'Connection Failed';
      case 'testing': return 'Testing Connection...';
      default: return 'Unknown Status';
    }
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1>Settings & Configuration</h1>
        <p>Manage your EMPSYNC application preferences and system configuration</p>
      </div>

      <div className="settings-layout">
        {/* Sidebar Navigation */}
        <div className="settings-sidebar">
          <div className="sidebar-section">
            <h3>Application</h3>
            <button 
              className={`sidebar-tab ${activeTab === 'general' ? 'active' : ''}`}
              onClick={() => setActiveTab('general')}
            >
              ⚙️ General Settings
            </button>
            <button 
              className={`sidebar-tab ${activeTab === 'notifications' ? 'active' : ''}`}
              onClick={() => setActiveTab('notifications')}
            >
              🔔 Notifications
            </button>
            <button 
              className={`sidebar-tab ${activeTab === 'display' ? 'active' : ''}`}
              onClick={() => setActiveTab('display')}
            >
              🎨 Display
            </button>
          </div>

          <div className="sidebar-section">
            <h3>System</h3>
            <button 
              className={`sidebar-tab ${activeTab === 'api' ? 'active' : ''}`}
              onClick={() => setActiveTab('api')}
            >
              🔌 API & Integration
            </button>
            <button 
              className={`sidebar-tab ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              🔒 Security
            </button>
            <button 
              className={`sidebar-tab ${activeTab === 'data' ? 'active' : ''}`}
              onClick={() => setActiveTab('data')}
            >
              💾 Data Management
            </button>
          </div>

          <div className="sidebar-section">
            <h3>Actions</h3>
            <button className="sidebar-action" onClick={saveSettings} disabled={loading}>
              💾 {loading ? 'Saving...' : 'Save Settings'}
            </button>
            <button className="sidebar-action secondary" onClick={resetSettings}>
              🔄 Reset to Defaults
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="settings-content">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="settings-section">
              <h2>General Settings</h2>
              <div className="settings-grid">
                <div className="setting-item">
                  <label>Application Name</label>
                  <input
                    type="text"
                    value={settings.appName}
                    onChange={(e) => handleSettingChange('appName', e.target.value)}
                    placeholder="EMPSYNC"
                  />
                </div>

                <div className="setting-item">
                  <label>Company Name</label>
                  <input
                    type="text"
                    value={settings.companyName}
                    onChange={(e) => handleSettingChange('companyName', e.target.value)}
                    placeholder="Your Company"
                  />
                </div>

                <div className="setting-item">
                  <label>Currency</label>
                  <select
                    value={settings.currency}
                    onChange={(e) => handleSettingChange('currency', e.target.value)}
                  >
                    <option value="INR">Indian Rupee (₹)</option>
                    <option value="USD">US Dollar ($)</option>
                    <option value="EUR">Euro (€)</option>
                    <option value="GBP">British Pound (£)</option>
                  </select>
                </div>

                <div className="setting-item">
                  <label>Date Format</label>
                  <select
                    value={settings.dateFormat}
                    onChange={(e) => handleSettingChange('dateFormat', e.target.value)}
                  >
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>

                <div className="setting-item">
                  <label>Timezone</label>
                  <select
                    value={settings.timezone}
                    onChange={(e) => handleSettingChange('timezone', e.target.value)}
                  >
                    <option value="Asia/Kolkata">India (IST)</option>
                    <option value="America/New_York">Eastern Time (ET)</option>
                    <option value="Europe/London">London (GMT)</option>
                    <option value="Asia/Tokyo">Tokyo (JST)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <div className="settings-section">
              <h2>Notification Settings</h2>
              <div className="settings-grid">
                <div className="setting-toggle">
                  <label>
                    <input
                      type="checkbox"
                      checked={settings.emailNotifications}
                      onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                    />
                    <span className="toggle-label">Email Notifications</span>
                  </label>
                  <p className="setting-description">Receive important updates via email</p>
                </div>

                <div className="setting-toggle">
                  <label>
                    <input
                      type="checkbox"
                      checked={settings.pushNotifications}
                      onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
                    />
                    <span className="toggle-label">Push Notifications</span>
                  </label>
                  <p className="setting-description">Browser push notifications</p>
                </div>

                <div className="setting-toggle">
                  <label>
                    <input
                      type="checkbox"
                      checked={settings.salaryUpdateAlerts}
                      onChange={(e) => handleSettingChange('salaryUpdateAlerts', e.target.checked)}
                    />
                    <span className="toggle-label">Salary Update Alerts</span>
                  </label>
                  <p className="setting-description">Get notified when salaries are updated</p>
                </div>

                <div className="setting-toggle">
                  <label>
                    <input
                      type="checkbox"
                      checked={settings.newEmployeeAlerts}
                      onChange={(e) => handleSettingChange('newEmployeeAlerts', e.target.checked)}
                    />
                    <span className="toggle-label">New Employee Alerts</span>
                  </label>
                  <p className="setting-description">Notifications when new employees are added</p>
                </div>
              </div>
            </div>
          )}

          {/* Display Settings */}
          {activeTab === 'display' && (
            <div className="settings-section">
              <h2>Display Settings</h2>
              <div className="settings-grid">
                <div className="setting-item">
                  <label>Theme</label>
                  <select
                    value={settings.theme}
                    onChange={(e) => handleSettingChange('theme', e.target.value)}
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="auto">Auto (System)</option>
                  </select>
                </div>

                <div className="setting-item">
                  <label>Language</label>
                  <select
                    value={settings.language}
                    onChange={(e) => handleSettingChange('language', e.target.value)}
                  >
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                  </select>
                </div>

                <div className="setting-item">
                  <label>Items Per Page</label>
                  <select
                    value={settings.itemsPerPage}
                    onChange={(e) => handleSettingChange('itemsPerPage', parseInt(e.target.value))}
                  >
                    <option value={10}>10 items</option>
                    <option value={25}>25 items</option>
                    <option value={50}>50 items</option>
                    <option value={100}>100 items</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* API & Integration Settings */}
          {activeTab === 'api' && (
            <div className="settings-section">
              <h2>API & Integration Settings</h2>
              
              <div className="connection-status">
                <div className="status-indicator" style={{ backgroundColor: getConnectionStatusColor() }}></div>
                <span>{getConnectionStatusText()}</span>
                <button onClick={testBackendConnection} className="test-connection-btn">
                  Test Connection
                </button>
              </div>

              <div className="settings-grid">
                <div className="setting-item">
                  <label>API Base URL</label>
                  <input
                    type="url"
                    value={settings.apiUrl}
                    onChange={(e) => handleSettingChange('apiUrl', e.target.value)}
                    placeholder="http://localhost:8888/api"
                  />
                </div>

                <div className="setting-item">
                  <label>API Timeout (ms)</label>
                  <input
                    type="number"
                    value={settings.apiTimeout}
                    onChange={(e) => handleSettingChange('apiTimeout', parseInt(e.target.value))}
                    min="1000"
                    max="30000"
                  />
                </div>

                <div className="setting-toggle">
                  <label>
                    <input
                      type="checkbox"
                      checked={settings.autoSync}
                      onChange={(e) => handleSettingChange('autoSync', e.target.checked)}
                    />
                    <span className="toggle-label">Auto Sync</span>
                  </label>
                  <p className="setting-description">Automatically sync data with backend</p>
                </div>

                <div className="setting-item">
                  <label>Sync Interval (seconds)</label>
                  <input
                    type="number"
                    value={settings.syncInterval}
                    onChange={(e) => handleSettingChange('syncInterval', parseInt(e.target.value))}
                    min="10"
                    max="3600"
                    disabled={!settings.autoSync}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <div className="settings-section">
              <h2>Security Settings</h2>
              <div className="settings-grid">
                <div className="setting-item">
                  <label>Session Timeout (minutes)</label>
                  <input
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                    min="5"
                    max="480"
                  />
                </div>

                <div className="setting-toggle">
                  <label>
                    <input
                      type="checkbox"
                      checked={settings.twoFactorAuth}
                      onChange={(e) => handleSettingChange('twoFactorAuth', e.target.checked)}
                    />
                    <span className="toggle-label">Two-Factor Authentication</span>
                  </label>
                  <p className="setting-description">Add an extra layer of security to your account</p>
                </div>

                <div className="setting-item">
                  <label>Password Policy</label>
                  <select
                    value={settings.passwordPolicy}
                    onChange={(e) => handleSettingChange('passwordPolicy', e.target.value)}
                  >
                    <option value="low">Low (6+ characters)</option>
                    <option value="medium">Medium (8+ characters, mixed case)</option>
                    <option value="high">High (12+ characters, special characters)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Data Management */}
          {activeTab === 'data' && (
            <div className="settings-section">
              <h2>Data Management</h2>
              
              <div className="data-actions">
                <div className="data-action-card">
                  <h3>📤 Export Data</h3>
                  <p>Download all your employee data as a backup file</p>
                  <button onClick={exportData} className="btn btn-primary">
                    Export Data
                  </button>
                </div>

                <div className="data-action-card">
                  <h3>📥 Import Data</h3>
                  <p>Restore employee data from a backup file</p>
                  <label className="file-upload-btn">
                    Choose File
                    <input
                      type="file"
                      accept=".json"
                      onChange={importData}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>

                <div className="data-action-card danger">
                  <h3>🗑️ Clear All Data</h3>
                  <p>Permanently delete all employee data</p>
                  <button onClick={clearAllData} className="btn btn-danger">
                    Clear Data
                  </button>
                </div>
              </div>

              <div className="settings-grid" style={{ marginTop: '2rem' }}>
                <div className="setting-toggle">
                  <label>
                    <input
                      type="checkbox"
                      checked={settings.backupEnabled}
                      onChange={(e) => handleSettingChange('backupEnabled', e.target.checked)}
                    />
                    <span className="toggle-label">Automatic Backups</span>
                  </label>
                  <p className="setting-description">Automatically create backups of your data</p>
                </div>

                <div className="setting-item">
                  <label>Backup Frequency</label>
                  <select
                    value={settings.backupFrequency}
                    onChange={(e) => handleSettingChange('backupFrequency', e.target.value)}
                    disabled={!settings.backupEnabled}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;