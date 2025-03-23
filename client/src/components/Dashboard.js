import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import EmployeeManagement from './EmployeeManagement';
import LeaveManagement from './LeaveManagement';
import SalaryManagement from './SalaryManagement';
import AttendanceManagement from './AttendanceManagement';
import DashboardHome from './DashboardHome';

const Dashboard = () => {
    // 删除或注释掉未使用的状态和函数
    // const [activeTab, setActiveTab] = useState('overview');
    const [dashboardData] = useState({
        // 你的仪表盘数据
        employees: 120,
        attendance: 95,
        salary: 150000,
        leave: 8
    });

    // 删除或注释掉未使用的函数
    // const handleTabChange = (tab) => {
    //     setActiveTab(tab);
    // };

    return (
        <div className="dashboard-container">
            <Routes>
                <Route path="/" element={<DashboardHome data={dashboardData} />} />
                <Route path="/employee" element={<EmployeeManagement />} />
                <Route path="/leave" element={<LeaveManagement />} />
                <Route path="/salary" element={<SalaryManagement />} />
                <Route path="/attendance" element={<AttendanceManagement />} />
            </Routes>
        </div>
    );
};

export default Dashboard;