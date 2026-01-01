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
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    setUser(currentUser);
    setFormData(currentUser);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        showToast('error', 'Image size should be less than 1MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result }));
        showToast('success', 'Photo uploaded! Save changes to apply.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      const updatedUser = { ...user, ...formData, updatedAt: new Date().toISOString() };
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setIsEditing(false);
      showToast('success', 'Profile updated successfully!');
      window.location.reload();
    } catch (error) {
      showToast('error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="profile-loading">Loading...</div>;

  return (
    <div className="profile-view-container">
      <div className="profile-header-modern">
        <div>
          <h1>My Profile</h1>
          <p>Personal account management</p>
        </div>
        {!isEditing && (
          <button className="btn-edit" onClick={() => setIsEditing(true)}>Edit Profile</button>
        )}
      </div>

      <div className="profile-layout-grid">
        <div className="profile-main-card">
          <div className="card-header-flex">
            <h2>Account Details</h2>
            <span className={`status-pill ${user.status || 'active'}`}>{user.status || 'Active'}</span>
          </div>

          {isEditing ? (
            <form onSubmit={handleSaveProfile} className="profile-edit-form">
              <div className="form-row">
                <div className="input-group">
                  <label>Full Name</label>
                  <input type="text" name="name" value={formData.name || ''} onChange={handleInputChange} required />
                </div>
                <div className="input-group">
                  <label>Username</label>
                  <input type="text" name="username" value={formData.username || ''} onChange={handleInputChange} required />
                </div>
              </div>
              <div className="form-row">
                <div className="input-group">
                  <label>Email</label>
                  <input type="email" name="email" value={formData.email || ''} onChange={handleInputChange} required />
                </div>
                <div className="input-group">
                  <label>Phone</label>
                  <input type="tel" name="phone" value={formData.phone || ''} onChange={handleInputChange} />
                </div>
              </div>
              <div className="form-row">
                <div className="input-group">
                  <label>Department</label>
                  <input type="text" name="department" value={formData.department || ''} onChange={handleInputChange} />
                </div>
                <div className="input-group">
                  <label>Position</label>
                  <input type="text" name="position" value={formData.position || ''} onChange={handleInputChange} />
                </div>
              </div>
              <div className="edit-actions">
                <button type="button" className="btn-cancel" onClick={() => { setFormData(user); setIsEditing(false); }}>Cancel</button>
                <button type="submit" className="btn-save" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button>
              </div>
            </form>
          ) : (
            <div className="info-display-grid">
              <div className="info-box"><label>Full Name</label><p>{user.name || 'Not set'}</p></div>
              <div className="info-box"><label>Username</label><p>{user.username}</p></div>
              <div className="info-box"><label>Email</label><p>{user.email || 'Not set'}</p></div>
              <div className="info-box"><label>Phone</label><p>{user.phone || 'Not set'}</p></div>
              <div className="info-box"><label>Department</label><p>{user.department || 'Not assigned'}</p></div>
              <div className="info-box"><label>Position</label><p>{user.position || 'Not set'}</p></div>
              <div className="info-box"><label>Access Level</label><p className="access-tag">{user.role}</p></div>
              <div className="info-box"><label>Account Created</label><p>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p></div>
            </div>
          )}
        </div>

        <div className="profile-side-panel">
          <div className="user-identity-card">
            <div className="avatar-wrapper">
              <div className="large-avatar">
                {formData.avatar || user.avatar ? (
                  <img src={formData.avatar || user.avatar} alt="Avatar" />
                ) : (
                  <span>{user.name?.charAt(0) || user.username?.charAt(0)}</span>
                )}
                {isEditing && (
                  <label className="photo-upload-overlay">
                    <input type="file" accept="image/*" onChange={handleFileChange} hidden />
                    <span>Change</span>
                  </label>
                )}
              </div>
            </div>
            <div className="identity-text">
              <h3>{user.name || user.username}</h3>
              <p>{user.position || user.role}</p>
            </div>
          </div>

          <div className="security-mini-card">
            <h3>Account Security</h3>
            <p>Password last changed: {user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : 'Never'}</p>
            <button className="btn-outline-sec">Update Security</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;