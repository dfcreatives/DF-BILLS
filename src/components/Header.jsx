import React from 'react';
import { Moon, Sun, Menu } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './Header.css';

const Header = ({ title, toggleMobileSidebar }) => {
  const { theme, toggleTheme } = useApp();

  return (
    <header className="header">
      <div className="header-left">
        <button className="mobile-menu-btn" onClick={toggleMobileSidebar}>
            <Menu size={24} />
        </button>
        <h2>{title}</h2>
      </div>
      
      <div className="header-right">
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
        <div className="user-avatar">
            <span>DF</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
