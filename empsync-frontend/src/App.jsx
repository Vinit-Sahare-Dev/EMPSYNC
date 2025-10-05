import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar.jsx';
import Sidebar from './components/layout/Sidebar.jsx';
import Dashboard from './components/dashboard/Dashboard.jsx';
import EmployeeGrid from './components/employees/EmployeeGrid.jsx';
import './styles/App.css';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Router>
      <div className="empsync-app">
        <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <div className="empsync-container">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <main className="empsync-main">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/employees" element={<EmployeeGrid />} />
              <Route path="/departments" element={<EmployeeGrid view="department" />} />
              <Route path="/analytics" element={<div className="coming-soon">Analytics Coming Soon 🚀</div>} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;