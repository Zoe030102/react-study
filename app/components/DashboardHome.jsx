'use client';
import React, { useState, useEffect } from 'react';
import '../styles/dashboard.css';

const DashboardHome = () => {
    const [stats, setStats] = useState({
        totalEmployees: 0,
        attendanceToday: 0,
        pendingLeaves: 0,
        pendingSalaries: 0
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // 获取员工总数
                const employeesResponse = await fetch('/api/employees');
                const employees = await employeesResponse.json();

                // 获取今日考勤
                const today = new Date().toISOString().split('T')[0];
                const attendancesResponse = await fetch('/api/attendances');
                const attendances = await attendancesResponse.json();
                const todayAttendances = attendances.filter(a =>
                    new Date(a.date).toISOString().split('T')[0] === today
                );

                // 获取待审批请假
                const leavesResponse = await fetch('/api/leaves');
                const leaves = await leavesResponse.json();
                const pendingLeaves = leaves.filter(l => l.status === '待审批');

                // 获取待发放薪资
                const salariesResponse = await fetch('/api/salaries');
                const salaries = await salariesResponse.json();
                const pendingSalaries = salaries.filter(s => s.status === '未发放');

                setStats({
                    totalEmployees: employees.length,
                    attendanceToday: todayAttendances.length,
                    pendingLeaves: pendingLeaves.length,
                    pendingSalaries: pendingSalaries.length
                });
            } catch (error) {
                console.error('获取统计数据失败:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (isLoading) {
        return <div className="loading">加载中...</div>;
    }

    return (
        <div className="dashboard-home">
            <h1>仪表盘</h1>

            <div className="dashboard-stats">
                <div className="stat-card">
                    <h3>员工总数</h3>
                    <div className="stat-number">{stats.totalEmployees}</div>
                </div>

                <div className="stat-card">
                    <h3>今日考勤</h3>
                    <div className="stat-number">{stats.attendanceToday}</div>
                </div>

                <div className="stat-card">
                    <h3>待审批请假</h3>
                    <div className="stat-number">{stats.pendingLeaves}</div>
                </div>

                <div className="stat-card">
                    <h3>待发放薪资</h3>
                    <div className="stat-number">{stats.pendingSalaries}</div>
                </div>
            </div>

            <div className="quick-actions">
                <h2>快捷操作</h2>
                <div className="action-buttons">
                    <button onClick={() => window.location.href = '/dashboard?module=employee'}>管理员工</button>
                    <button onClick={() => window.location.href = '/dashboard?module=attendance'}>记录考勤</button>
                    <button onClick={() => window.location.href = '/dashboard?module=leave'}>处理请假</button>
                    <button onClick={() => window.location.href = '/dashboard?module=salary'}>发放薪资</button>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;