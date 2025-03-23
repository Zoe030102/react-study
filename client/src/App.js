import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import EmployeeManagement from './components/EmployeeManagement';
import LeaveManagement from './components/LeaveManagement';
import SalaryManagement from './components/SalaryManagement';
import AttendanceManagement from './components/AttendanceManagement';
// 添加axios用于API请求
import axios from 'axios';

// 设置axios默认配置
axios.defaults.baseURL = 'http://localhost:5000'; // 替换为你的后端API地址
axios.defaults.headers.common['Content-Type'] = 'application/json';

function App() {
  return (
    <Router>
      <div className="app">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/employee" element={<EmployeeManagement />} />
            <Route path="/leave" element={<LeaveManagement />} />
            <Route path="/salary" element={<SalaryManagement />} />
            <Route path="/attendance" element={<AttendanceManagement />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;




