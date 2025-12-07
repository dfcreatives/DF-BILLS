import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import { Plus, Trash2, Save, FileText, Download, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { pdf } from '@react-pdf/renderer';
import InvoicePDF from '../components/InvoicePDF';

const InvoiceBuilder = () => {
    const { clients, services, addInvoice, companyInfo } = useApp();
    const navigate = useNavigate();
    
    // Invoice State
    const [invoiceData, setInvoiceData] = useState({
        invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
        date: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        clientId: '',
        clientName: '', // Stored for history preservation
        clientEmail: '',
        clientAddress: '',
        items: [],
        notes: 'Thank you for your business!',
        taxRate: 0,
        status: 'Unpaid'
    });

    const [loading, setLoading] = useState(false);

    // Persist draft
    useEffect(() => {
        const savedDraft = localStorage.getItem('df_invoice_draft');
        if (savedDraft) {
            setInvoiceData(JSON.parse(savedDraft));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('df_invoice_draft', JSON.stringify(invoiceData));
    }, [invoiceData]);

    // Load client details when selected
    const handleClientChange = (e) => {
        const clientId = e.target.value;
        const client = clients.find(c => c.id === clientId);
        if (client) {
            setInvoiceData({
                ...invoiceData,
                clientId: client.id,
                clientName: client.name,
                clientEmail: client.email,
                clientAddress: client.address
            });
        } else {
             setInvoiceData({
                ...invoiceData,
                clientId: '',
                clientName: '',
                clientEmail: '',
                clientAddress: ''
            });
        }
    };

    // Add a new line item
    const addItem = () => {
        setInvoiceData({
            ...invoiceData,
            items: [...invoiceData.items, { id: Date.now(), serviceId: '', description: '', quantity: 1, rate: 0 }]
        });
    };

    // Remove a line item
    const removeItem = (id) => {
        setInvoiceData({
            ...invoiceData,
            items: invoiceData.items.filter(item => item.id !== id)
        });
    };

    // Update item details
    const updateItem = (id, field, value) => {
        setInvoiceData(prev => {
            const newItems = prev.items.map(item => {
                if (item.id === id) {
                    const updatedItem = { ...item, [field]: value };
                    
                    // If service selected, pre-fill details
                    if (field === 'serviceId') {
                        const service = services.find(s => s.id === value);
                        if (service) {
                            updatedItem.description = service.name; // Keep name as description or use description
                            updatedItem.rate = Number(service.price);
                        }
                    }
                    return updatedItem;
                }
                return item;
            });
            return { ...prev, items: newItems };
        });
    };

    // Calculate Totals
    const subtotal = invoiceData.items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
    const taxAmount = subtotal * (invoiceData.taxRate / 100);
    const total = subtotal + taxAmount;

    // Save Invoice
    const handleSave = () => {
        if (!invoiceData.clientId || invoiceData.items.length === 0) {
            alert('Please select a client and add at least one item.');
            return;
        }
        addInvoice({ ...invoiceData, subtotal, taxAmount, total });
        localStorage.removeItem('df_invoice_draft'); // Clear draft
        navigate('/invoices');
    };

    // Generate PDF Blob
    const generatePdfBlob = async () => {
        const doc = <InvoicePDF invoice={{ ...invoiceData, subtotal, taxAmount, total }} company={companyInfo} />;
        return await pdf(doc).toBlob();
    };

    const handleDownload = async () => {
        if (!invoiceData.clientId || invoiceData.items.length === 0) {
            alert('Please select a client and add at least one item.');
            return;
        }
        setLoading(true);
        try {
            const blob = await generatePdfBlob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${invoiceData.clientName.replace(/\s+/g, '_')}_${invoiceData.date}.pdf`;
            link.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('PDF Generation Error:', error);
            alert(`Error generating PDF: ${error.message}`);
        }
        setLoading(false);
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <div className="header-title">
                     <Button variant="secondary" size="sm" onClick={() => navigate('/invoices')}>
                        <ArrowLeft size={16} />
                     </Button>
                     <h1>New Invoice</h1>
                </div>
                <div className="header-actions">
                     <Button variant="secondary" onClick={handleDownload} disabled={loading}>
                        <Download size={18} /> {loading ? 'Generating...' : 'Download PDF'}
                     </Button>
                     <Button onClick={handleSave}>
                        <Save size={18} /> Save Invoice
                     </Button>
                </div>
            </div>

            <div className="invoice-grid">
                {/* Left Column: Form */}
                <div className="invoice-form">
                    <Card title="Client & Details">
                        <div className="form-row">
                             <div className="input-group">
                                <label className="input-label">Select Client</label>
                                <select 
                                    className="select-input" 
                                    value={invoiceData.clientId} 
                                    onChange={handleClientChange}
                                >
                                    <option value="">-- Select Client --</option>
                                    {clients.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                             </div>
                             <Input 
                                label="Date" 
                                type="date" 
                                value={invoiceData.date}
                                onChange={e => setInvoiceData({...invoiceData, date: e.target.value})}
                             />
                             <Input 
                                label="Due Date" 
                                type="date" 
                                value={invoiceData.dueDate}
                                onChange={e => setInvoiceData({...invoiceData, dueDate: e.target.value})}
                             />
                        </div>
                        {invoiceData.clientId && (
                            <div className="client-info-preview">
                                <p><strong>Address:</strong> {invoiceData.clientAddress || 'N/A'}</p>
                                <p><strong>Email:</strong> {invoiceData.clientEmail || 'N/A'}</p>
                            </div>
                        )}
                    </Card>

                    <Card title="Line Items" className="items-card">
                        <div className="items-list">
                            {invoiceData.items.map((item, index) => (
                                <div key={item.id} className="item-row">
                                    <div className="item-main">
                                        <select 
                                            className="select-input item-service-select"
                                            value={item.serviceId}
                                            onChange={(e) => updateItem(item.id, 'serviceId', e.target.value)}
                                        >
                                            <option value="">Custom Item</option>
                                            {services.map(s => (
                                                <option key={s.id} value={s.id}>{s.name}</option>
                                            ))}
                                        </select>
                                        <Input 
                                            placeholder="Description"
                                            value={item.description}
                                            onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                                        />
                                    </div>
                                    <div className="item-numbers">
                                        <Input 
                                            type="number"
                                            className="qty-input"
                                            min="1"
                                            value={item.quantity}
                                            onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))}
                                        />
                                        <Input 
                                            type="number"
                                            className="rate-input"
                                            min="0"
                                            value={item.rate}
                                            onChange={(e) => updateItem(item.id, 'rate', Number(e.target.value))}
                                        />
                                        <div className="item-total">
                                            ₹{(item.quantity * item.rate).toFixed(2)}
                                        </div>
                                        <button className="remove-btn" onClick={() => removeItem(item.id)}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Button variant="secondary" onClick={addItem} className="add-item-btn">
                            <Plus size={16} /> Add Item
                        </Button>
                    </Card>
                    
                    <Card title="Settings & Notes">
                         <div className="notes-row">
                            <div className="tax-setting">
                                <Input
                                    label="Tax Rate (%)"
                                    type="number"
                                    value={invoiceData.taxRate}
                                    onChange={(e) => setInvoiceData({...invoiceData, taxRate: Number(e.target.value)})}
                                />
                            </div>
                         </div>
                         <div className="notes-field">
                            <label className="input-label">Notes</label>
                            <textarea 
                                className="textarea-input"
                                value={invoiceData.notes}
                                onChange={(e) => setInvoiceData({...invoiceData, notes: e.target.value})}
                                rows={3}
                            />
                         </div>
                    </Card>
                </div>

                {/* Right Column: Preview/Summary */}
                <div className="invoice-summary">
                    <Card>
                        <h3 className="summary-title">Summary</h3>
                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>₹{subtotal.toFixed(2)}</span>
                        </div>
                        <div className="summary-row">
                            <span>Tax ({invoiceData.taxRate}%)</span>
                            <span>₹{taxAmount.toFixed(2)}</span>
                        </div>
                        <div className="summary-divider" />
                        <div className="summary-row total">
                            <span>Total</span>
                            <span>₹{total.toFixed(2)}</span>
                        </div>
                    </Card>
                </div>
            </div>

            <style jsx>{`
                .page-container {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }
                .page-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .header-title {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }
                .header-actions {
                    display: flex;
                    gap: 1rem;
                }
                .invoice-grid {
                    display: grid;
                    grid-template-columns: 2fr 1fr;
                    gap: 1.5rem;
                }
                .invoice-form {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }
                .form-row {
                    display: grid;
                    grid-template-columns: 2fr 1fr 1fr;
                    gap: 1rem;
                    margin-bottom: 1rem;
                }
                .client-info-preview {
                    background: var(--bg-body);
                    padding: 1rem;
                    border-radius: var(--radius-md);
                    font-size: 0.9rem;
                    color: var(--text-secondary);
                }
                .select-input {
                    width: 100%;
                    padding: 0.625rem;
                    border-radius: var(--radius-md);
                    border: 1px solid var(--border);
                    background-color: var(--bg-card);
                    color: var(--text-main);
                    font-size: 0.95rem;
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
                .items-list {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    margin-bottom: 1rem;
                }
                .item-row {
                    display: grid;
                    grid-template-columns: 2fr 1.5fr;
                    gap: 1rem;
                    align-items: flex-start;
                    padding-bottom: 1rem;
                    border-bottom: 1px dashed var(--border);
                }
                .item-main {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
                .item-numbers {
                    display: grid;
                    grid-template-columns: 0.8fr 1fr 1fr auto;
                    gap: 0.5rem;
                    align-items: center;
                }
                .item-total {
                    font-weight: 600;
                    text-align: right;
                    padding-right: 0.5rem;
                }
                .remove-btn {
                    color: var(--text-secondary);
                    padding: 0.5rem;
                    transition: color 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .remove-btn:hover {
                    color: var(--danger);
                }
                .summary-title {
                    font-size: 1.1rem;
                    font-weight: 600;
                    margin-bottom: 1rem;
                }
                .summary-row {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 0.75rem;
                    color: var(--text-secondary);
                }
                .summary-divider {
                    height: 1px;
                    background: var(--border);
                    margin: 1rem 0;
                }
                .summary-row.total {
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: var(--text-main);
                }
                @media (max-width: 1024px) {
                    .invoice-grid {
                        grid-template-columns: 1fr;
                    }
                    .item-row {
                         grid-template-columns: 1fr;
                    }
                    .form-row {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
};

export default InvoiceBuilder;
