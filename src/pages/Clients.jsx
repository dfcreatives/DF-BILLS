import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import Table from '../components/Table';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Input from '../components/Input';
import { Plus, Edit, Trash2, Search, Mail, Phone, MapPin } from 'lucide-react';
import Card from '../components/Card';

const Clients = () => {
  const { clients, addClient, updateClient, deleteClient } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  const handleOpenModal = (client = null) => {
    if (client) {
      setEditingClient(client);
      setFormData(client);
    } else {
      setEditingClient(null);
      setFormData({ name: '', email: '', phone: '', address: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingClient(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingClient) {
      updateClient(editingClient.id, formData);
    } else {
      addClient(formData);
    }
    handleCloseModal();
  };

  const handleDelete = (id) => {
      if (confirm('Are you sure you want to delete this client?')) {
          deleteClient(id);
      }
  };

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Clients</h1>
        <Button onClick={() => handleOpenModal()}>
          <Plus size={18} /> Add Client
        </Button>
      </div>

      <Card className="content-card">
        <div className="table-actions">
            <div className="search-wrapper">
                <Search size={18} className="search-icon" />
                <input 
                    type="text" 
                    placeholder="Search clients..." 
                    className="search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>

        <Table 
          headers={['Name', 'Contact Info', 'Address', 'Actions']}
          data={filteredClients}
          renderRow={(client) => (
            <tr key={client.id}>
              <td>
                <div className="client-name">{client.name}</div>
              </td>
              <td>
                <div className="client-contact">
                    <div className="contact-item"><Mail size={14}/> {client.email}</div>
                    {client.phone && <div className="contact-item"><Phone size={14}/> {client.phone}</div>}
                </div>
              </td>
              <td style={{ maxWidth: '200px' }}>
                {client.address && (
                    <div className="contact-item" style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                        <MapPin size={14}/> {client.address}
                    </div>
                )}
              </td>
              <td>
                <div className="action-buttons">
                  <Button variant="secondary" size="sm" onClick={() => handleOpenModal(client)}>
                    <Edit size={16} />
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(client.id)}>
                    <Trash2 size={16} />
                  </Button>
                </div>
              </td>
            </tr>
          )}
          emptyMessage="No clients found. Add one to get started!"
        />
      </Card>

      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        title={editingClient ? 'Edit Client' : 'Add New Client'}
      >
        <form onSubmit={handleSubmit} className="form-stack">
          <Input 
            label="Client Name" 
            value={formData.name} 
            onChange={e => setFormData({...formData, name: e.target.value})}
            required
            placeholder="e.g. Acme Corp"
          />
          <Input 
            label="Email" 
            type="email"
            value={formData.email} 
            onChange={e => setFormData({...formData, email: e.target.value})}
            required
            placeholder="contact@acme.com"
          />
          <Input 
            label="Phone" 
            value={formData.phone} 
            onChange={e => setFormData({...formData, phone: e.target.value})}
            placeholder="+1 234 567 890"
          />
          <Input 
            label="Address" 
            value={formData.address} 
            onChange={e => setFormData({...formData, address: e.target.value})}
            placeholder="123 Business Rd..."
          />
          <div className="form-actions">
            <Button type="button" variant="secondary" onClick={handleCloseModal}>Cancel</Button>
            <Button type="submit">{editingClient ? 'Save Changes' : 'Add Client'}</Button>
          </div>
        </form>
      </Modal>

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
        .page-header h1 {
            font-size: 1.8rem;
            color: var(--text-main);
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
        .client-name {
            font-weight: 600;
            color: var(--text-main);
        }
        .client-contact {
            display: flex;
            flex-direction: column;
            gap: 0.2rem;
            font-size: 0.85rem;
            color: var(--text-secondary);
        }
        .contact-item {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        .action-buttons {
            display: flex;
            gap: 0.5rem;
        }
        .form-stack {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
        .form-actions {
            display: flex;
            justify-content: flex-end;
            gap: 1rem;
            margin-top: 1rem;
        }
      `}</style>
    </div>
  );
};

export default Clients;
