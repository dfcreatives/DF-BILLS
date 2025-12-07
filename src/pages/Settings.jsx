import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import { Save } from 'lucide-react';

const Settings = () => {
  const { companyInfo, setCompanyInfo, theme, toggleTheme } = useApp();
  const [formData, setFormData] = useState(companyInfo);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    setFormData(companyInfo);
  }, [companyInfo]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setCompanyInfo(formData);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Settings</h1>
      </div>

      <div className="settings-grid">
        <Card title="Company Information">
          <form onSubmit={handleSubmit} className="form-stack">
            <Input 
              label="Company Name" 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})}
              required
            />
            <Input 
              label="Email Address" 
              type="email"
              value={formData.email} 
              onChange={e => setFormData({...formData, email: e.target.value})}
              required
            />
            <div className="input-wrapper">
                <label className="input-label">Address</label>
                <textarea 
                    className="textarea-input"
                    value={formData.address}
                    onChange={e => setFormData({...formData, address: e.target.value})}
                    rows={3}
                />
            </div>
            <Input 
              label="Website or Logo URL" 
              value={formData.logo || ''} 
              onChange={e => setFormData({...formData, logo: e.target.value})}
              placeholder="https://example.com/logo.png"
            />
            
            <div className="form-actions">
                <Button type="submit">
                    <Save size={18} /> Save Settings
                </Button>
            </div>
            {showSuccess && <div className="success-msg">Settings saved successfully!</div>}
          </form>
        </Card>

        <Card title="App Preferences">
             <div className="pref-row">
                <span>Dark Mode</span>
                <label className="switch">
                    <input type="checkbox" checked={theme === 'dark'} onChange={toggleTheme} />
                    <span className="slider round"></span>
                </label>
             </div>
        </Card>
      </div>

      <style jsx>{`
        .page-container {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
        }
        .page-header h1 {
            font-size: 1.8rem;
            color: var(--text-main);
        }
        .settings-grid {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 1.5rem;
        }
        .form-stack {
            display: flex;
            flex-direction: column;
            gap: 1.25rem;
        }
        .input-wrapper {
            display: flex;
            flex-direction: column;
            gap: 0.375rem;
        }
        .input-label {
            font-size: 0.875rem;
            font-weight: 500;
            color: var(--text-main);
        }
        .textarea-input {
            width: 100%;
            padding: 0.625rem;
            border-radius: var(--radius-md);
            border: 1px solid var(--border);
            background-color: var(--bg-card);
            color: var(--text-main);
            font-family: inherit;
            resize: vertical;
        }
        .form-actions {
            display: flex;
            justify-content: flex-end;
            margin-top: 0.5rem;
        }
        .success-msg {
            color: var(--success);
            font-size: 0.9rem;
            text-align: right;
            animation: fadeIn 0.3s;
        }
        .pref-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.5rem 0;
        }

        /* Toggle Switch */
        .switch {
            position: relative;
            display: inline-block;
            width: 50px;
            height: 24px;
        }
        .switch input { 
            opacity: 0;
            width: 0;
            height: 0;
        }
        .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            transition: .4s;
        }
        .slider:before {
            position: absolute;
            content: "";
            height: 16px;
            width: 16px;
            left: 4px;
            bottom: 4px;
            background-color: white;
            transition: .4s;
        }
        input:checked + .slider {
            background-color: var(--primary);
        }
        input:checked + .slider:before {
            transform: translateX(26px);
        }
        .slider.round {
            border-radius: 34px;
        }
        .slider.round:before {
            border-radius: 50%;
        }

        @media (max-width: 768px) {
            .settings-grid {
                grid-template-columns: 1fr;
            }
        }
      `}</style>
    </div>
  );
};

export default Settings;
