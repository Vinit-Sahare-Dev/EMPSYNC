// src/components/ApiServiceTest.js
import React, { useState } from 'react';
import empSyncAPI from '../services/apiService';

const ApiServiceTest = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [data, setData] = useState(null);

  const runConnectionTest = async () => {
    setLoading(true);
    setResult('Testing connection...');
    
    try {
      const testResult = await empSyncAPI.testConnection();
      setResult(JSON.stringify(testResult, null, 2));
    } catch (error) {
      setResult(`Connection test failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const runHealthCheck = async () => {
    setLoading(true);
    setResult('Running health check...');
    
    try {
      const health = await empSyncAPI.healthCheck();
      setResult(JSON.stringify(health, null, 2));
    } catch (error) {
      setResult(`Health check failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const runGetEmployees = async () => {
    setLoading(true);
    setResult('Fetching employees...');
    
    try {
      const employees = await empSyncAPI.getAllEmployees();
      setData(employees);
      setResult(`✅ Success! Found ${employees.count} employees`);
    } catch (error) {
      setResult(`❌ Failed to get employees: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const runCreateEmployee = async () => {
    setLoading(true);
    setResult('Creating test employee...');
    
    try {
      const testEmployee = {
        name: "Test User",
        email: "test@example.com",
        position: "Developer",
        department: "IT",
        salary: 50000
      };
      
      const result = await empSyncAPI.createEmployee(testEmployee);
      setData(result);
      setResult('✅ Employee created successfully!');
    } catch (error) {
      setResult(`❌ Failed to create employee: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '10px' }}>
      <h2>API Service Test</h2>
      <p><strong>Using apiService.js with baseURL:</strong> http://localhost:8888/api/employees</p>
      
      <div style={{ marginBottom: '10px' }}>
        <button onClick={runConnectionTest} disabled={loading}>
          Test Direct Connection
        </button>
        <button onClick={runHealthCheck} disabled={loading} style={{ marginLeft: '10px' }}>
          Health Check
        </button>
        <button onClick={runGetEmployees} disabled={loading} style={{ marginLeft: '10px' }}>
          Get Employees
        </button>
        <button onClick={runCreateEmployee} disabled={loading} style={{ marginLeft: '10px' }}>
          Create Employee
        </button>
      </div>

      {loading && <div>Loading...</div>}
      
      {result && (
        <div style={{ 
          padding: '10px', 
          margin: '10px 0', 
          backgroundColor: result.includes('✅') ? '#e8f5e8' : '#ffe8e8',
          border: `1px solid ${result.includes('✅') ? '#4caf50' : '#f44336'}`,
          whiteSpace: 'pre-wrap',
          fontSize: '14px'
        }}>
          {result}
        </div>
      )}

      {data && (
        <div style={{ marginTop: '10px' }}>
          <h4>Response Data:</h4>
          <pre style={{ fontSize: '12px', backgroundColor: '#f5f5f5', padding: '10px' }}>
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ApiServiceTest;