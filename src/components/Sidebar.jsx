import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Briefcase, FileText, Settings, History } from 'lucide-react';
import './Sidebar.css';
import { useApp } from '../context/AppContext';

const Sidebar = () => {
  const { companyInfo } = useApp();

  return (
    <aside className="sidebar">
      <div className="branding">
        <div className="logo-placeholder">
            {companyInfo.logo ? <img src={companyInfo.logo} alt="Logo" /> : 'DF'}
        </div>
        <h1>{companyInfo.name}</h1>
      </div>

      <nav className="nav-menu">
        <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/clients" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Users size={20} />
          <span>Clients</span>
        </NavLink>
        <NavLink to="/services" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Briefcase size={20} />
          <span>Services</span>
        </NavLink>
        <NavLink to="/invoices/new" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <FileText size={20} />
          <span>Invoice Builder</span>
        </NavLink>
        <NavLink to="/invoices" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <History size={20} />
          <span>History</span>
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Settings size={20} />
          <span>Settings</span>
        </NavLink>
      </nav>
      
      <div className="sidebar-footer">
        <p>© 2025 DF Creatives</p>
      </div>
    </aside>
  );
};

export default Sidebar;
