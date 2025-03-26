'use client';
import React, { useState, useEffect } from 'react';
import '../styles/dashboard.css';

const EmployeeManagement = () => {
    const [employees, setEmployees] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        department: '',
        position: '',
        gender: '男',
        age: '',
        phone: '',
        photo: ''
    });

    // 获取员工数据
    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await fetch('/api/employees');
                if (response.ok) {
                    const data = await response.json();
                    setEmployees(data);
                } else {
                    console.error('获取员工数据失败');
                }
            } catch (error) {
                console.error('获取员工数据失败:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEmployees();
    }, []);

    // 处理输入变化
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // 添加新员工
    const handleAddClick = () => {
        setIsAdding(true);
        setFormData({
            name: '',
            department: '',
            position: '',
            gender: '男',
            age: '',
            phone: '',
            photo: ''
        });
    };

    // 保存新员工
    const handleSaveNew = async () => {
        try {
            const response = await fetch('/api/employees', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const newEmployee = await response.json();
                setEmployees(prev => [...prev, newEmployee]);
                setIsAdding(false);
            } else {
                console.error('添加员工失败');
            }
        } catch (error) {
            console.error('添加员工失败:', error);
        }
    };

    // 取消添加
    const handleCancelAdd = () => {
        setIsAdding(false);
    };

    // 编辑员工
    const handleEditClick = (id) => {
        const employee = employees.find(emp => emp.id === id);
        if (employee) {
            setEditingId(id);
            setFormData(employee);
        }
    };

    // 保存编辑
    const handleSaveEdit = async () => {
        try {
            const response = await fetch(`/api/employees/${editingId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const updatedEmployee = await response.json();
                setEmployees(prev => prev.map(emp => emp.id === editingId ? updatedEmployee : emp));
                setEditingId(null);
            } else {
                console.error('更新员工失败');
            }
        } catch (error) {
            console.error('更新员工失败:', error);
        }
    };

    // 取消编辑
    const handleCancelEdit = () => {
        setEditingId(null);
    };

    // 删除员工
    const handleDeleteClick = async (id) => {
        if (window.confirm('确定要删除这名员工吗？')) {
            try {
                const response = await fetch(`/api/employees/${id}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    setEmployees(prev => prev.filter(emp => emp.id !== id));
                } else {
                    console.error('删除员工失败');
                }
            } catch (error) {
                console.error('删除员工失败:', error);
            }
        }
    };

    if (isLoading) {
        return <div className="loading">加载中...</div>;
    }

    return (
        <div className="employee-management">
            <h1>员工管理</h1>

            {/* 添加员工按钮 */}
            {!isAdding && !editingId && (
                <button className="add-btn" onClick={handleAddClick}>添加员工</button>
            )}

            {/* 添加员工表单 */}
            {isAdding && (
                <div className="employee-form">
                    <h2>添加员工</h2>
                    <div className="form-group">
                        <label>姓名</label>
                        <input type="text" name="name" value={formData.name} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label>部门</label>
                        <input type="text" name="department" value={formData.department} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label>职位</label>
                        <input type="text" name="position" value={formData.position} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label>性别</label>
                        <select name="gender" value={formData.gender} onChange={handleInputChange}>
                            <option value="男">男</option>
                            <option value="女">女</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>年龄</label>
                        <input type="number" name="age" value={formData.age} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label>电话</label>
                        <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label>照片URL</label>
                        <input type="text" name="photo" value={formData.photo} onChange={handleInputChange} />
                    </div>
                    <div className="form-buttons">
                        <button onClick={handleSaveNew}>保存</button>
                        <button onClick={handleCancelAdd}>取消</button>
                    </div>
                </div>
            )}

            {/* 编辑员工表单 */}
            {editingId && (
                <div className="employee-form">
                    <h2>编辑员工</h2>
                    <div className="form-group">
                        <label>姓名</label>
                        <input type="text" name="name" value={formData.name} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label>部门</label>
                        <input type="text" name="department" value={formData.department} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label>职位</label>
                        <input type="text" name="position" value={formData.position} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label>性别</label>
                        <select name="gender" value={formData.gender} onChange={handleInputChange}>
                            <option value="男">男</option>
                            <option value="女">女</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>年龄</label>
                        <input type="number" name="age" value={formData.age} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label>电话</label>
                        <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label>照片URL</label>
                        <input type="text" name="photo" value={formData.photo} onChange={handleInputChange} />
                    </div>
                    <div className="form-buttons">
                        <button onClick={handleSaveEdit}>保存</button>
                        <button onClick={handleCancelEdit}>取消</button>
                    </div>
                </div>
            )}

            {/* 员工列表 */}
            {!isAdding && !editingId && (
                <div className="employee-list">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>姓名</th>
                                <th>部门</th>
                                <th>职位</th>
                                <th>性别</th>
                                <th>年龄</th>
                                <th>电话</th>
                                <th>照片</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map(employee => (
                                <tr key={employee.id}>
                                    <td>{employee.id}</td>
                                    <td>{employee.name}</td>
                                    <td>{employee.department}</td>
                                    <td>{employee.position}</td>
                                    <td>{employee.gender}</td>
                                    <td>{employee.age}</td>
                                    <td>{employee.phone}</td>
                                    <td>
                                        {employee.photo && (
                                            <img
                                                src={employee.photo}
                                                alt={employee.name}
                                                style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                                            />
                                        )}
                                    </td>
                                    <td>
                                        <button onClick={() => handleEditClick(employee.id)}>编辑</button>
                                        <button onClick={() => handleDeleteClick(employee.id)}>删除</button>
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

export default EmployeeManagement;