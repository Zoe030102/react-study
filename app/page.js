import Link from 'next/link';
import './globals.css';

export default function Home() {
    return (
        <div className="home-container">
            <h1>酒店管理系统</h1>
            <p>欢迎使用酒店管理系统</p>
            <div className="links">
                <Link href="/dashboard">
                    <button className="dashboard-btn">进入系统</button>
                </Link>
            </div>
        </div>
    );
}