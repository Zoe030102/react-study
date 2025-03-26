'use client';
import React, { useState, useEffect } from 'react';
import '../styles/dashboard.css';

const LeaveManagement = () => {
    const [leaves, setLeaves] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        employeeId: '',
        employeeName: '',
        leaveType: '年假',
        startDate: '',
        endDate: '',
        duration: '',
        reason: '',
        status: '待审批'
    });

    // 获取请假数据
    useEffect(() => {
        const fetchLeaves = async () => {
            try {
                const response = await fetch('/api/leaves');
                if (response.ok) {
                    const data = await response.json();
                    setLeaves(data);
                } else {
                    console.error('获取请假数据失败');
                }
            } catch (error) {
                console.error('获取请假数据失败:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLeaves();
    }, []);

    // 处理输入变化
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // 自动计算请假时长
        if (name === 'startDate' || name === 'endDate') {
            if (formData.startDate && formData.endDate) {
                const start = new Date(name === 'startDate' ? value : formData.startDate);
                const end = new Date(name === 'endDate' ? value : formData.endDate);

                if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
                    const diffTime = Math.abs(end - start);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

                    setFormData(prev => ({
                        ...prev,
                        duration: `${diffDays}天`
                    }));
                }
            }
        }
    };

    // 添加新请假记录
    const handleAddClick = () => {
        setIsAdding(true);
        setFormData({
            employeeId: '',
            employeeName: '',
            leaveType: '年假',
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date().toISOString().split('T')[0],
            duration: '1天',
            reason: '',
            status: '待审批'
        });
    };

    // 保存新请假记录
    const handleSaveNew = async () => {
        try {
            const response = await fetch('/api/leaves', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const newLeave = await response.json();
                setLeaves(prev => [...prev, newLeave]);
                setIsAdding(false);
            } else {
                console.error('添加请假记录失败');
            }
        } catch (error) {
            console.error('添加请假记录失败:', error);
        }
    };

    // 取消添加
    const handleCancelAdd = () => {
        setIsAdding(false);
    };

    // 编辑请假记录
    const handleEditClick = (id) => {
        const leave = leaves.find(l => l.id === id);
        if (leave) {
            setEditingId(id);
            setFormData(leave);
        }
    };

    // 保存编辑
    const handleSaveEdit = async () => {
        try {
            const response = await fetch(`/api/leaves/${editingId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const updatedLeave = await response.json();
                setLeaves(prev => prev.map(l => l.id === editingId ? updatedLeave : l));
                setEditingId(null);
            } else {
                console.error('更新请假记录失败');
            }
        } catch (error) {
            console.error('更新请假记录失败:', error);
        }
    };

    // 取消编辑
    const handleCancelEdit = () => {
        setEditingId(null);
    };

    // 删除请假记录
    const handleDeleteClick = async (id) => {
        if (window.confirm('确定要删除这条请假记录吗？')) {
            try {
                const response = await fetch(`/api/leaves/${id}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    setLeaves(prev => prev.filter(l => l.id !== id));
                } else {
                    console.error('删除请假记录失败');
                }
            } catch (error) {
                console.error('删除请假记录失败:', error);
            }
        }
    };

    // 审批请假
    const handleApproveClick = async (id) => {
        try {
            const leave = leaves.find(l => l.id === id);
            if (!leave) return;

            const updatedLeave = { ...leave, status: '已批准' };

            const response = await fetch(`/api/leaves/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedLeave),
            });

            if (response.ok) {
                const result = await response.json();
                setLeaves(prev => prev.map(l => l.id === id ? result : l));
            } else {
                console.error('审批请假失败');
            }
        } catch (error) {
            console.error('审批请假失败:', error);
        }
    };

    // 拒绝请假
    const handleRejectClick = async (id) => {
        try {
            const leave = leaves.find(l => l.id === id);
            if (!leave) return;

            const updatedLeave = { ...leave, status: '已拒绝' };

            const response = await fetch(`/api/leaves/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedLeave),
            });

            if (response.ok) {
                const result = await response.json();
                setLeaves(prev => prev.map(l => l.id === id ? result : l));
            } else {
                console.error('拒绝请假失败');
            }
        } catch (error) {
            console.error('拒绝请假失败:', error);
        }
    };

    if (isLoading) {
        return <div className="loading">加载中...</div>;
    }

    return (
        <div className="leave-management">
            <h1>请假管理</h1>

            {/* 添加请假按钮 */}
            {!isAdding && !editingId && (
                <button className="add-btn" onClick={handleAddClick}>申请请假</button>
            )}

            {/* 添加请假表单 */}
            {isAdding && (
                <div className="leave-form">
                    <h2>申请请假</h2>
                    <div className="form-group">
                        <label>员工ID</label>
                        <input type="text" name="employeeId" value={formData.employeeId} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label>员工姓名</label>
                        <input type="text" name="employeeName" value={formData.employeeName} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label>请假类型</label>
                        <select name="leaveType" value={formData.leaveType} onChange={handleInputChange}>
                            <option value="年假">年假</option>
                            <option value="事假">事假</option>
                            <option value="病假">病假</option>
                            <option value="婚假">婚假</option>
                            <option value="产假">产假</option>
                            <option value="丧假">丧假</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>开始日期</label>
                        <input type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label>结束日期</label>
                        <input type="date" name="endDate" value={formData.endDate} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label>请假时长</label>
                        <input type="text" name="duration" value={formData.duration} readOnly />
                    </div>
                    <div className="form-group">
                        <label>请假原因</label>
                        <textarea name="reason" value={formData.reason} onChange={handleInputChange}></textarea>
                    </div>
                    <div className="form-buttons">
                        <button onClick={handleSaveNew}>提交</button>
                        <button onClick={handleCancelAdd}>取消</button>
                    </div>
                </div>
            )}

            {/* 编辑请假表单 */}
            {editingId && (
                <div className="leave-form">
                    <h2>编辑请假申请</h2>
                    <div className="form-group">
                        <label>员工ID</label>
                        <input type="text" name="employeeId" value={formData.employeeId} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label>员工姓名</label>
                        <input type="text" name="employeeName" value={formData.employeeName} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label>请假类型</label>
                        <select name="leaveType" value={formData.leaveType} onChange={handleInputChange}>
                            <option value="年假">年假</option>
                            <option value="事假">事假</option>
                            <option value="病假">病假</option>
                            <option value="婚假">婚假</option>
                            <option value="产假">产假</option>
                            <option value="丧假">丧假</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>开始日期</label>
                        <input type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label>结束日期</label>
                        <input type="date" name="endDate" value={formData.endDate} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label>请假时长</label>
                        <input type="text" name="duration" value={formData.duration} readOnly />
                    </div>
                    <div className="form-group">
                        <label>请假原因</label>
                        <textarea name="reason" value={formData.reason} onChange={handleInputChange}></textarea>
                    </div>
                    <div className="form-group">
                        <label>状态</label>
                        <select name="status" value={formData.status} onChange={handleInputChange}>
                            <option value="待审批">待审批</option>
                            <option value="已批准">已批准</option>
                            <option value="已拒绝">已拒绝</option>
                        </select>
                    </div>
                    <div className="form-buttons">
                        <button onClick={handleSaveEdit}>保存</button>
                        <button onClick={handleCancelEdit}>取消</button>
                    </div>
                </div>
            )}

            {/* 请假列表 */}
            {!isAdding && !editingId && (
                <div className="leave-list">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>员工ID</th>
                                <th>员工姓名</th>
                                <th>请假类型</th>
                                <th>开始日期</th>
                                <th>结束日期</th>
                                <th>时长</th>
                                <th>原因</th>
                                <th>状态</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaves.map(leave => (
                                <tr key={leave.id}>
                                    <td>{leave.id}</td>
                                    <td>{leave.employeeid}</td>
                                    <td>{leave.employeename}</td>
                                    <td>{leave.leavetype}</td>
                                    <td>{new Date(leave.startdate).toLocaleDateString()}</td>
                                    <td>{new Date(leave.enddate).toLocaleDateString()}</td>
                                    <td>{leave.duration}</td>
                                    <td>{leave.reason}</td>
                                    <td>{leave.status}</td>
                                    <td>
                                        <button onClick={() => handleEditClick(leave.id)}>编辑</button>
                                        <button onClick={() => handleDeleteClick(leave.id)}>删除</button>
                                        {leave.status === '待审批' && (
                                            <>
                                                <button
                                                    onClick={() => handleApproveClick(leave.id)}
                                                    style={{ backgroundColor: '#4CAF50', color: 'white' }}
                                                >
                                                    批准
                                                </button>
                                                <button
                                                    onClick={() => handleRejectClick(leave.id)}
                                                    style={{ backgroundColor: '#F44336', color: 'white' }}
                                                >
                                                    拒绝
                                                </button>
                                            </>
                                        )}
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

export default LeaveManagement;