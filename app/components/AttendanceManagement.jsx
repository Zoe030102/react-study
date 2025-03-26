'use client';
import React, { useState, useEffect } from 'react';
import '../styles/dashboard.css';

const AttendanceManagement = () => {
    const [attendances, setAttendances] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        employeeId: '',
        employeeName: '',
        date: new Date().toISOString().split('T')[0],
        status: '正常',
        checkInTime: '',
        checkOutTime: '',
        notes: ''
    });

    // 获取考勤数据
    useEffect(() => {
        const fetchAttendances = async () => {
            try {
                const response = await fetch('/api/attendances');
                if (response.ok) {
                    const data = await response.json();
                    setAttendances(data);
                } else {
                    console.error('获取考勤数据失败');
                }
            } catch (error) {
                console.error('获取考勤数据失败:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAttendances();
    }, []);

    // 处理输入变化
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // 添加新考勤记录
    const handleAddClick = () => {
        setIsAdding(true);
        setFormData({
            employeeId: '',
            employeeName: '',
            date: new Date().toISOString().split('T')[0],
            status: '正常',
            checkInTime: '',
            checkOutTime: '',
            notes: ''
        });
    };

    // 保存新考勤记录
    const handleSaveNew = async () => {
        try {
            const response = await fetch('/api/attendances', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const newAttendance = await response.json();
                setAttendances(prev => [...prev, newAttendance]);
                setIsAdding(false);
            } else {
                console.error('添加考勤记录失败');
            }
        } catch (error) {
            console.error('添加考勤记录失败:', error);
        }
    };

    // 取消添加
    const handleCancelAdd = () => {
        setIsAdding(false);
    };

    // 编辑考勤记录
    const handleEditClick = (id) => {
        const attendance = attendances.find(att => att.id === id);
        if (attendance) {
            setEditingId(id);
            setFormData(attendance);
        }
    };

    // 保存编辑
    const handleSaveEdit = async () => {
        try {
            const response = await fetch(`/api/attendances/${editingId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const updatedAttendance = await response.json();
                setAttendances(prev => prev.map(att => att.id === editingId ? updatedAttendance : att));
                setEditingId(null);
            } else {
                console.error('更新考勤记录失败');
            }
        } catch (error) {
            console.error('更新考勤记录失败:', error);
        }
    };

    // 取消编辑
    const handleCancelEdit = () => {
        setEditingId(null);
    };

    // 删除考勤记录
    const handleDeleteClick = async (id) => {
        if (window.confirm('确定要删除这条考勤记录吗？')) {
            try {
                const response = await fetch(`/api/attendances/${id}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    setAttendances(prev => prev.filter(att => att.id !== id));
                } else {
                    console.error('删除考勤记录失败');
                }
            } catch (error) {
                console.error('删除考勤记录失败:', error);
            }
        }
    };

    if (isLoading) {
        return <div className="loading">加载中...</div>;
    }

    return (
        <div className="attendance-management">
            <h1>考勤管理</h1>

            {/* 添加考勤按钮 */}
            {!isAdding && !editingId && (
                <button className="add-btn" onClick={handleAddClick}>添加考勤记录</button>
            )}

            {/* 添加考勤表单 */}
            {isAdding && (
                <div className="attendance-form">
                    <h2>添加考勤记录</h2>
                    <div className="form-group">
                        <label>员工ID</label>
                        <input type="text" name="employeeId" value={formData.employeeId} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label>员工姓名</label>
                        <input type="text" name="employeeName" value={formData.employeeName} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label>日期</label>
                        <input type="date" name="date" value={formData.date} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label>状态</label>
                        <select name="status" value={formData.status} onChange={handleInputChange}>
                            <option value="正常">正常</option>
                            <option value="迟到">迟到</option>
                            <option value="早退">早退</option>
                            <option value="缺勤">缺勤</option>
                            <option value="请假">请假</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>签到时间</label>
                        <input type="time" name="checkInTime" value={formData.checkInTime} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label>签退时间</label>
                        <input type="time" name="checkOutTime" value={formData.checkOutTime} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label>备注</label>
                        <textarea name="notes" value={formData.notes} onChange={handleInputChange}></textarea>
                    </div>
                    <div className="form-buttons">
                        <button onClick={handleSaveNew}>保存</button>
                        <button onClick={handleCancelAdd}>取消</button>
                    </div>
                </div>
            )}

            {/* 编辑考勤表单 */}
            {editingId && (
                <div className="attendance-form">
                    <h2>编辑考勤记录</h2>
                    <div className="form-group">
                        <label>员工ID</label>
                        <input type="text" name="employeeId" value={formData.employeeId} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label>员工姓名</label>
                        <input type="text" name="employeeName" value={formData.employeeName} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label>日期</label>
                        <input type="date" name="date" value={formData.date} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label>状态</label>
                        <select name="status" value={formData.status} onChange={handleInputChange}>
                            <option value="正常">正常</option>
                            <option value="迟到">迟到</option>
                            <option value="早退">早退</option>
                            <option value="缺勤">缺勤</option>
                            <option value="请假">请假</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>签到时间</label>
                        <input type="time" name="checkInTime" value={formData.checkInTime} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label>签退时间</label>
                        <input type="time" name="checkOutTime" value={formData.checkOutTime} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label>备注</label>
                        <textarea name="notes" value={formData.notes} onChange={handleInputChange}></textarea>
                    </div>
                    <div className="form-buttons">
                        <button onClick={handleSaveEdit}>保存</button>
                        <button onClick={handleCancelEdit}>取消</button>
                    </div>
                </div>
            )}

            {/* 考勤列表 */}
            {!isAdding && !editingId && (
                <div className="attendance-list">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
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
                            {attendances.map(attendance => (
                                <tr key={attendance.id}>
                                    <td>{attendance.id}</td>
                                    <td>{attendance.employeeid}</td>
                                    <td>{attendance.employeename}</td>
                                    <td>{new Date(attendance.date).toLocaleDateString()}</td>
                                    <td>{attendance.status}</td>
                                    <td>{attendance.checkintime}</td>
                                    <td>{attendance.checkouttime}</td>
                                    <td>{attendance.notes}</td>
                                    <td>
                                        <button onClick={() => handleEditClick(attendance.id)}>编辑</button>
                                        <button onClick={() => handleDeleteClick(attendance.id)}>删除</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AttendanceManagement;