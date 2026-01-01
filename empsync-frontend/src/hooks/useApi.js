// src/hooks/useApi.js
import { useState, useCallback } from 'react';

// Use HTTP instead of HTTPS
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8888/api';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const callApi = useCallback(async (endpoint, options = {}) => {
    setLoading(true);
    setError(null);

    try {
      const url = `${API_BASE_URL}${endpoint}`;

      const config = {
        method: 'GET', // default method
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        ...options,
      };

      // If we have a body, stringify it
      if (config.body && typeof config.body === 'object') {
        config.body = JSON.stringify(config.body);
      }

      const response = await fetch(url, config);

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
          console.error('❌ Error response data:', errorData);
        } catch (e) {
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      setData(result);
      return result;

    } catch (err) {
      console.error('❌ API Call failed:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    data,
    callApi,
  };
};

export const useEmployees = () => {
  const { loading, error, data, callApi } = useApi();

  const getEmployees = useCallback(async () => {
    return await callApi('/employees');
  }, [callApi]);

  const getEmployeeById = useCallback(async (id) => {
    return await callApi(`/employees/${id}`);
  }, [callApi]);

  const createEmployee = useCallback(async (employeeData) => {
    return await callApi('/employees', {
      method: 'POST',
      body: employeeData,
    });
  }, [callApi]);

  const updateEmployee = useCallback(async (id, employeeData) => {
    return await callApi(`/employees/${id}`, {
      method: 'PUT',
      body: employeeData,
    });
  }, [callApi]);

  const deleteEmployee = useCallback(async (id) => {
    return await callApi(`/employees/${id}`, {
      method: 'DELETE',
    });
  }, [callApi]);

  return {
    loading,
    error,
    data,
    getEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee,
  };
};