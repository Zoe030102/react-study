import React, { useState, useEffect } from 'react';
import '../assets/dashboard.css';
import ErrorBoundary from './ErrorBoundary';
import axios from 'axios';

const AttendanceManagement = () => {
    // 使用状态存储考勤数据
    const [attendances, setAttendances] = useState([]);
    // 使用状态存储员工数据
    const [employees, setEmployees] = useState([]);
    // 添加加载状态
    const [loading, setLoading] = useState(true);
    // 添加错误状态
    const [error, setError] = useState(null);

    // 获取考勤和员工数据
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // 获取考勤数据
                const attendanceRes = await axios.get('/api/attendances');
                setAttendances(attendanceRes.data);

                // 获取员工数据
                const employeeRes = await axios.get('/api/employees');
                setEmployees(employeeRes.data);

                setLoading(false);
            } catch (err) {
                console.error('获取数据失败:', err);
                setError('获取数据失败，请检查网络连接或服务器状态');
                setLoading(false);

                // 如果API请求失败，回退到localStorage
                const savedAttendances = localStorage.getItem('attendances');
                if (savedAttendances) {
                    setAttendances(JSON.parse(savedAttendances));
                }

                const savedEmployees = localStorage.getItem('employees');
                if (savedEmployees) {
                    setEmployees(JSON.parse(savedEmployees));
                }
            }
        };

        fetchData();
    }, []);

    // 当考勤数据变化时，保存到localStorage作为备份
    useEffect(() => {
        if (attendances.length > 0) {
            localStorage.setItem('attendances', JSON.stringify(attendances));
        }
    }, [attendances]);

    // 获取当前日期
    const today = new Date().toISOString().split('T')[0];

    // 记录今日考勤
    const handleRecordAttendance = async () => {
        // 为所有员工创建今日考勤记录
        const newAttendances = employees.map(employee => ({
            employeeId: employee.id,
            employeeName: employee.name,
            date: today,
            status: '出勤', // 默认为出勤
            checkInTime: new Date().toLocaleTimeString(),
            checkOutTime: '',
            notes: ''
        }));

        try {
            // 删除今日已有的记录
            setAttendances(prev => prev.filter(a => !a.date.includes(today)));

            // 添加新记录到后端
            for (const attendance of newAttendances) {
                await axios.post('/api/attendances', attendance);
            }

            // 重新获取考勤数据
            const response = await axios.get('/api/attendances');
            setAttendances(response.data);

            alert('已成功记录今日考勤！');
        } catch (err) {
            console.error('记录考勤失败:', err);
            alert('记录考勤失败，请稍后重试');

            // 如果API请求失败，回退到本地操作
            setAttendances(prev => {
                // 过滤掉今天已有的记录
                const filtered = prev.filter(a => !a.date.includes(today));
                return [...filtered, ...newAttendances.map(a => ({
                    ...a,
                    id: `${a.employeeId}-${today}`
                }))];
            });
        }
    };

    // 查看历史考勤
    const handleViewHistory = () => {
        alert('查看历史考勤功能即将上线');
    };

    // 更新考勤状态
    const handleStatusChange = async (id, newStatus) => {
        try {
            await axios.put(`/api/attendances/${id}`, { status: newStatus });

            // 更新本地状态
            setAttendances(prev =>
                prev.map(attendance =>
                    attendance.id === id
                        ? { ...attendance, status: newStatus }
                        : attendance
                )
            );
        } catch (err) {
            console.error('更新考勤状态失败:', err);
            alert('更新考勤状态失败，请稍后重试');

            // 如果API请求失败，仍然更新本地状态
            setAttendances(prev =>
                prev.map(attendance =>
                    attendance.id === id
                        ? { ...attendance, status: newStatus }
                        : attendance
                )
            );
        }
    };

    // 签退
    const handleCheckOut = async (id) => {
        try {
            const checkOutTime = new Date().toLocaleTimeString();
            await axios.put(`/api/attendances/${id}`, { checkOutTime });

            // 更新本地状态
            setAttendances(prev =>
                prev.map(a =>
                    a.id === id
                        ? { ...a, checkOutTime }
                        : a
                )
            );
        } catch (err) {
            console.error('签退失败:', err);
            alert('签退失败，请稍后重试');

            // 如果API请求失败，仍然更新本地状态
            setAttendances(prev =>
                prev.map(a =>
                    a.id === id
                        ? { ...a, checkOutTime: new Date().toLocaleTimeString() }
                        : a
                )
            );
        }
    };

    // 过滤出今日的考勤记录
    const todayAttendances = attendances.filter(a => a.date && a.date.includes(today));

    if (loading) return <div className="loading">加载中...</div>;
    if (error && attendances.length === 0) return <div className="error">{error}</div>;

    return (
        <ErrorBoundary>
            <div className="attendance-management">
                <header className="dashboard-header">
                    <h1>考勤管理</h1>
                    <div className="header-actions">
                        <button
                            className="record-attendance-btn"
                            onClick={handleRecordAttendance}
                        >
                            记录今日考勤
                        </button>
                        <button
                            className="view-history-btn"
                            onClick={handleViewHistory}
                        >
                            查看历史考勤
                        </button>
                    </div>
                </header>

                <div className="dashboard-content">
                    <h2>今日考勤 ({today})</h2>
                    {todayAttendances.length > 0 ? (
                        <table className="attendance-table">
                            <thead>
                                <tr>
                                    <th>员工ID</th>
                                    <th>员工姓名</th>
                                    <th>日期</th>
                                    <th>状态</th>
                                    <th>签到时间</th>
                                    <th>签退时间</th>
                                    <th>备注</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                {todayAttendances.map(attendance => (
                                    <tr key={attendance.id}>
                                        <td>{attendance.employeeId}</td>
                                        <td>{attendance.employeeName}</td>
                                        <td>{attendance.date}</td>
                                        <td>{attendance.status}</td>
                                        <td>{attendance.checkInTime}</td>
                                        <td>
                                            {attendance.checkOutTime ||
                                                <button
                                                    onClick={() => handleCheckOut(attendance.id)}
                                                >
                                                    签退
                                                </button>
                                            }
                                        </td>
                                        <td>{attendance.notes}</td>
                                        <td>
                                            <select
                                                value={attendance.status}
                                                onChange={(e) => handleStatusChange(attendance.id, e.target.value)}
                                            >
                                                <option value="出勤">出勤</option>
                                                <option value="迟到">迟到</option>
                                                <option value="早退">早退</option>
                                                <option value="缺勤">缺勤</option>
                                                <option value="请假">请假</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>今日暂无考勤记录，请点击"记录今日考勤"按钮。</p>
                    )}
                </div>
            </div>
        </ErrorBoundary>
    );
};

export default AttendanceManagement;