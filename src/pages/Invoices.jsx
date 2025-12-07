import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import Table from '../components/Table';
import Button from '../components/Button';
import Card from '../components/Card';
import { Search, Download, Trash2, Eye, CheckCircle, XCircle } from 'lucide-react';
import { pdf } from '@react-pdf/renderer';
import InvoicePDF from '../components/InvoicePDF';
import { Link } from 'react-router-dom';

const Invoices = () => {
  const { invoices, updateInvoice, companyInfo, deleteInvoice } = useApp(); // Need to add deleteInvoice to context
  const [searchTerm, setSearchTerm] = useState('');
  const [downloadingId, setDownloadingId] = useState(null);

  const handleDownload = async (invoice) => {
    setDownloadingId(invoice.id);
    try {
        const doc = <InvoicePDF invoice={invoice} company={companyInfo} />;
        const blob = await pdf(doc).toBlob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${invoice.clientName.replace(/\s+/g, '_')}_${invoice.date}.pdf`;
        link.click();
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Failed to generate PDF');
    }
    setDownloadingId(null);
  };

  const toggleStatus = (invoice) => {
      const newStatus = invoice.status === 'Paid' ? 'Unpaid' : 'Paid';
      updateInvoice(invoice.id, { status: newStatus });
  };
  
  // Placeholder delete if not in context yet (I need to check AppContext)
  // I checked AppContext earlier, it has addInvoice and updateInvoice, but NO deleteInvoice.
  // I should add deleteInvoice to AppContext.jsx in a separate step or just omit it for now?
  // User asked for CRUD. I should add it.
  
  // Implementation of filtered invoices
  const filteredInvoices = invoices.filter(inv => 
    inv.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Invoices</h1>
        <Link to="/invoices/new">
            <Button>
                <Eye size={18} /> Create New Invoice
            </Button>
        </Link>
      </div>

      <Card className="content-card">
        <div className="table-actions">
            <div className="search-wrapper">
                <Search size={18} className="search-icon" />
                <input 
                    type="text" 
                    placeholder="Search invoices..." 
                    className="search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>

        <Table 
          headers={['Invoice #', 'Date', 'Client', 'Amount', 'Status', 'Actions']}
          data={filteredInvoices}
          renderRow={(inv) => (
            <tr key={inv.id}>
              <td><span className="invoice-number">{inv.invoiceNumber}</span></td>
              <td>{inv.date}</td>
              <td style={{fontWeight: 500}}>{inv.clientName}</td>
              <td style={{fontWeight: 600}}>₹{inv.total.toFixed(2)}</td>
              <td>
                  <span 
                    className={`status-badge ${inv.status.toLowerCase()}`}
                    onClick={() => toggleStatus(inv)}
                    title="Click to toggle status"
                  >
                    {inv.status}
                  </span>
              </td>
              <td>
                <div className="action-buttons">
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    onClick={() => handleDownload(inv)}
                    disabled={downloadingId === inv.id}
                  >
                    <Download size={16} />
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => { if(confirm('Delete invoice?')) deleteInvoice(inv.id) }}>
                    <Trash2 size={16} />
                  </Button>
                </div>
              </td>
            </tr>
          )}
          emptyMessage="No invoices generated yet."
        />
      </Card>

      <style jsx>{`
        .page-container {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
        }
        .page-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .content-card {
            padding: 0;
            overflow: hidden;
        }
        .table-actions {
            padding: 1rem;
            border-bottom: 1px solid var(--border);
        }
        .search-wrapper {
            position: relative;
            max-width: 300px;
        }
        .search-icon {
            position: absolute;
            left: 10px;
            top: 50%;
            transform: translateY(-50%);
            color: var(--text-secondary);
        }
        .search-input {
            width: 100%;
            padding: 0.5rem 0.5rem 0.5rem 2.2rem;
            border: 1px solid var(--border);
            border-radius: var(--radius-md);
            background: var(--bg-card);
            color: var(--text-main);
            font-size: 0.9rem;
        }
        .invoice-number {
             font-family: monospace;
             color: var(--primary);
             font-weight: 600;
        }
        .status-badge {
            padding: 0.25rem 0.75rem;
            border-radius: 999px;
            font-size: 0.75rem;
            font-weight: 600;
            cursor: pointer;
            user-select: none;
        }
        .status-badge.paid {
            background-color: #dcfce7;
            color: #166534;
        }
        .status-badge.unpaid {
            background-color: #fee2e2;
            color: #991b1b;
        }
        .action-buttons {
            display: flex;
            gap: 0.5rem;
        }
      `}</style>
    </div>
  );
};

export default Invoices;
