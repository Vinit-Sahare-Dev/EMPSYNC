// src/components/employees/BulkActions.jsx
import React from 'react';

const BulkActions = ({ selectedCount, onBulkDelete, onClearSelection }) => {
  return (
    <div className="bulk-actions-bar">
      <div className="bulk-actions-info">
        <strong>{selectedCount}</strong> employees selected
      </div>
      <div className="bulk-actions-buttons">
        <button 
          className="btn btn-outline btn-sm"
          onClick={onClearSelection}
        >
          Clear Selection
        </button>
        <button 
          className="btn btn-danger btn-sm"
          onClick={onBulkDelete}
        >
          Delete Selected
        </button>
      </div>
    </div>
  );
};

export default BulkActions;