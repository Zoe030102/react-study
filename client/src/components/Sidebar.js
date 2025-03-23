import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../assets/sidebar.css';

const Sidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const location = useLocation();

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    const menuItems = [
        { id: 'dashboard', label: '首页', icon: 'home' },
        { id: 'employee', label: '员工管理', icon: 'users' },
        // 删除绩效管理项
        { id: 'leave', label: '请假管理', icon: 'calendar' },
        { id: 'salary', label: '薪资管理', icon: 'money-bill' },
        { id: 'attendance', label: '考勤管理', icon: 'clock' }
    ];

    // 修改样式和结构
    return (
        <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-header">
                <h2>{isCollapsed ? 'H' : '酒店管理系统'}</h2>
                <button onClick={toggleSidebar} className="collapse-btn">
                    {isCollapsed ? '→' : '←'}
                </button>
            </div>
            <nav className="sidebar-nav">
                <ul>
                    {menuItems.map(item => (
                        <li
                            key={item.id}
                            className={location.pathname.includes(item.id) ? 'active' : ''}
                        >
                            <Link to={`/${item.id}`}>
                                <i className={`fas fa-${item.icon}`}></i>
                                {!isCollapsed && <span>{item.label}</span>}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;