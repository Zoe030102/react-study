const API_URL = 'http://localhost:5001/api/login';

export const loginUser = async (username, password) => {
    console.log('正在发送登录请求...');
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        console.log('收到响应:', response);

        if (!response.ok) {
            const errorData = await response.json();
            console.error('登录失败:', errorData);
            throw new Error(errorData.message || '登录失败');
        }

        const data = await response.json();
        console.log('登录成功:', data);
        return data.token;
    } catch (err) {
        console.error('请求错误:', err);
        throw new Error('无法连接到服务器，请检查网络连接');
    }
};
