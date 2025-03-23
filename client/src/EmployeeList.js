import React, { useEffect, useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import axios from 'axios';

function EmployeeList({ onEdit, onDelete }) {
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/api/employees')
            .then(response => {
                setEmployees(response.data);
            })
            .catch(error => {
                console.error('获取员工数据失败:', error);
            });
    }, []);

    const handleEdit = (id) => {
        onEdit(id);
    };

    const handleDelete = (id) => {
        axios.delete(`http://localhost:5000/api/employees/${id}`)
            .then(response => {
                setEmployees(employees.filter(employee => employee.id !== id));
            })
            .catch(error => {
                console.error('删除员工失败:', error);
            });
    };

    return (
        <div>
            <h2>员工列表</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>姓名</th>
                        <th>职位</th>
                        <th>薪资</th>
                        <th>入职日期</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map(employee => (
                        <tr key={employee.id}>
                            <td>{employee.name}</td>
                            <td>{employee.position}</td>
                            <td>{employee.salary}</td>
                            <td>{employee.hire_date}</td>
                            <td>
                                <Button variant="warning" onClick={() => handleEdit(employee.id)}>编辑</Button>
                                <Button variant="danger" onClick={() => handleDelete(employee.id)}>删除</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
}

export default EmployeeList;

