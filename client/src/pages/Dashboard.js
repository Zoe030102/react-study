import React, { useState } from 'react'; // 添加 useState 导入
import { Routes, Route } from 'react-router-dom';
import EmployeeManagement from '../components/EmployeeManagement';
// 删除 PerformanceManagement 导入
import LeaveManagement from '../components/LeaveManagement'; // 替换 TrainingManagement
import SalaryManagement from '../components/SalaryManagement';
import AttendanceManagement from '../components/AttendanceManagement';
import DashboardHome from '../components/DashboardHome';

const Dashboard = () => {
    const [employees] = useState([]);
    const [activeModule, setActiveModule] = useState('employee');

    const renderModule = () => {
        switch (activeModule) {
            case 'attendance':
                return <AttendanceManagement />;
            case 'salary':
                return <SalaryManagement />;
            case 'leave': // 修改为 leave
                return <LeaveManagement />; // 使用 LeaveManagement 替换 TrainingManagement
            default:
                return <EmployeeManagement employees={employees} />;
        }
    };

    return (
        <div className="dashboard-container">
            {/* 左侧导航栏 */}
            <div className="sidebar">
                <div className="sidebar-header">
                    <h2>人事管理系统</h2>
                </div>
                <nav>
                    <ul className="sidebar-menu">
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
                            className={activeModule === 'salary' ? 'active' : ''}
                            onClick={() => setActiveModule('salary')}
                        >
                            薪资管理
                        </li>
                        {/* 删除绩效管理菜单项 */}
                        <li
                            className={activeModule === 'leave' ? 'active' : ''} // 修改为 leave
                            onClick={() => setActiveModule('leave')} // 修改为 leave
                        >
                            请假管理 {/* 修改为请假管理 */}
                        </li>
                    </ul>
                </nav>
            </div>

            {/* 主内容区域 */}
            <div className="main-content">
                {/* 欢迎信息 */}
                <div className="welcome-section">
                    <h1>欢迎使用人事管理系统</h1>
                    <p>请从左侧导航栏选择您要操作的模块</p>
                </div>

                {/* 动态渲染模块 */}
                {renderModule()}
            </div>
        </div>
    );
};

export default Dashboard;

// 路由配置
// <Routes>
//     <Route path="/" element={<DashboardHome />} />
//     <Route path="/employee" element={<EmployeeManagement />} />
//     <Route path="/leave" element={<LeaveManagement />} />
//     <Route path="/salary" element={<SalaryManagement />} />
//     <Route path="/attendance" element={<AttendanceManagement />} />
// </Routes>
