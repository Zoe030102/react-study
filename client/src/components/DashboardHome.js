import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/dashboard.css';

const DashboardHome = () => {
    const navigate = useNavigate();

    // 使用状态来存储动态数据
    const [stats, setStats] = useState({
        totalEmployees: 0,
        pendingLeaves: 0,
        todayAttendance: 0,
        pendingSalaries: 0
    });

    // 在组件挂载时获取数据
    useEffect(() => {
        // 获取员工数据
        const fetchEmployeeData = async () => {
            try {
                // 如果有后端API，可以使用以下代码获取数据
                // const response = await axios.get('/api/dashboard/stats');
                // setStats(response.data);

                // 临时方案：从localStorage获取员工数据
                const employeesData = localStorage.getItem('employees');
                const employees = employeesData ? JSON.parse(employeesData) : [];

                // 获取请假数据
                const leavesData = localStorage.getItem('leaves');
                const leaves = leavesData ? JSON.parse(leavesData) : [];
                const pendingLeaves = leaves.filter(leave => leave.status === '待审批').length;

                // 获取薪资数据
                const salaryData = localStorage.getItem('salaries');
                const salaries = salaryData ? JSON.parse(salaryData) : [];
                const pendingSalaries = salaries.filter(salary => salary.status === '待发放').length;

                // 计算今日出勤（这里只是示例，实际应该从考勤记录中计算）
                const todayAttendance = employees.length - Math.floor(Math.random() * 5); // 随机减去几个人作为缺勤

                setStats({
                    totalEmployees: employees.length,
                    pendingLeaves,
                    todayAttendance: todayAttendance > 0 ? todayAttendance : 0,
                    pendingSalaries
                });
            } catch (error) {
                console.error('获取数据失败:', error);
                // 如果获取失败，使用默认值
                setStats({
                    totalEmployees: 0,
                    pendingLeaves: 0,
                    todayAttendance: 0,
                    pendingSalaries: 0
                });
            }
        };

        fetchEmployeeData();

        // 添加事件监听器，当localStorage变化时更新数据
        const handleStorageChange = () => {
            fetchEmployeeData();
        };

        window.addEventListener('storage', handleStorageChange);

        // 清理函数
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    // 导航到不同模块的处理函数
    const handleNavigate = (path) => {
        navigate(path);
    };

    return (
        <div className="dashboard-home">
            <h1>酒店管理系统</h1>
            <p className="welcome-text">欢迎回来，管理员！以下是系统概览。</p>

            <div className="dashboard-stats">
                <div className="stat-card">
                    <h3>员工总数</h3>
                    <p className="stat-value">{stats.totalEmployees}</p>
                    <button
                        className="stat-action-btn"
                        onClick={() => handleNavigate('/employee')}
                    >
                        查看员工
                    </button>
                </div>

                {/* 其他卡片保持不变 */}
                <div className="stat-card">
                    <h3>待处理请假</h3>
                    <p className="stat-value">{stats.pendingLeaves}</p>
                    <button
                        className="stat-action-btn"
                        onClick={() => handleNavigate('/leave')}
                    >
                        处理请假
                    </button>
                </div>
                <div className="stat-card">
                    <h3>今日出勤</h3>
                    <p className="stat-value">{stats.todayAttendance}</p>
                    <button
                        className="stat-action-btn"
                        onClick={() => handleNavigate('/attendance')}
                    >
                        查看考勤
                    </button>
                </div>
                <div className="stat-card">
                    <h3>待发薪资</h3>
                    <p className="stat-value">{stats.pendingSalaries}</p>
                    <button
                        className="stat-action-btn"
                        onClick={() => handleNavigate('/salary')}
                    >
                        管理薪资
                    </button>
                </div>
            </div>

            {/* 快捷操作部分保持不变 */}
            <div className="quick-actions">
                <h2>快捷操作</h2>
                <div className="action-buttons">
                    <button
                        className="action-btn employee-btn"
                        onClick={() => handleNavigate('/employee')}
                    >
                        <i className="fas fa-user-plus"></i> 添加新员工
                    </button>
                    <button
                        className="action-btn leave-btn"
                        onClick={() => handleNavigate('/leave')}
                    >
                        <i className="fas fa-calendar-alt"></i> 处理请假申请
                    </button>
                    <button
                        className="action-btn attendance-btn"
                        onClick={() => handleNavigate('/attendance')}
                    >
                        <i className="fas fa-clipboard-check"></i> 记录今日考勤
                    </button>
                    <button
                        className="action-btn salary-btn"
                        onClick={() => handleNavigate('/salary')}
                    >
                        <i className="fas fa-money-bill-wave"></i> 发放员工薪资
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;