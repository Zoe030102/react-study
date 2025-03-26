'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import DashboardHome from './DashboardHome';
import EmployeeManagement from './EmployeeManagement';
import AttendanceManagement from './AttendanceManagement';
import LeaveManagement from './LeaveManagement';
import SalaryManagement from './SalaryManagement';
import '../styles/dashboard.css';

const Dashboard = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [activeModule, setActiveModule] = useState('home');

    useEffect(() => {
        const module = searchParams.get('module');
        if (module) {
            setActiveModule(module);
        }
    }, [searchParams]);

    const handleModuleChange = (module) => {
        setActiveModule(module);
        router.push(`/dashboard?module=${module}`);
    };

    return (
        <div className="dashboard-container">
            {/* 侧边栏 */}
            <div className="sidebar">
                <div className="sidebar-header">
                    <h2>酒店人力资源管理系统</h2>
                </div>
                <ul className="sidebar-menu">
                    <li
                        className={activeModule === 'home' ? 'active' : ''}
                        onClick={() => handleModuleChange('home')}
                    >
                        <i className="fas fa-home"></i> 仪表盘
                    </li>
                    <li
                        className={activeModule === 'employee' ? 'active' : ''}
                        onClick={() => handleModuleChange('employee')}
                    >
                        <i className="fas fa-users"></i> 员工管理
                    </li>
                    <li
                        className={activeModule === 'attendance' ? 'active' : ''}
                        onClick={() => handleModuleChange('attendance')}
                    >
                        <i className="fas fa-calendar-check"></i> 考勤管理
                    </li>
                    <li
                        className={activeModule === 'leave' ? 'active' : ''}
                        onClick={() => handleModuleChange('leave')}
                    >
                        <i className="fas fa-calendar-minus"></i> 请假管理
                    </li>
                    <li
                        className={activeModule === 'salary' ? 'active' : ''}
                        onClick={() => handleModuleChange('salary')}
                    >
                        <i className="fas fa-money-bill-wave"></i> 薪资管理
                    </li>
                    <li onClick={() => router.push('/')}>
                        <i className="fas fa-sign-out-alt"></i> 退出系统
                    </li>
                </ul>
            </div>

            {/* 主内容区域 */}
            <div className="main-content">
                {activeModule === 'home' && <DashboardHome />}
                {activeModule === 'employee' && <EmployeeManagement />}
                {activeModule === 'attendance' && <AttendanceManagement />}
                {activeModule === 'leave' && <LeaveManagement />}
                {activeModule === 'salary' && <SalaryManagement />}
            </div>
        </div>
    );
};

export default Dashboard;