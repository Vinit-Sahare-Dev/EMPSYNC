// src/components/ConnectionTest.jsx
import React from 'react';
import { empSyncAPI } from '../services/apiService';

export function ConnectionTest() {
  const [status, setStatus] = React.useState('testing');
  const [data, setData] = React.useState(null);
  const [error, setError] = React.useState(null);

  const testConnection = async () => {
    try {
      setStatus('testing');
      setError(null);
      console.log('🧪 Testing connection to:', 'http://localhost:8888/api/employees');
      
      const result = await empSyncAPI.syncEmployees();
      setData(result);
      setStatus('success');
      console.log('✅ Connection test successful:', result);
    } catch (err) {
      setError(err.message);
      setStatus('error');
      console.error('❌ Connection test failed:', err);
    }
  };

  React.useEffect(() => {
    testConnection();
  }, []);

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '10px' }}>
      <h3>Connection Test</h3>
      <p><strong>Backend URL:</strong> http://localhost:8888/api/employees</p>
      
      {status === 'testing' && <div>🔄 Testing connection...</div>}
      {status === 'success' && (
        <div style={{ color: 'green' }}>
          ✅ Connected successfully! Loaded {data?.length || 0} employees
        </div>
      )}
      {status === 'error' && (
        <div style={{ color: 'red' }}>
          ❌ Connection failed: {error}
          <br />
          <button onClick={testConnection} style={{ marginTop: '10px' }}>
            Retry Test
          </button>
        </div>
      )}
      
      {data && (
        <div style={{ marginTop: '10px' }}>
          <strong>Response Data:</strong>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}