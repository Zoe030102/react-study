import React, { useState } from 'react';
import '../assets/dashboard.css';
import ErrorBoundary from './ErrorBoundary';

const LeaveManagement = () => {
    // 添加一些示例数据，方便测试
    const [leaveRequests, setLeaveRequests] = useState([
        {
            id: '1',
            employeeName: '张三',
            employeeId: '1001',
            leaveType: '病假',
            startDate: '2023-06-01',
            endDate: '2023-06-03',
            duration: '3天',
            reason: '感冒发烧',
            status: '已批准'
        },
        {
            id: '2',
            employeeName: '李四',
            employeeId: '1002',
            leaveType: '事假',
            startDate: '2023-06-10',
            endDate: '2023-06-11',
            duration: '2天',
            reason: '家中有事',
            status: '待审批'
        }
    ]);

    // 新增状态用于跟踪是否处于添加模式
    const [isAdding, setIsAdding] = useState(false);
    // 新增状态用于跟踪正在编辑的行ID
    const [editingId, setEditingId] = useState(null);
    // 表单数据
    const [formData, setFormData] = useState({
        id: '',
        employeeName: '',
        employeeId: '',
        leaveType: '事假',
        startDate: '',
        endDate: '',
        duration: '',
        reason: '',
        status: '待审批'
    });

    // 处理输入变化
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // 计算请假天数
    // 在 calculateDuration 函数中添加日期验证
    const calculateDuration = () => {
        if (formData.startDate && formData.endDate) {
            const start = new Date(formData.startDate);
            const end = new Date(formData.endDate);

            // 确保结束日期不早于开始日期
            if (end < start) {
                alert('结束日期不能早于开始日期');
                setFormData(prev => ({
                    ...prev,
                    endDate: formData.startDate
                }));
                return;
            }

            const diffTime = Math.abs(end - start);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

            setFormData(prev => ({
                ...prev,
                duration: `${diffDays}天`
            }));
        }
    };

    // 添加新请假申请
    const handleAddClick = () => {
        setIsAdding(true);
        setFormData({
            id: '',
            employeeName: '',
            employeeId: '',
            leaveType: '事假',
            startDate: '',
            endDate: '',
            duration: '',
            reason: '',
            status: '待审批'
        });
    };

    // 保存新请假申请
    // 在 handleSaveNew 函数中添加表单验证
    const handleSaveNew = () => {
        // 表单验证
        if (!formData.employeeName || !formData.employeeId || !formData.startDate ||
            !formData.endDate || !formData.reason) {
            alert('请填写所有必填字段');
            return;
        }

        calculateDuration();
        const newLeaveRequest = {
            ...formData,
            id: new Date().getTime().toString()
        };
        setLeaveRequests(prev => [...prev, newLeaveRequest]);
        setIsAdding(false);
        console.log('新增请假申请:', newLeaveRequest);
    };

    // 取消添加
    const handleCancelAdd = () => {
        setIsAdding(false);
    };

    // 开始编辑
    const handleEditClick = (leaveRequest) => {
        setEditingId(leaveRequest.id);
        setFormData(leaveRequest);
        console.log('编辑请假申请:', leaveRequest);
    };

    // 保存编辑
    // 在 handleSaveEdit 函数中添加表单验证
    const handleSaveEdit = () => {
        // 表单验证
        if (!formData.employeeName || !formData.employeeId || !formData.startDate ||
            !formData.endDate || !formData.reason) {
            alert('请填写所有必填字段');
            return;
        }

        calculateDuration();
        setLeaveRequests(prev => prev.map(req => req.id === editingId ? formData : req));
        setEditingId(null);
        console.log('保存编辑:', formData);
    };

    // 取消编辑
    const handleCancelEdit = () => {
        setEditingId(null);
    };

    // 删除请假申请
    const handleDelete = (id) => {
        console.log('删除请假申请ID:', id);
        setLeaveRequests(prev => prev.filter(req => req.id !== id));
    };

    return (
        <ErrorBoundary>
            <div className="leave-management">
                <header className="dashboard-header">
                    <h1>请假管理</h1>
                    <div className="header-actions">
                        <button
                            className="add-leave-btn"
                            onClick={handleAddClick}
                        >
                            申请请假
                        </button>
                    </div>
                </header>

                <div className="dashboard-content">
                    <table className="leave-table">
                        <thead>
                            <tr>
                                <th>申请编号</th>
                                <th>员工姓名</th>
                                <th>员工工号</th>
                                <th>请假类型</th>
                                <th>开始日期</th>
                                <th>结束日期</th>
                                <th>请假天数</th>
                                <th>请假原因</th>
                                <th>状态</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaveRequests.map(request => (
                                <tr key={request.id}>
                                    {editingId === request.id ? (
                                        // 编辑模式
                                        <>
                                            <td>{request.id}</td>
                                            <td>
                                                <input
                                                    type="text"
                                                    name="employeeName"
                                                    value={formData.employeeName}
                                                    onChange={handleInputChange}
                                                    className="inline-edit"
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    name="employeeId"
                                                    value={formData.employeeId}
                                                    onChange={handleInputChange}
                                                    className="inline-edit"
                                                />
                                            </td>
                                            <td>
                                                <select
                                                    name="leaveType"
                                                    value={formData.leaveType}
                                                    onChange={handleInputChange}
                                                    className="inline-edit"
                                                >
                                                    <option value="事假">事假</option>
                                                    <option value="病假">病假</option>
                                                    <option value="年假">年假</option>
                                                    <option value="婚假">婚假</option>
                                                    <option value="产假">产假</option>
                                                </select>
                                            </td>
                                            <td>
                                                <input
                                                    type="date"
                                                    name="startDate"
                                                    value={formData.startDate}
                                                    onChange={handleInputChange}
                                                    className="inline-edit"
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="date"
                                                    name="endDate"
                                                    value={formData.endDate}
                                                    onChange={handleInputChange}
                                                    className="inline-edit"
                                                    onBlur={calculateDuration}
                                                />
                                            </td>
                                            <td>{formData.duration}</td>
                                            <td>
                                                <input
                                                    type="text"
                                                    name="reason"
                                                    value={formData.reason}
                                                    onChange={handleInputChange}
                                                    className="inline-edit"
                                                />
                                            </td>
                                            <td>
                                                <select
                                                    name="status"
                                                    value={formData.status}
                                                    onChange={handleInputChange}
                                                    className="inline-edit"
                                                >
                                                    <option value="待审批">待审批</option>
                                                    <option value="已批准">已批准</option>
                                                    <option value="已拒绝">已拒绝</option>
                                                </select>
                                            </td>
                                            <td>
                                                <button className="save-btn" onClick={handleSaveEdit}>保存</button>
                                                <button className="cancel-btn" onClick={handleCancelEdit}>取消</button>
                                            </td>
                                        </>
                                    ) : (
                                        // 查看模式
                                        <>
                                            <td>{request.id}</td>
                                            <td>{request.employeeName}</td>
                                            <td>{request.employeeId}</td>
                                            <td>{request.leaveType}</td>
                                            <td>{request.startDate}</td>
                                            <td>{request.endDate}</td>
                                            <td>{request.duration}</td>
                                            <td>{request.reason}</td>
                                            <td>
                                                <span className={`status-badge ${request.status === '已批准' ? 'approved' : request.status === '已拒绝' ? 'rejected' : 'pending'}`}>
                                                    {request.status}
                                                </span>
                                            </td>
                                            <td>
                                                <button
                                                    className="edit-btn"
                                                    onClick={() => handleEditClick(request)}
                                                >
                                                    编辑
                                                </button>
                                                <button
                                                    className="delete-btn"
                                                    onClick={() => handleDelete(request.id)}
                                                >
                                                    删除
                                                </button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}

                            {/* 添加新请假申请的行 */}
                            {isAdding && (
                                <tr>
                                    <td><span className="new-id">新申请</span></td>
                                    <td>
                                        <input
                                            type="text"
                                            name="employeeName"
                                            value={formData.employeeName}
                                            onChange={handleInputChange}
                                            className="inline-edit"
                                            placeholder="员工姓名"
                                            required
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            name="employeeId"
                                            value={formData.employeeId}
                                            onChange={handleInputChange}
                                            className="inline-edit"
                                            placeholder="员工工号"
                                            required
                                        />
                                    </td>
                                    <td>
                                        <select
                                            name="leaveType"
                                            value={formData.leaveType}
                                            onChange={handleInputChange}
                                            className="inline-edit"
                                        >
                                            <option value="事假">事假</option>
                                            <option value="病假">病假</option>
                                            <option value="年假">年假</option>
                                            <option value="婚假">婚假</option>
                                            <option value="产假">产假</option>
                                        </select>
                                    </td>
                                    <td>
                                        <input
                                            type="date"
                                            name="startDate"
                                            value={formData.startDate}
                                            onChange={handleInputChange}
                                            className="inline-edit"
                                            required
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="date"
                                            name="endDate"
                                            value={formData.endDate}
                                            onChange={handleInputChange}
                                            className="inline-edit"
                                            onBlur={calculateDuration}
                                            required
                                        />
                                    </td>
                                    <td>{formData.duration}</td>
                                    <td>
                                        <input
                                            type="text"
                                            name="reason"
                                            value={formData.reason}
                                            onChange={handleInputChange}
                                            className="inline-edit"
                                            placeholder="请假原因"
                                            required
                                        />
                                    </td>
                                    <td>
                                        <span className="status-badge pending">待审批</span>
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

export default LeaveManagement;