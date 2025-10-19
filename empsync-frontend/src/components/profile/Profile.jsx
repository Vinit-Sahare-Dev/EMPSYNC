import React, { useState, useEffect } from 'react';
import { useToast } from '../ui/Toast';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    setUser(currentUser);
    setFormData(currentUser);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update user data
      const updatedUser = {
        ...user,
        ...formData,
        updatedAt: new Date().toISOString()
      };
      
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setIsEditing(false);
      
      showToast('success', 'Profile updated successfully!');
    } catch (error) {
      showToast('error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setFormData(user);
    setIsEditing(false);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const form = e.target;
    const currentPassword = form.currentPassword.value;
    const newPassword = form.newPassword.value;
    const confirmPassword = form.confirmPassword.value;

    if (newPassword !== confirmPassword) {
      showToast('error', 'New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      showToast('error', 'Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      // Simulate password change API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      showToast('success', 'Password changed successfully!');
      form.reset();
    } catch (error) {
      showToast('error', 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="profile-container">
        <div className="loading-spinner">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {/* Header */}
      <div className="profile-header">
        <div className="header-content">
          <h1>My Profile</h1>
          <p>Manage your personal information and account settings</p>
        </div>
        {!isEditing && (
          <button 
            className="btn btn-primary"
            onClick={() => setIsEditing(true)}
          >
            ✏️ Edit Profile
          </button>
        )}
      </div>

      <div className="profile-content">
        {/* Left Column - Personal Information */}
        <div className="profile-section">
          <div className="section-header">
            <h2>Personal Information</h2>
            <div className="status-badge">
              <span className={`status-dot ${user.status || 'active'}`}></span>
              {user.status === 'active' ? 'Active' : 'Inactive'}
            </div>
          </div>

          {isEditing ? (
            <form onSubmit={handleSaveProfile} className="profile-form">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="username">Username *</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username || ''}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email || ''}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone || ''}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="department">Department</label>
                  <input
                    type="text"
                    id="department"
                    name="department"
                    value={formData.department || ''}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="position">Position</label>
                  <input
                    type="text"
                    id="position"
                    name="position"
                    value={formData.position || ''}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={handleCancelEdit}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          ) : (
            <div className="profile-info">
              <div className="info-grid">
                <div className="info-item">
                  <label>Full Name</label>
                  <span>{user.name || 'Not set'}</span>
                </div>
                <div className="info-item">
                  <label>Username</label>
                  <span>{user.username}</span>
                </div>
                <div className="info-item">
                  <label>Email</label>
                  <span>{user.email || 'Not set'}</span>
                </div>
                <div className="info-item">
                  <label>Phone</label>
                  <span>{user.phone || 'Not set'}</span>
                </div>
                <div className="info-item">
                  <label>Department</label>
                  <span>{user.department || 'Not assigned'}</span>
                </div>
                <div className="info-item">
                  <label>Position</label>
                  <span>{user.position || 'Not set'}</span>
                </div>
                <div className="info-item">
                  <label>Role</label>
                  <span className="role-badge">{user.role}</span>
                </div>
                <div className="info-item">
                  <label>Member Since</label>
                  <span>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Security & Preferences */}
        <div className="profile-sidebar">
          {/* User Avatar Section */}
          <div className="avatar-section">
            <div className="avatar-container">
              <div className="user-avatar-large">
                {user.role === 'ADMIN' ? '👑' : '👤'}
              </div>
            </div>
            <div className="avatar-info">
              <h3>{user.name || user.username}</h3>
              <p>{user.position || user.role}</p>
              <span className="user-department">{user.department || 'General'}</span>
            </div>
          </div>

          {/* Security Section */}
          <div className="security-section">
            <h3>Security</h3>
            <form onSubmit={handlePasswordChange} className="password-form">
              <div className="form-group">
                <label htmlFor="currentPassword">Current Password</label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  required
                  minLength="6"
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  required
                />
              </div>
              <button 
                type="submit" 
                className="btn btn-warning btn-block"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Change Password'}
              </button>
            </form>
          </div>

          {/* Account Stats */}
          <div className="stats-section">
            <h3>Account Statistics</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-icon">📅</span>
                <div className="stat-info">
                  <span className="stat-value">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                  <span className="stat-label">Joined Date</span>
                </div>
              </div>
              <div className="stat-item">
                <span className="stat-icon">👤</span>
                <div className="stat-info">
                  <span className="stat-value">{user.role}</span>
                  <span className="stat-label">Account Type</span>
                </div>
              </div>
              <div className="stat-item">
                <span className="stat-icon">🔄</span>
                <div className="stat-info">
                  <span className="stat-value">
                    {user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : 'Never'}
                  </span>
                  <span className="stat-label">Last Updated</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;