// src/components/ConnectionTest.jsx
import React from 'react';
import { empSyncAPI } from '../services/apiService';

export function ConnectionTest() {
  const [status, setStatus] = React.useState('testing');
  const [data, setData] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [endpointTest, setEndpointTest] = React.useState(null);

  const testConnection = async () => {
    try {
      setStatus('testing');
      setError(null);
      setEndpointTest(null);
      console.log('🧪 Testing connection to:', 'http://localhost:8888/api/employees');
      
      // Test basic connectivity first
      const health = await empSyncAPI.healthCheck();
      console.log('Health check result:', health);
      
      if (health.success) {
        // Test specific endpoints
        const endpointsTest = await empSyncAPI.testEndpoint();
        
        if (endpointsTest.success) {
          const result = endpointsTest.data;
          
          // Handle your backend's response structure
          if (result.success && result.employees) {
            setData(result.employees);
            setStatus('success');
            console.log('✅ Connection test successful:', result);
          } else if (result.employees) {
            // Direct array response
            setData(result.employees);
            setStatus('success');
          } else {
            setEndpointTest(result);
            setStatus('success');
          }
        } else {
          throw new Error(endpointsTest.error);
        }
      } else {
        throw new Error(health.message);
      }
    } catch (err) {
      const errorMessage = err.message || 'Connection failed';
      setError(errorMessage);
      setStatus('error');
      console.error('❌ Connection test failed:', err);
    }
  };

  const testSpecificEndpoint = async (endpoint) => {
    try {
      const result = await empSyncAPI.testEndpoint(endpoint);
      setEndpointTest({ endpoint, ...result });
    } catch (error) {
      setEndpointTest({ 
        endpoint, 
        success: false, 
        error: error.message 
      });
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
          ✅ Connected successfully! 
          {data && ` Loaded ${Array.isArray(data) ? data.length : 'data'} employees`}
        </div>
      )}
      {status === 'error' && (
        <div style={{ color: 'red' }}>
          ❌ Connection failed: {error}
          <br />
          <div style={{ marginTop: '10px', fontSize: '12px' }}>
            <strong>Troubleshooting:</strong>
            <ul>
              <li>Ensure Spring Boot backend is running: <code>http://localhost:8888/api/employees</code></li>
              <li>Check backend CORS configuration in EmployeeController</li>
              <li>Verify no firewall is blocking port 8888</li>
              <li>Check browser console (F12) for detailed CORS errors</li>
            </ul>
          </div>
          <button onClick={testConnection} style={{ marginTop: '10px' }}>
            Retry Test
          </button>
        </div>
      )}
      
      {/* Endpoint Testing */}
      <div style={{ marginTop: '15px' }}>
        <strong>Test Endpoints:</strong>
        <div style={{ marginTop: '10px', display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
          <button onClick={() => testSpecificEndpoint('/')} className="btn btn-sm">GET /</button>
          <button onClick={() => testSpecificEndpoint('/count')} className="btn btn-sm">GET /count</button>
          <button onClick={() => testSpecificEndpoint('/departments')} className="btn btn-sm">GET /departments</button>
          <button onClick={() => testSpecificEndpoint('/active')} className="btn btn-sm">GET /active</button>
        </div>
        
        {endpointTest && (
          <div style={{ marginTop: '10px', padding: '10px', background: '#f5f5f5', borderRadius: '4px' }}>
            <strong>Endpoint: {endpointTest.endpoint || '/'}</strong>
            <div style={{ color: endpointTest.success ? 'green' : 'red' }}>
              {endpointTest.success ? '✅ Success' : '❌ Failed'}: {endpointTest.error || 'Request successful'}
            </div>
            {endpointTest.data && (
              <pre style={{ fontSize: '10px', marginTop: '5px' }}>
                {JSON.stringify(endpointTest.data, null, 2)}
              </pre>
            )}
          </div>
        )}
      </div>
      
      {data && (
        <div style={{ marginTop: '10px' }}>
          <strong>Employees Data ({Array.isArray(data) ? data.length : 'Object'}):</strong>
          <pre style={{ fontSize: '12px', background: '#f5f5f5', padding: '10px', maxHeight: '300px', overflow: 'auto' }}>
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}