'use client';
import React, { useState } from 'react';
import EmployeeManagement from '../components/EmployeeManagement';
import AttendanceManagement from '../components/AttendanceManagement';
import LeaveManagement from '../components/LeaveManagement';
import SalaryManagement from '../components/SalaryManagement';
import DashboardHome from '../components/DashboardHome';
import '../styles/dashboard.css';

const Dashboard = () => {
    const [activeModule, setActiveModule] = useState('home');

    const renderModule = () => {
        switch (activeModule) {
            case 'employee':
                return <EmployeeManagement />;
            case 'attendance':
                return <AttendanceManagement />;
            case 'leave':
                return <LeaveManagement />;
            case 'salary':
                return <SalaryManagement />;
            default:
                return <DashboardHome />;
        }
    };

    return (
        <div className="dashboard-container">
            {/* 左侧导航栏 */}
            <div className="sidebar">
                <div className="sidebar-header">
                    <h2>酒店管理系统</h2>
                </div>
                <nav>
                    <ul className="sidebar-menu">
                        <li
                            className={activeModule === 'home' ? 'active' : ''}
                            onClick={() => setActiveModule('home')}
                        >
                            首页
                        </li>
                        <li
                            className={activeModule === 'employee' ? 'active' : ''}
                            onClick={() => setActiveModule('employee')}
                        >
                            员工管理
                        </li>
                        <li
                            className={activeModule === 'attendance' ? 'active' : ''}
                            onClick={() => setActiveModule('attendance')}
                        >
                            考勤管理
                        </li>
                        <li
                            className={activeModule === 'leave' ? 'active' : ''}
                            onClick={() => setActiveModule('leave')}
                        >
                            请假管理
                        </li>
                        <li
                            className={activeModule === 'salary' ? 'active' : ''}
                            onClick={() => setActiveModule('salary')}
                        >
                            薪资管理
                        </li>
                    </ul>
                </nav>
            </div>

            {/* 主内容区域 */}
            <div className="main-content">
                {renderModule()}
            </div>
        </div>
    );
};

export default Dashboard;