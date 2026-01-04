import React, { useState, useEffect } from 'react';
import { performanceService } from '../../services/performanceService';
import { useToast } from '../ui/Toast';
import './PerformanceDashboard.css';

const PerformanceDashboard = () => {
  const [stats, setStats] = useState(null);
  const [pendingReviews, setPendingReviews] = useState([]);
  const [upcomingReviews, setUpcomingReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const { showToast } = useToast();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [statsResult, pendingResult, upcomingResult] = await Promise.all([
        performanceService.getOverallPerformanceStats(),
        performanceService.getPendingReviews(),
        performanceService.getUpcomingReviews()
      ]);

      if (statsResult.success) {
        setStats(statsResult.stats);
      }
      if (pendingResult.success) {
        setPendingReviews(pendingResult.performances || []);
      }
      if (upcomingResult.success) {
        setUpcomingReviews(upcomingResult.performances || []);
      }
    } catch (error) {
      showToast(error.message || 'Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRatingStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`star ${i <= rating ? 'filled' : 'empty'}`}>
          ★
        </span>
      );
    }
    return stars;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Draft': { color: '#6b7280', icon: '📝' },
      'Submitted': { color: '#3b82f6', icon: '📤' },
      'Approved': { color: '#10b981', icon: '✓' },
      'Pending': { color: '#f59e0b', icon: '⏳' },
      'Employee Commented': { color: '#8b5cf6', icon: '💬' }
    };

    const config = statusConfig[status] || { color: '#6b7280', icon: '?' };

    return (
      <span 
        className="status-badge"
        style={{ backgroundColor: config.color }}
      >
        <span className="status-icon">{config.icon}</span>
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="performance-dashboard loading">
        <div className="spinner"></div>
        <p>Loading performance dashboard...</p>
      </div>
    );
  }

  return (
    <div className="performance-dashboard">
      <div className="dashboard-header">
        <h1>Performance Management</h1>
        <p>Monitor and manage employee performance reviews</p>
      </div>

      <div className="dashboard-tabs">
        <button 
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab-button ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          Pending Reviews ({pendingReviews.length})
        </button>
        <button 
          className={`tab-button ${activeTab === 'upcoming' ? 'active' : ''}`}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming Reviews ({upcomingReviews.length})
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="overview-section">
          {stats && (
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">📊</div>
                <div className="stat-content">
                  <div className="stat-value">{stats.averageRating?.toFixed(1) || '0.0'}</div>
                  <div className="stat-label">Average Rating</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">✅</div>
                <div className="stat-content">
                  <div className="stat-value">{stats.statusCounts?.Approved || 0}</div>
                  <div className="stat-label">Completed Reviews</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">⏳</div>
                <div className="stat-content">
                  <div className="stat-value">{stats.statusCounts?.Pending || 0}</div>
                  <div className="stat-label">Pending Reviews</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">📈</div>
                <div className="stat-content">
                  <div className="stat-value">{Object.values(stats.ratingDistribution || {}).reduce((a, b) => a + b, 0)}</div>
                  <div className="stat-label">Total Reviews</div>
                </div>
              </div>
            </div>
          )}

          {stats?.ratingDistribution && (
            <div className="rating-distribution">
              <h3>Rating Distribution</h3>
              <div className="distribution-chart">
                {[5, 4, 3, 2, 1].map(rating => {
                  const count = stats.ratingDistribution[rating] || 0;
                  const total = Object.values(stats.ratingDistribution).reduce((a, b) => a + b, 0);
                  const percentage = total > 0 ? (count / total) * 100 : 0;
                  
                  return (
                    <div key={rating} className="rating-bar">
                      <div className="rating-label">
                        {getRatingStars(rating)}
                        <span>({rating})</span>
                      </div>
                      <div className="rating-track">
                        <div 
                          className="rating-fill" 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <div className="rating-count">{count}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'pending' && (
        <div className="pending-section">
          <h3>Pending Performance Reviews</h3>
          {pendingReviews.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h4>No pending reviews</h4>
              <p>All performance reviews are up to date!</p>
            </div>
          ) : (
            <div className="reviews-list">
              {pendingReviews.map(review => (
                <div key={review.id} className="review-card">
                  <div className="review-header">
                    <div className="review-info">
                      <h4>Employee ID: {review.employeeId}</h4>
                      <p>Review Period: {review.reviewPeriod}</p>
                    </div>
                    <div className="review-status">
                      {getStatusBadge(review.status)}
                    </div>
                  </div>
                  
                  <div className="review-content">
                    <div className="review-rating">
                      <span className="rating-label">Overall Rating:</span>
                      <div className="rating-stars">
                        {getRatingStars(review.overallRating)}
                      </div>
                    </div>
                    
                    {review.reviewerComments && (
                      <div className="review-comments">
                        <strong>Reviewer Comments:</strong>
                        <p>{review.reviewerComments}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="review-footer">
                    <span className="review-date">
                      Created: {formatDate(review.createdAt)}
                    </span>
                    <div className="review-actions">
                      <button className="action-btn primary">Review</button>
                      <button className="action-btn secondary">View Details</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'upcoming' && (
        <div className="upcoming-section">
          <h3>Upcoming Performance Reviews</h3>
          {upcomingReviews.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📅</div>
              <h4>No upcoming reviews</h4>
              <p>No performance reviews scheduled in the next 30 days.</p>
            </div>
          ) : (
            <div className="reviews-list">
              {upcomingReviews.map(review => (
                <div key={review.id} className="review-card">
                  <div className="review-header">
                    <div className="review-info">
                      <h4>Employee ID: {review.employeeId}</h4>
                      <p>Review Period: {review.reviewPeriod}</p>
                    </div>
                    <div className="review-status">
                      {getStatusBadge(review.status)}
                    </div>
                  </div>
                  
                  <div className="review-content">
                    {review.nextReviewDate && (
                      <div className="next-review-date">
                        <strong>Next Review Date:</strong> {formatDate(review.nextReviewDate)}
                      </div>
                    )}
                    
                    {review.goals && (
                      <div className="review-goals">
                        <strong>Goals:</strong>
                        <p>{review.goals}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="review-footer">
                    <span className="review-date">
                      Last Updated: {formatDate(review.updatedAt)}
                    </span>
                    <div className="review-actions">
                      <button className="action-btn primary">Schedule Review</button>
                      <button className="action-btn secondary">View Details</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PerformanceDashboard;
