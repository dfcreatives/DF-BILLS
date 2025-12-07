import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { Outlet, useLocation } from 'react-router-dom';
import './Layout.css';

const Layout = () => {
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const location = useLocation();

    const getPageTitle = () => {
        const path = location.pathname;
        if (path === '/') return 'Dashboard';
        if (path === '/clients') return 'Clients';
        if (path === '/services') return 'Services';
        if (path.startsWith('/invoices')) return 'Invoices';
        if (path === '/settings') return 'Settings';
        return 'Overview';
    };

    return (
        <div className="app-layout">
            <div className={`sidebar-wrapper ${isMobileSidebarOpen ? 'open' : ''}`}>
                <Sidebar />
                {isMobileSidebarOpen && (
                    <div 
                        className="mobile-overlay" 
                        onClick={() => setIsMobileSidebarOpen(false)}
                    />
                )}
            </div>
            
            <main className="main-content">
                <Header 
                    title={getPageTitle()} 
                    toggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)} 
                />
                <div className="content-area">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
