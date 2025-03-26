import './globals.css';

export const metadata = {
    title: '酒店管理系统',
    description: '酒店员工管理系统',
};

export default function RootLayout({ children }) {
    return (
        <html lang="zh-CN">
            <body>{children}</body>
        </html>
    );
}