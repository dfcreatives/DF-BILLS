import React from 'react';
import { Routes, Route,  useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Services from './pages/Services';
import InvoiceBuilder from './pages/InvoiceBuilder';
import Invoices from './pages/Invoices';
import Settings from './pages/Settings';
import PageTransition from './components/PageTransition';
import { AnimatePresence } from 'framer-motion';

function App() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Layout />}>
          <Route index element={<PageTransition><Dashboard /></PageTransition>} />
          <Route path="clients" element={<PageTransition><Clients /></PageTransition>} />
          <Route path="services" element={<PageTransition><Services /></PageTransition>} />
          <Route path="invoices" element={<PageTransition><Invoices /></PageTransition>} />
          <Route path="invoices/new" element={<PageTransition><InvoiceBuilder /></PageTransition>} />
          <Route path="settings" element={<PageTransition><Settings /></PageTransition>} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export default App;
