// src/components/DebugTest.js
import React, { useState } from 'react';
import empSyncAPI from '../services/apiService';

const DebugTest = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const addResult = (title, result) => {
    setResults(prev => [...prev, { title, result, timestamp: new Date().toLocaleTimeString() }]);
  };

  const testBackendConnection = async () => {
    setLoading(true);
    addResult('Starting Tests', 'Testing backend connection...');

    try {
      // Test 1: Direct fetch to backend
      addResult('Test 1', 'Testing direct fetch to http://localhost:8888/api/employees');
      try {
        const directResponse = await fetch('http://localhost:8888/api/employees', {
          method: 'GET',
          credentials: 'include',
        });
        addResult('Direct Fetch Result', `Status: ${directResponse.status}, OK: ${directResponse.ok}`);
        
        if (directResponse.ok) {
          const data = await directResponse.json();
          addResult('Direct Fetch Data', `Success! Found ${data.count} employees`);
        }
      } catch (fetchError) {
        addResult('Direct Fetch Error', `Failed: ${fetchError.message}`);
      }

      // Test 2: Health check via apiService
      addResult('Test 2', 'Testing health check via apiService');
      const health = await empSyncAPI.healthCheck();
      addResult('Health Check', JSON.stringify(health, null, 2));

      // Test 3: Get employees via apiService
      addResult('Test 3', 'Testing getEmployees via apiService');
      const employees = await empSyncAPI.getAllEmployees();
      addResult('Get Employees', `Success! Found ${employees.count} employees`);

      // Test 4: Check if backend is actually running
      addResult('Test 4', 'Checking if backend server is reachable');
      try {
        const serverCheck = await fetch('http://localhost:8888', {
          method: 'GET',
        });
        addResult('Server Reachable', `Backend server is running on port 8888`);
      } catch (serverError) {
        addResult('Server Not Reachable', `Backend is not running on port 8888: ${serverError.message}`);
      }

    } catch (error) {
      addResult('Overall Test Failed', `Tests failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <div style={{ padding: '20px', margin: '10px', border: '2px solid #007acc' }}>
      <h2>🔧 Backend Connection Debugger</h2>
      <p><strong>Expected Backend:</strong> http://localhost:8888</p>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={testBackendConnection} 
          disabled={loading}
          style={{ padding: '10px 15px', backgroundColor: '#007acc', color: 'white', border: 'none' }}
        >
          {loading ? 'Testing...' : 'Run Connection Tests'}
        </button>
        <button 
          onClick={clearResults} 
          style={{ marginLeft: '10px', padding: '10px 15px' }}
        >
          Clear Results
        </button>
      </div>

      {loading && (
        <div style={{ padding: '10px', backgroundColor: '#fff3cd', border: '1px solid #ffeaa7' }}>
          🔄 Running tests... Please wait
        </div>
      )}

      <div style={{ marginTop: '20px' }}>
        <h3>Test Results:</h3>
        {results.map((result, index) => (
          <div 
            key={index} 
            style={{ 
              padding: '10px', 
              margin: '5px 0', 
              backgroundColor: result.result.includes('Success') || result.result.includes('running') ? '#d4edda' : '#f8d7da',
              border: `1px solid ${result.result.includes('Success') || result.result.includes('running') ? '#c3e6cb' : '#f5c6cb'}`,
              borderRadius: '4px'
            }}
          >
            <strong>{result.title}</strong> 
            <span style={{ float: 'right', fontSize: '0.8em', color: '#666' }}>{result.timestamp}</span>
            <div style={{ marginTop: '5px', fontSize: '0.9em', whiteSpace: 'pre-wrap' }}>
              {result.result}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e9ecef', borderRadius: '4px' }}>
        <h4>Common Solutions:</h4>
        <ul>
          <li>Make sure Spring Boot is running on port 8888</li>
          <li>Check if backend URL is correct: http://localhost:8888</li>
          <li>Verify CORS is configured in Spring Boot</li>
          <li>Check browser console for CORS errors</li>
          <li>Ensure no firewall is blocking port 8888</li>
        </ul>
      </div>
    </div>
  );
};

export default DebugTest;