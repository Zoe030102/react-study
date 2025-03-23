document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault(); // 防止表单提交刷新页面

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // 简单的前端验证
    if (!username || !password) {
        document.getElementById('error-message').textContent = '用户名和密码不能为空';
        return;
    }

    // 模拟后端验证（此处使用本地存储的token模拟）
    if (username === 'admin' && password === '123456') {
        // 模拟成功，跳转到管理页面
        localStorage.setItem('authToken', 'dummy_token');
        window.location.href = 'dashboard.html';
    } else {
        // 登录失败，提示错误
        document.getElementById('error-message').textContent = '用户名或密码错误';
    }
});
