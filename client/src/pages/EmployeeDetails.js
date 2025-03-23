import React from 'react';
import { useLocation } from 'react-router-dom';

const EmployeeDetails = () => {
    const location = useLocation();
    const employee = location.state;

    return (
        <div className="employee-details-container">
            <h2>员工详细信息</h2>
            <p>姓名: {employee.name}</p>
            <p>职位: {employee.position}</p>
            <p>部门: {employee.department}</p>
            <p>状态: {employee.status}</p>
            <p>入职日期: {employee.entryDate}</p>
            <p>薪资: {employee.salary}</p>
            <p>联系电话: {employee.phone}</p>
            <p>邮箱: {employee.email}</p>
            <p>地址: {employee.address}</p>
        </div>
    );
};

export default EmployeeDetails;