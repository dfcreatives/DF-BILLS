import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import Table from '../components/Table';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Input from '../components/Input';
import { Plus, Edit, Trash2, Search, IndianRupee, Tag } from 'lucide-react';
import Card from '../components/Card';

const Services = () => {
  const { services, addService, updateService, deleteService } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: ''
  });

  const handleOpenModal = (service = null) => {
    if (service) {
      setEditingService(service);
      setFormData(service);
    } else {
      setEditingService(null);
      setFormData({ name: '', description: '', price: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingService(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingService) {
      updateService(editingService.id, formData);
    } else {
      addService(formData);
    }
    handleCloseModal();
  };

  const handleDelete = (id) => {
      if (confirm('Are you sure you want to delete this service?')) {
          deleteService(id);
      }
  };

  const filteredServices = services.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Services</h1>
        <Button onClick={() => handleOpenModal()}>
          <Plus size={18} /> Add Service
        </Button>
      </div>

      <Card className="content-card">
        <div className="table-actions">
            <div className="search-wrapper">
                <Search size={18} className="search-icon" />
                <input 
                    type="text" 
                    placeholder="Search services..." 
                    className="search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>

        <Table 
          headers={['Service Name', 'Description', 'Price', 'Actions']}
          data={filteredServices}
          renderRow={(service) => (
            <tr key={service.id}>
              <td>
                <div className="service-name">{service.name}</div>
              </td>
              <td style={{ maxWidth: '300px' }}>
                <div className="service-desc">{service.description}</div>
              </td>
              <td>
                <div className="service-price">
                    <IndianRupee size={14} /> {parseFloat(service.price).toFixed(2)}
                </div>
              </td>
              <td>
                <div className="action-buttons">
                  <Button variant="secondary" size="sm" onClick={() => handleOpenModal(service)}>
                    <Edit size={16} />
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(service.id)}>
                    <Trash2 size={16} />
                  </Button>
                </div>
              </td>
            </tr>
          )}
          emptyMessage="No services found. Add one to get started!"
        />
      </Card>

      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        title={editingService ? 'Edit Service' : 'Add New Service'}
      >
        <form onSubmit={handleSubmit} className="form-stack">
          <Input 
            label="Service Name" 
            value={formData.name} 
            onChange={e => setFormData({...formData, name: e.target.value})}
            required
            placeholder="e.g. Web Design"
          />
          <Input 
            label="Description" 
            value={formData.description} 
            onChange={e => setFormData({...formData, description: e.target.value})}
            placeholder="e.g. Full website design + implementation"
          />
          <Input 
            label="Price (₹)" 
            type="number"
            step="0.01"
            value={formData.price} 
            onChange={e => setFormData({...formData, price: e.target.value})}
            required
            placeholder="0.00"
          />
          <div className="form-actions">
            <Button type="button" variant="secondary" onClick={handleCloseModal}>Cancel</Button>
            <Button type="submit">{editingService ? 'Save Changes' : 'Add Service'}</Button>
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
        .service-name {
            font-weight: 600;
            color: var(--text-main);
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        .service-desc {
            color: var(--text-secondary);
            font-size: 0.9rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .service-price {
            font-weight: 600;
            color: var(--success);
            display: flex;
            align-items: center;
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

export default Services;
