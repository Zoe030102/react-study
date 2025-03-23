import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('尝试跳转到仪表盘...');  // 添加调试日志
        localStorage.setItem('authToken', 'dummyToken');
        navigate('/dashboard');
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>登录</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="username">用户名</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="请输入用户名"
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">密码</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="请输入密码"
                        />
                    </div>

                    <button type="submit" className="login-btn">登录</button>
                </form>
            </div>
        </div>
    );
};

export default Login;

