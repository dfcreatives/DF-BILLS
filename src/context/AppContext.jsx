import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [clients, setClients] = useState([]);
  const [services, setServices] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [companyInfo, setCompanyInfo] = useState({
    name: 'DF Creatives',
    email: 'dfcreatives.it@gmail.com',
    address: 'PEELAMEDU, COIMBATORE, TAMIL NADU',
    logo: '' // URL or base64 placeholder
  });

  // Load data from local storage on mount
  useEffect(() => {
    const loadedClients = localStorage.getItem('df_clients');
    const loadedServices = localStorage.getItem('df_services');
    const loadedInvoices = localStorage.getItem('df_invoices');
    const loadedTheme = localStorage.getItem('df_theme');
    const loadedCompany = localStorage.getItem('df_company');

    if (loadedClients) setClients(JSON.parse(loadedClients));
    if (loadedServices) setServices(JSON.parse(loadedServices));
    if (loadedInvoices) setInvoices(JSON.parse(loadedInvoices));
    if (loadedTheme) setTheme(loadedTheme);
    if (loadedCompany) setCompanyInfo(JSON.parse(loadedCompany));
  }, []);

  // Save data to local storage on change
  useEffect(() => {
    localStorage.setItem('df_clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('df_services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('df_invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('df_theme', theme);
    document.documentElement.className = theme;
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('df_company', JSON.stringify(companyInfo));
  }, [companyInfo]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const addClient = (client) => {
    setClients(prev => [...prev, { ...client, id: uuidv4(), createdAt: new Date().toISOString() }]);
  };

  const updateClient = (id, updatedData) => {
    setClients(prev => prev.map(c => c.id === id ? { ...c, ...updatedData } : c));
  };
  
  const deleteClient = (id) => {
    setClients(prev => prev.filter(c => c.id !== id));
  }

  const addService = (service) => {
    setServices(prev => [...prev, { ...service, id: uuidv4() }]);
  };

  const updateService = (id, updatedData) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, ...updatedData } : s));
  };
  
  const deleteService = (id) => {
      setServices(prev => prev.filter(s => s.id !== id));
  }

  const addInvoice = (invoice) => {
    setInvoices(prev => [...prev, { ...invoice, id: uuidv4(), createdAt: new Date().toISOString() }]);
  };
  
  const updateInvoice = (id, updatedData) => {
      setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, ...updatedData } : inv));
  }

  const deleteInvoice = (id) => {
      setInvoices(prev => prev.filter(inv => inv.id !== id));
  }

  return (
    <AppContext.Provider value={{
      theme, toggleTheme,
      clients, addClient, updateClient, deleteClient,
      services, addService, updateService, deleteService,
      invoices, addInvoice, updateInvoice, deleteInvoice,
      companyInfo, setCompanyInfo
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
