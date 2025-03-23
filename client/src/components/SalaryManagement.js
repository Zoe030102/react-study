import React, { useState, useEffect } from 'react';
import '../assets/dashboard.css';
import ErrorBoundary from './ErrorBoundary';

const SalaryManagement = () => {
    // 从localStorage加载薪资数据
    const [salaries, setSalaries] = useState(() => {
        const savedSalaries = localStorage.getItem('salaries');
        return savedSalaries ? JSON.parse(savedSalaries) : [];
    });

    // 从localStorage加载员工数据，移除未使用的 setEmployees
    const [employees] = useState(() => {
        const savedEmployees = localStorage.getItem('employees');
        return savedEmployees ? JSON.parse(savedEmployees) : [];
    });

    // 当薪资数据变化时，保存到localStorage
    useEffect(() => {
        localStorage.setItem('salaries', JSON.stringify(salaries));
        // 触发storage事件，通知其他组件数据已更新
        window.dispatchEvent(new Event('storage'));
    }, [salaries]);

    // 获取当前月份
    const currentMonth = new Date().toISOString().slice(0, 7); // 格式：YYYY-MM

    // 生成薪资
    const handleGenerateSalary = () => {
        // 检查本月是否已经生成过薪资
        const hasGeneratedThisMonth = salaries.some(s => s.month === currentMonth);

        if (hasGeneratedThisMonth) {
            if (!window.confirm('本月已生成薪资，是否重新生成？')) {
                return;
            }
            // 删除本月已生成的薪资
            setSalaries(prev => prev.filter(s => s.month !== currentMonth));
        }

        // 为所有员工生成本月薪资
        const newSalaries = employees.map(employee => {
            // 这里可以根据员工职位、工作时间等计算基本工资
            // 这里使用简单的随机数作为示例
            const baseSalary = 5000 + Math.floor(Math.random() * 5000);
            const bonus = Math.floor(Math.random() * 2000);
            const deduction = Math.floor(Math.random() * 1000);
            const totalSalary = baseSalary + bonus - deduction;

            return {
                id: `${employee.id}-${currentMonth}`,
                employeeId: employee.id,
                employeeName: employee.name,
                month: currentMonth,
                baseSalary,
                bonus,
                deduction,
                totalSalary,
                status: '待发放',
                paymentDate: ''
            };
        });

        setSalaries(prev => [...prev, ...newSalaries]);
        alert('已成功生成本月薪资！');
    };

    // 发放薪资
    const handlePaySalary = (id) => {
        setSalaries(prev =>
            prev.map(salary =>
                salary.id === id
                    ? {
                        ...salary,
                        status: '已发放',
                        paymentDate: new Date().toISOString().split('T')[0]
                    }
                    : salary
            )
        );
    };

    // 批量发放薪资
    const handleBatchPay = () => {
        const pendingSalaries = salaries.filter(s => s.status === '待发放' && s.month === currentMonth);

        if (pendingSalaries.length === 0) {
            alert('没有待发放的薪资！');
            return;
        }

        if (window.confirm(`确定要发放${pendingSalaries.length}名员工的薪资吗？`)) {
            const today = new Date().toISOString().split('T')[0];

            setSalaries(prev =>
                prev.map(salary =>
                    (salary.status === '待发放' && salary.month === currentMonth)
                        ? { ...salary, status: '已发放', paymentDate: today }
                        : salary
                )
            );

            alert('批量发放薪资成功！');
        }
    };

    // 过滤出当月的薪资记录
    const currentMonthSalaries = salaries.filter(s => s.month === currentMonth);

    return (
        <ErrorBoundary>
            <div className="salary-management">
                <header className="dashboard-header">
                    <h1>薪资管理</h1>
                    <div className="header-actions">
                        <button
                            className="generate-salary-btn"
                            onClick={handleGenerateSalary}
                        >
                            生成本月薪资
                        </button>
                        <button
                            className="pay-salary-btn"
                            onClick={handleBatchPay}
                        >
                            批量发放薪资
                        </button>
                    </div>
                </header>

                <div className="dashboard-content">
                    <h2>本月薪资 ({currentMonth})</h2>
                    {currentMonthSalaries.length > 0 ? (
                        <table className="salary-table">
                            <thead>
                                <tr>
                                    <th>员工ID</th>
                                    <th>员工姓名</th>
                                    <th>月份</th>
                                    <th>基本工资</th>
                                    <th>奖金</th>
                                    <th>扣除</th>
                                    <th>总计</th>
                                    <th>状态</th>
                                    <th>发放日期</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentMonthSalaries.map(salary => (
                                    <tr key={salary.id}>
                                        <td>{salary.employeeId}</td>
                                        <td>{salary.employeeName}</td>
                                        <td>{salary.month}</td>
                                        <td>¥{salary.baseSalary.toFixed(2)}</td>
                                        <td>¥{salary.bonus.toFixed(2)}</td>
                                        <td>¥{salary.deduction.toFixed(2)}</td>
                                        <td>¥{salary.totalSalary.toFixed(2)}</td>
                                        <td>{salary.status}</td>
                                        <td>{salary.paymentDate || '未发放'}</td>
                                        <td>
                                            {salary.status === '待发放' ? (
                                                <button
                                                    className="pay-btn"
                                                    onClick={() => handlePaySalary(salary.id)}
                                                >
                                                    发放
                                                </button>
                                            ) : (
                                                <span>已发放</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>本月暂无薪资记录，请点击"生成本月薪资"按钮。</p>
                    )}
                </div>
            </div>
        </ErrorBoundary>
    );
};

export default SalaryManagement;