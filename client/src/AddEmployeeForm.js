import React, { useState, useEffect } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import axios from 'axios';

function AddEmployeeForm({ employeeId, onEmployeeAdded, onEmployeeUpdated }) {
    const [employee, setEmployee] = useState({
        name: '',
        position: '',
        salary: '',
        hire_date: '',
    });

    useEffect(() => {
        if (employeeId) {
            axios.get(`http://localhost:5000/api/employees/${employeeId}`)
                .then(response => {
                    setEmployee(response.data);
                })
                .catch(error => {
                    console.error('获取员工数据失败:', error);
                });
        }
    }, [employeeId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmployee((prevEmployee) => ({
            ...prevEmployee,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (employeeId) {
            axios.put(`http://localhost:5000/api/employees/${employeeId}`, employee)
                .then(response => {
                    onEmployeeUpdated(response.data);
                })
                .catch(error => {
                    console.error('更新员工失败:', error);
                });
        } else {
            axios.post('http://localhost:5000/api/employees', employee)
                .then(response => {
                    onEmployeeAdded(response.data);
                })
                .catch(error => {
                    console.error('添加员工失败:', error);
                });
        }
        setEmployee({
            name: '',
            position: '',
            salary: '',
            hire_date: '',
        });
    };

    return (
        <Container>
            <h2>{employeeId ? '编辑员工' : '添加新员工'}</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formName">
                    <Form.Label>姓名</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="请输入姓名"
                        name="name"
                        value={employee.name}
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group controlId="formPosition">
                    <Form.Label>职位</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="请输入职位"
                        name="position"
                        value={employee.position}
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group controlId="formSalary">
                    <Form.Label>薪资</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="请输入薪资"
                        name="salary"
                        value={employee.salary}
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group controlId="formHireDate">
                    <Form.Label>入职日期</Form.Label>
                    <Form.Control
                        type="date"
                        name="hire_date"
                        value={employee.hire_date}
                        onChange={handleChange}
                    />
                </Form.Group>
                <Button variant="primary" type="submit">
                    {employeeId ? '更新员工' : '添加员工'}
                </Button>
            </Form>
        </Container>
    );
}

export default AddEmployeeForm;

