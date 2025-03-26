'use client';
import React, { useState, useEffect } from 'react';
import '../styles/dashboard.css';

const SalaryManagement = () => {
    const [salaries, setSalaries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        employeeId: '',
        employeeName: '',
        month: '',
        baseSalary: '',
        bonus: '0',
        deduction: '0',
        totalSalary: '',
        status: '未发放',
        paymentDate: ''
    });

    // 获取薪资数据
    useEffect(() => {
        const fetchSalaries = async () => {
            try {
                const response = await fetch('/api/salaries');
                if (response.ok) {
                    const data = await response.json();
                    setSalaries(data);
                } else {
                    console.error('获取薪资数据失败');
                }
            } catch (error) {
                console.error('获取薪资数据失败:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSalaries();
    }, []);

    // 处理输入变化
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // 自动计算总薪资
        if (name === 'baseSalary' || name === 'bonus' || name === 'deduction') {
            const baseSalary = parseFloat(name === 'baseSalary' ? value : formData.baseSalary) || 0;
            const bonus = parseFloat(name === 'bonus' ? value : formData.bonus) || 0;
            const deduction = parseFloat(name === 'deduction' ? value : formData.deduction) || 0;

            const totalSalary = baseSalary + bonus - deduction;

            setFormData(prev => ({
                ...prev,
                totalSalary: totalSalary.toString()
            }));
        }
    };

    // 添加新薪资记录
    const handleAddClick = () => {
        setIsAdding(true);
        const currentDate = new Date();
        const currentMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;

        setFormData({
            employeeId: '',
            employeeName: '',
            month: currentMonth,
            baseSalary: '',
            bonus: '0',
            deduction: '0',
            totalSalary: '',
            status: '未发放',
            paymentDate: ''
        });
    };

    // 保存新薪资记录
    const handleSaveNew = async () => {
        try {
            const response = await fetch('/api/salaries', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const newSalary = await response.json();
                setSalaries(prev => [...prev, newSalary]);
                setIsAdding(false);
            } else {
                console.error('添加薪资记录失败');
            }
        } catch (error) {
            console.error('添加薪资记录失败:', error);
        }
    };

    // 取消添加
    const handleCancelAdd = () => {
        setIsAdding(false);
    };

    // 编辑薪资记录
    const handleEditClick = (id) => {
        const salary = salaries.find(s => s.id === id);
        if (salary) {
            setEditingId(id);
            setFormData(salary);
        }
    };

    // 保存编辑
    const handleSaveEdit = async () => {
        try {
            const response = await fetch(`/api/salaries/${editingId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const updatedSalary = await response.json();
                setSalaries(prev => prev.map(s => s.id === editingId ? updatedSalary : s));
                setEditingId(null);
            } else {
                console.error('更新薪资记录失败');
            }
        } catch (error) {
            console.error('更新薪资记录失败:', error);
        }
    };

    // 取消编辑
    const handleCancelEdit = () => {
        setEditingId(null);
    };

    // 删除薪资记录
    const handleDeleteClick = async (id) => {
        if (window.confirm('确定要删除这条薪资记录吗？')) {
            try {
                const response = await fetch(`/api/salaries/${id}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    setSalaries(prev => prev.filter(s => s.id !== id));
                } else {
                    console.error('删除薪资记录失败');
                }
            } catch (error) {
                console.error('删除薪资记录失败:', error);
            }
        }
    };

    // 发放薪资
    const handlePayClick = async (id) => {
        try {
            const salary = salaries.find(s => s.id === id);
            if (!salary) return;

            const updatedSalary = {
                ...salary,
                status: '已发放',
                paymentDate: new Date().toISOString().split('T')[0]
            };

            const response = await fetch(`/api/salaries/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedSalary),
            });

            if (response.ok) {
                const result = await response.json();
                setSalaries(prev => prev.map(s => s.id === id ? result : s));
            } else {
                console.error('发放薪资失败');
            }
        } catch (error) {
            console.error('发放薪资失败:', error);
        }
    };

    if (isLoading) {
        return <div className="loading">加载中...</div>;
    }

    return (
        <div className="salary-management">
            <h1>薪资管理</h1>

            {/* 添加薪资按钮 */}
            {!isAdding && !editingId && (
                <button className="add-btn" onClick={handleAddClick}>添加薪资记录</button>
            )}

            {/* 添加薪资表单 */}
            {isAdding && (
                <div className="salary-form">
                    <h2>添加薪资记录</h2>
                    <div className="form-group">
                        <label>员工ID</label>
                        <input type="text" name="employeeId" value={formData.employeeId} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label>员工姓名</label>
                        <input type="text" name="employeeName" value={formData.employeeName} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label>月份</label>
                        <input type="month" name="month" value={formData.month} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label>基本工资</label>
                        <input type="number" name="baseSalary" value={formData.baseSalary} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label>奖金</label>
                        <input type="number" name="bonus" value={formData.bonus} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label>扣除</label>
                        <input type="number" name="deduction" value={formData.deduction} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label>总薪资</label>
                        <input type="number" name="totalSalary" value={formData.totalSalary} readOnly />
                    </div>
                    <div className="form-buttons">
                        <button onClick={handleSaveNew}>保存</button>
                        <button onClick={handleCancelAdd}>取消</button>
                    </div>
                </div>
            )}

            {/* 编辑薪资表单 */}
            {editingId && (
                <div className="salary-form">
                    <h2>编辑薪资记录</h2>
                    <div className="form-group">
                        <label>员工ID</label>
                        <input type="text" name="employeeId" value={formData.employeeId} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label>员工姓名</label>
                        <input type="text" name="employeeName" value={formData.employeeName} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label>月份</label>
                        <input type="month" name="month" value={formData.month} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label>基本工资</label>
                        <input type="number" name="baseSalary" value={formData.baseSalary} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label>奖金</label>
                        <input type="number" name="bonus" value={formData.bonus} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label>扣除</label>
                        <input type="number" name="deduction" value={formData.deduction} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label>总薪资</label>
                        <input type="number" name="totalSalary" value={formData.totalSalary} readOnly />
                    </div>
                    <div className="form-group">
                        <label>状态</label>
                        <select name="status" value={formData.status} onChange={handleInputChange}>
                            <option value="未发放">未发放</option>
                            <option value="已发放">已发放</option>
                        </select>
                    </div>
                    {formData.status === '已发放' && (
                        <div className="form-group">
                            <label>发放日期</label>
                            <input type="date" name="paymentDate" value={formData.paymentDate} onChange={handleInputChange} />
                        </div>
                    )}
                    <div className="form-buttons">
                        <button onClick={handleSaveEdit}>保存</button>
                        <button onClick={handleCancelEdit}>取消</button>
                    </div>
                </div>
            )}

            {/* 薪资列表 */}
            {!isAdding && !editingId && (
                <div className="salary-list">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>员工ID</th>
                                <th>员工姓名</th>
                                <th>月份</th>
                                <th>基本工资</th>
                                <th>奖金</th>
                                <th>扣除</th>
                                <th>总薪资</th>
                                <th>状态</th>
                                <th>发放日期</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            {salaries.map(salary => (
                                <tr key={salary.id}>
                                    <td>{salary.id}</td>
                                    <td>{salary.employeeid}</td>
                                    <td>{salary.employeename}</td>
                                    <td>{salary.month}</td>
                                    <td>{salary.basesalary}</td>
                                    <td>{salary.bonus}</td>
                                    <td>{salary.deduction}</td>
                                    <td>{salary.totalsalary}</td>
                                    <td>{salary.status}</td>
                                    <td>{salary.paymentdate ? new Date(salary.paymentdate).toLocaleDateString() : '-'}</td>
                                    <td>
                                        <button onClick={() => handleEditClick(salary.id)}>编辑</button>
                                        <button onClick={() => handleDeleteClick(salary.id)}>删除</button>
                                        {salary.status === '未发放' && (
                                            <button
                                                onClick={() => handlePayClick(salary.id)}
                                                style={{ backgroundColor: '#4CAF50', color: 'white' }}
                                            >
                                                发放
                                            </button>
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

export default SalaryManagement;