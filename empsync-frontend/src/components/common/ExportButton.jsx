// src/components/common/ExportButton.jsx
import React, { useState } from 'react';
import { exportToCSV, exportToJSON } from '../../utils/exportUtils';

const ExportButton = ({ data }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleExport = (format) => {
    if (data.length === 0) {
      alert('No data to export');
      return;
    }

    switch (format) {
      case 'csv':
        exportToCSV(data);
        break;
      case 'json':
        exportToJSON(data);
        break;
      default:
        break;
    }
    setShowDropdown(false);
  };

  return (
    <div className="export-dropdown">
      <button 
        className="btn btn-outline"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        📥 Export
      </button>
      
      {showDropdown && (
        <div className="dropdown-menu">
          <button 
            className="dropdown-item"
            onClick={() => handleExport('csv')}
          >
            Export as CSV
          </button>
          <button 
            className="dropdown-item"
            onClick={() => handleExport('json')}
          >
            Export as JSON
          </button>
        </div>
      )}
    </div>
  );
};

export default ExportButton;