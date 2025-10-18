// src/components/settings/Settings.jsx
import React, { useState, useContext, useEffect } from 'react';
import { ThemeContext } from '../../contexts/ThemeContext';
import { empSyncAPI } from '../../services/apiService';
import '../../styles/Settings.css';

const Settings = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    companyName: 'EMPSYNC',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    dateFormat: 'MM/DD/YYYY',
    language: 'en',
    currency: 'USD',
    notifications: {
      email: true,
      push: true,
      sms: false,
      newEmployee: true,
      employeeUpdate: true,
      reportReady: false
    },
    security: {
      twoFactor: false,
      sessionTimeout: 30,
      passwordExpiry: 90,
      loginAlerts: true
    },
    appearance: {
      theme: 'light',
      density: 'comfortable',
      fontSize: 'medium'
    },
    data: {
      autoBackup: true,
      backupFrequency: 'weekly',
      exportFormat: 'json',
      retentionPeriod: 365
    }
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('empsync-settings');
    if (savedSettings) {
      setSettings(prev => ({ ...prev, ...JSON.parse(savedSettings) }));
    }
  }, []);

  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const handleNestedSettingChange = (category, subCategory, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [subCategory]: {
          ...prev[category][subCategory],
          [key]: value
        }
      }
    }));
  };

  const saveSettings = async () => {
    setIsSaving(true);
    setSaveStatus('saving');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Save to localStorage
      localStorage.setItem('empsync-settings', JSON.stringify(settings));
      
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(''), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const resetToDefaults = () => {
    if (window.confirm('Are you sure you want to reset all settings to default? This action cannot be undone.')) {
      const defaultSettings = {
        companyName: 'EMPSYNC',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        dateFormat: 'MM/DD/YYYY',
        language: 'en',
        currency: 'USD',
        notifications: {
          email: true,
          push: true,
          sms: false,
          newEmployee: true,
          employeeUpdate: true,
          reportReady: false
        },
        security: {
          twoFactor: false,
          sessionTimeout: 30,
          passwordExpiry: 90,
          loginAlerts: true
        },
        appearance: {
          theme: 'light',
          density: 'comfortable',
          fontSize: 'medium'
        },
        data: {
          autoBackup: true,
          backupFrequency: 'weekly',
          exportFormat: 'json',
          retentionPeriod: 365
        }
      };
      setSettings(defaultSettings);
      localStorage.setItem('empsync-settings', JSON.stringify(defaultSettings));
    }
  };

  const exportSettings = () => {
    const data = {
      settings,
      exportDate: new Date().toISOString(),
      version: '1.0',
      exportedBy: 'EMPSYNC Admin'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `empsync-settings-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importSettings = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target.result);
          if (importedSettings.settings) {
            setSettings(importedSettings.settings);
            localStorage.setItem('empsync-settings', JSON.stringify(importedSettings.settings));
            alert('Settings imported successfully!');
          }
        } catch (error) {
          alert('Error importing settings. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: '⚙️', description: 'Basic application settings' },
    { id: 'notifications', label: 'Notifications', icon: '🔔', description: 'Manage your notification preferences' },
    { id: 'security', label: 'Security', icon: '🔒', description: 'Security and privacy settings' },
    { id: 'appearance', label: 'Appearance', icon: '🎨', description: 'Customize the look and feel' },
    { id: 'data', label: 'Data Management', icon: '💾', description: 'Backup and data settings' },
    { id: 'about', label: 'About', icon: 'ℹ️', description: 'System information' }
  ];

  return (
    <div className="settings-container">
      <div className="settings-header">
        <div className="header-content">
          <h1>System Settings</h1>
          <p>Customize your EMPSYNC experience</p>
        </div>
        <div className="save-status">
          {saveStatus === 'saving' && <span className="status-saving">Saving...</span>}
          {saveStatus === 'success' && <span className="status-success">✓ Settings saved</span>}
          {saveStatus === 'error' && <span className="status-error">✗ Save failed</span>}
        </div>
      </div>

      <div className="settings-layout">
        {/* Navigation Sidebar */}
        <div className="settings-sidebar">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`sidebar-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <div className="tab-content">
                <span className="tab-label">{tab.label}</span>
                <span className="tab-description">{tab.description}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="settings-content">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="settings-section">
              <h2>General Settings</h2>
              
              <div className="setting-group">
                <label className="setting-label">Company Name</label>
                <input
                  type="text"
                  value={settings.companyName}
                  onChange={(e) => handleSettingChange('companyName', e.target.value)}
                  className="setting-input"
                  placeholder="Enter your company name"
                />
                <p className="setting-description">This name will be displayed throughout the application</p>
              </div>

              <div className="setting-row">
                <div className="setting-group">
                  <label className="setting-label">Timezone</label>
                  <select
                    value={settings.timezone}
                    onChange={(e) => handleSettingChange('timezone', e.target.value)}
                    className="setting-input"
                  >
                    <option value="America/New_York">Eastern Time (ET)</option>
                    <option value="America/Chicago">Central Time (CT)</option>
                    <option value="America/Denver">Mountain Time (MT)</option>
                    <option value="America/Los_Angeles">Pacific Time (PT)</option>
                    <option value="UTC">UTC</option>
                    <option value="Europe/London">Greenwich Mean Time (GMT)</option>
                    <option value="Asia/Kolkata">Indian Standard Time (IST)</option>
                  </select>
                </div>

                <div className="setting-group">
                  <label className="setting-label">Date Format</label>
                  <select
                    value={settings.dateFormat}
                    onChange={(e) => handleSettingChange('dateFormat', e.target.value)}
                    className="setting-input"
                  >
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
              </div>

              <div className="setting-row">
                <div className="setting-group">
                  <label className="setting-label">Language</label>
                  <select
                    value={settings.language}
                    onChange={(e) => handleSettingChange('language', e.target.value)}
                    className="setting-input"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </div>

                <div className="setting-group">
                  <label className="setting-label">Currency</label>
                  <select
                    value={settings.currency}
                    onChange={(e) => handleSettingChange('currency', e.target.value)}
                    className="setting-input"
                  >
                    <option value="USD">US Dollar ($)</option>
                    <option value="EUR">Euro (€)</option>
                    <option value="GBP">British Pound (£)</option>
                    <option value="INR">Indian Rupee (₹)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Settings */}
          {activeTab === 'notifications' && (
            <div className="settings-section">
              <h2>Notification Settings</h2>
              <p className="section-description">Choose how you want to be notified about important events</p>

              <div className="notification-category">
                <h3>Notification Channels</h3>
                <div className="toggle-group">
                  <ToggleSetting
                    label="Email Notifications"
                    checked={settings.notifications.email}
                    onChange={(checked) => handleNestedSettingChange('notifications', 'email', checked)}
                    description="Receive notifications via email"
                  />
                  <ToggleSetting
                    label="Push Notifications"
                    checked={settings.notifications.push}
                    onChange={(checked) => handleNestedSettingChange('notifications', 'push', checked)}
                    description="Receive browser push notifications"
                  />
                  <ToggleSetting
                    label="SMS Notifications"
                    checked={settings.notifications.sms}
                    onChange={(checked) => handleNestedSettingChange('notifications', 'sms', checked)}
                    description="Receive SMS alerts (premium feature)"
                  />
                </div>
              </div>

              <div className="notification-category">
                <h3>Notification Types</h3>
                <div className="toggle-group">
                  <ToggleSetting
                    label="New Employee Alerts"
                    checked={settings.notifications.newEmployee}
                    onChange={(checked) => handleNestedSettingChange('notifications', 'newEmployee', checked)}
                    description="Get notified when new employees are added"
                  />
                  <ToggleSetting
                    label="Employee Updates"
                    checked={settings.notifications.employeeUpdate}
                    onChange={(checked) => handleNestedSettingChange('notifications', 'employeeUpdate', checked)}
                    description="Notifications for employee profile changes"
                  />
                  <ToggleSetting
                    label="Report Generation"
                    checked={settings.notifications.reportReady}
                    onChange={(checked) => handleNestedSettingChange('notifications', 'reportReady', checked)}
                    description="Alert when analytics reports are ready"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <div className="settings-section">
              <h2>Security Settings</h2>
              <p className="section-description">Manage your account security and privacy preferences</p>

              <div className="toggle-group">
                <ToggleSetting
                  label="Two-Factor Authentication"
                  checked={settings.security.twoFactor}
                  onChange={(checked) => handleNestedSettingChange('security', 'twoFactor', checked)}
                  description="Add an extra layer of security to your account"
                />
                <ToggleSetting
                  label="Login Alerts"
                  checked={settings.security.loginAlerts}
                  onChange={(checked) => handleNestedSettingChange('security', 'loginAlerts', checked)}
                  description="Get notified of new sign-ins to your account"
                />
              </div>

              <div className="setting-row">
                <div className="setting-group">
                  <label className="setting-label">Session Timeout (minutes)</label>
                  <input
                    type="number"
                    min="5"
                    max="240"
                    value={settings.security.sessionTimeout}
                    onChange={(e) => handleNestedSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
                    className="setting-input"
                  />
                  <p className="setting-description">Automatically log out after period of inactivity</p>
                </div>

                <div className="setting-group">
                  <label className="setting-label">Password Expiry (days)</label>
                  <input
                    type="number"
                    min="30"
                    max="365"
                    value={settings.security.passwordExpiry}
                    onChange={(e) => handleNestedSettingChange('security', 'passwordExpiry', parseInt(e.target.value))}
                    className="setting-input"
                  />
                  <p className="setting-description">How often passwords must be changed</p>
                </div>
              </div>
            </div>
          )}

          {/* Appearance Settings */}
          {activeTab === 'appearance' && (
            <div className="settings-section">
              <h2>Appearance Settings</h2>
              <p className="section-description">Customize how EMPSYNC looks and feels</p>

              <div className="setting-group">
                <label className="setting-label">Theme</label>
                <div className="theme-options">
                  <button 
                    className={`theme-option light ${theme === 'light' ? 'active' : ''}`}
                    onClick={() => toggleTheme('light')}
                  >
                    <div className="theme-preview light"></div>
                    <span>Light</span>
                  </button>
                  <button 
                    className={`theme-option dark ${theme === 'dark' ? 'active' : ''}`}
                    onClick={() => toggleTheme('dark')}
                  >
                    <div className="theme-preview dark"></div>
                    <span>Dark</span>
                  </button>
                  <button 
                    className={`theme-option auto ${theme === 'auto' ? 'active' : ''}`}
                    onClick={() => toggleTheme('auto')}
                  >
                    <div className="theme-preview auto"></div>
                    <span>Auto</span>
                  </button>
                </div>
              </div>

              <div className="setting-row">
                <div className="setting-group">
                  <label className="setting-label">Font Size</label>
                  <select
                    value={settings.appearance.fontSize}
                    onChange={(e) => handleNestedSettingChange('appearance', 'fontSize', e.target.value)}
                    className="setting-input"
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                </div>

                <div className="setting-group">
                  <label className="setting-label">Density</label>
                  <select
                    value={settings.appearance.density}
                    onChange={(e) => handleNestedSettingChange('appearance', 'density', e.target.value)}
                    className="setting-input"
                  >
                    <option value="compact">Compact</option>
                    <option value="comfortable">Comfortable</option>
                    <option value="spacious">Spacious</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Data Management Settings */}
          {activeTab === 'data' && (
            <div className="settings-section">
              <h2>Data Management</h2>
              <p className="section-description">Manage your data backup and retention settings</p>

              <div className="toggle-group">
                <ToggleSetting
                  label="Automatic Backups"
                  checked={settings.data.autoBackup}
                  onChange={(checked) => handleNestedSettingChange('data', 'autoBackup', checked)}
                  description="Automatically backup your data regularly"
                />
              </div>

              <div className="setting-row">
                <div className="setting-group">
                  <label className="setting-label">Backup Frequency</label>
                  <select
                    value={settings.data.backupFrequency}
                    onChange={(e) => handleNestedSettingChange('data', 'backupFrequency', e.target.value)}
                    className="setting-input"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                <div className="setting-group">
                  <label className="setting-label">Export Format</label>
                  <select
                    value={settings.data.exportFormat}
                    onChange={(e) => handleNestedSettingChange('data', 'exportFormat', e.target.value)}
                    className="setting-input"
                  >
                    <option value="json">JSON</option>
                    <option value="csv">CSV</option>
                    <option value="excel">Excel</option>
                  </select>
                </div>
              </div>

              <div className="setting-group">
                <label className="setting-label">Data Retention Period (days)</label>
                <input
                  type="number"
                  min="30"
                  max="730"
                  value={settings.data.retentionPeriod}
                  onChange={(e) => handleNestedSettingChange('data', 'retentionPeriod', parseInt(e.target.value))}
                  className="setting-input"
                />
                <p className="setting-description">How long to keep backup data before automatic deletion</p>
              </div>

              <div className="action-buttons">
                <button className="btn-secondary" onClick={exportSettings}>
                  📥 Export All Data
                </button>
                <label className="btn-secondary file-upload">
                  📤 Import Data
                  <input type="file" accept=".json,.csv" onChange={importSettings} style={{ display: 'none' }} />
                </label>
              </div>
            </div>
          )}

          {/* About Settings */}
          {activeTab === 'about' && (
            <div className="settings-section">
              <h2>About EMPSYNC</h2>
              
              <div className="about-content">
                <div className="app-info">
                  <div className="app-logo">EMPSYNC</div>
                  <h3>Employee Management System</h3>
                  <p className="version">Version 1.0.0</p>
                </div>

                <div className="system-info">
                  <h4>System Information</h4>
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="info-label">Frontend</span>
                      <span className="info-value">React 18 + Vite</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Backend</span>
                      <span className="info-value">Spring Boot</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Database</span>
                      <span className="info-value">MySQL</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Last Updated</span>
                      <span className="info-value">{new Date().toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="support-info">
                  <h4>Support</h4>
                  <p>For technical support or feature requests, please contact:</p>
                  <ul>
                    <li>📧 Email: support@empsync.com</li>
                    <li>🌐 Website: https://empsync.com</li>
                    <li>📚 Documentation: https://docs.empsync.com</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="settings-actions">
            <button 
              className="btn-primary" 
              onClick={saveSettings}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
            <button 
              className="btn-secondary" 
              onClick={resetToDefaults}
            >
              Reset to Defaults
            </button>
            <button 
              className="btn-outline" 
              onClick={exportSettings}
            >
              Export Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Toggle Component
const ToggleSetting = ({ label, checked, onChange, description }) => (
  <div className="toggle-setting">
    <div className="toggle-content">
      <div className="toggle-label">
        <span className="label-text">{label}</span>
        <p className="label-description">{description}</p>
      </div>
      <label className="toggle-switch">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span className="slider"></span>
      </label>
    </div>
  </div>
);

export default Settings;