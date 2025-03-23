import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        // 更新 state 以显示降级 UI
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // 可以将错误日志记录到错误报告服务
        console.error("ErrorBoundary caught an error", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // 你可以自定义降级 UI
            return <h1>出了点问题。</h1>;
        }

        return this.props.children;
    }
}

export default ErrorBoundary;