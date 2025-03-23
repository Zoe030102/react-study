import React, { useState, useEffect } from 'react';
import '../assets/dashboard.css';
import ErrorBoundary from './ErrorBoundary';
// 删除这一行: import axios from 'axios';

const EmployeeManagement = () => {
    // 从localStorage加载员工数据，如果没有则使用默认数据
    const [employees, setEmployees] = useState(() => {
        const savedEmployees = localStorage.getItem('employees');
        return savedEmployees ? JSON.parse(savedEmployees) : [
            {
                id: '1',
                name: '张三',
                department: '人事部',
                position: '经理',
                gender: '男',
                age: '35',
                phone: '13800138000',
                photo: 'https://via.placeholder.com/50'
            },
            {
                id: '2',
                name: '李四',
                department: '财务部',
                position: '主管',
                gender: '女',
                age: '28',
                phone: '13900139000',
                photo: 'https://via.placeholder.com/50'
            }
        ];
    });

    // 当employees变化时，保存到localStorage
    useEffect(() => {
        localStorage.setItem('employees', JSON.stringify(employees));
        // 触发storage事件，通知其他组件（如DashboardHome）数据已更新
        window.dispatchEvent(new Event('storage'));
    }, [employees]);

    // 新增状态用于跟踪是否处于添加模式
    const [isAdding, setIsAdding] = useState(false);
    // 新增状态用于跟踪正在编辑的行ID
    const [editingId, setEditingId] = useState(null);
    // 表单数据
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        department: '',
        position: '',
        gender: '男',
        age: '',
        phone: '',
        photo: ''
    });

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
            id: '',
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
    const handleSaveNew = () => {
        const newEmployee = {
            ...formData,
            id: new Date().getTime().toString()
        };
        setEmployees(prev => [...prev, newEmployee]);
        setIsAdding(false);
        console.log('新增员工:', newEmployee);
    };

    // 取消添加
    const handleCancelAdd = () => {
        setIsAdding(false);
    };

    // 开始编辑
    const handleEditClick = (employee) => {
        setEditingId(employee.id);
        setFormData(employee);
        console.log('编辑员工:', employee);
    };

    // 保存编辑
    const handleSaveEdit = () => {
        setEmployees(prev => prev.map(emp => emp.id === editingId ? formData : emp));
        setEditingId(null);
        console.log('保存编辑:', formData);
    };

    // 取消编辑
    const handleCancelEdit = () => {
        setEditingId(null);
    };

    // 删除员工
    const handleDelete = (id) => {
        console.log('删除员工ID:', id);
        setEmployees(prev => prev.filter(emp => emp.id !== id));
    };

    return (
        <ErrorBoundary>
            <div className="employee-management">
                <header className="dashboard-header">
                    <h1>员工管理</h1>
                    <div className="header-actions">
                        <button
                            className="add-employee-btn"
                            onClick={handleAddClick}
                        >
                            添加新员工
                        </button>
                    </div>
                </header>

                <div className="dashboard-content">
                    <table className="employee-table">
                        <thead>
                            <tr>
                                <th>员工工号</th>
                                <th>员工姓名</th>
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
                                    {editingId === employee.id ? (
                                        // 编辑模式
                                        <>
                                            <td>{employee.id}</td>
                                            <td>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    className="inline-edit"
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    name="department"
                                                    value={formData.department}
                                                    onChange={handleInputChange}
                                                    className="inline-edit"
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    name="position"
                                                    value={formData.position}
                                                    onChange={handleInputChange}
                                                    className="inline-edit"
                                                />
                                            </td>
                                            <td>
                                                <select
                                                    name="gender"
                                                    value={formData.gender}
                                                    onChange={handleInputChange}
                                                    className="inline-edit"
                                                >
                                                    <option value="男">男</option>
                                                    <option value="女">女</option>
                                                </select>
                                            </td>
                                            <td>
                                                <input
                                                    type="number"
                                                    name="age"
                                                    value={formData.age}
                                                    onChange={handleInputChange}
                                                    className="inline-edit"
                                                    min="18"
                                                    max="65"
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    className="inline-edit"
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    name="photo"
                                                    value={formData.photo}
                                                    onChange={handleInputChange}
                                                    className="inline-edit"
                                                    placeholder="照片URL"
                                                />
                                            </td>
                                            <td>
                                                <button className="save-btn" onClick={handleSaveEdit}>保存</button>
                                                <button className="cancel-btn" onClick={handleCancelEdit}>取消</button>
                                            </td>
                                        </>
                                    ) : (
                                        // 查看模式
                                        <>
                                            <td>{employee.id}</td>
                                            <td>{employee.name}</td>
                                            <td>{employee.department}</td>
                                            <td>{employee.position}</td>
                                            <td>{employee.gender}</td>
                                            <td>{employee.age}</td>
                                            <td>{employee.phone}</td>
                                            <td>
                                                {employee.photo ? (
                                                    <img
                                                        src={employee.photo}
                                                        alt="员工照片"
                                                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                                    />
                                                ) : (
                                                    <span>无照片</span>
                                                )}
                                            </td>
                                            <td>
                                                <button
                                                    className="edit-btn"
                                                    onClick={() => handleEditClick(employee)}
                                                >
                                                    编辑
                                                </button>
                                                <button
                                                    className="delete-btn"
                                                    onClick={() => handleDelete(employee.id)}
                                                >
                                                    删除
                                                </button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}

                            {/* 添加新员工的行 */}
                            {isAdding && (
                                <tr>
                                    <td><span className="new-id">新员工</span></td>
                                    <td>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="inline-edit"
                                            placeholder="姓名"
                                            required
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            name="department"
                                            value={formData.department}
                                            onChange={handleInputChange}
                                            className="inline-edit"
                                            placeholder="部门"
                                            required
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            name="position"
                                            value={formData.position}
                                            onChange={handleInputChange}
                                            className="inline-edit"
                                            placeholder="职位"
                                            required
                                        />
                                    </td>
                                    <td>
                                        <select
                                            name="gender"
                                            value={formData.gender}
                                            onChange={handleInputChange}
                                            className="inline-edit"
                                        >
                                            <option value="男">男</option>
                                            <option value="女">女</option>
                                        </select>
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            name="age"
                                            value={formData.age}
                                            onChange={handleInputChange}
                                            className="inline-edit"
                                            placeholder="年龄"
                                            min="18"
                                            max="65"
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="inline-edit"
                                            placeholder="电话"
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            name="photo"
                                            value={formData.photo}
                                            onChange={handleInputChange}
                                            className="inline-edit"
                                            placeholder="照片URL"
                                        />
                                    </td>
                                    <td>
                                        <button className="save-btn" onClick={handleSaveNew}>保存</button>
                                        <button className="cancel-btn" onClick={handleCancelAdd}>取消</button>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </ErrorBoundary>
    );
};

export default EmployeeManagement;