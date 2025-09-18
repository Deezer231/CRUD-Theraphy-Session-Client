
import { useState, useEffect } from 'react';
import axios from 'axios';




const ClientsPage = () => {
  const [clients, setClients] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: '',
    appointment_regularity: 'WEEKLY'
  });
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await axios.get('http://localhost:5000/api/clients');
      setClients(response.data);
    } catch (err) {
      setError('Failed to load clients. Please try again.');
      console.error('Fetch clients error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone_number) {
      setError('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/clients/${editingId}`, formData);
        setSuccess('Client updated successfully');
      } else {
        await axios.post('http://localhost:5000/api/clients', formData);
        setSuccess('Client added successfully');
      }
      
      setEditingId(null);
      setFormData({
        name: '',
        email: '',
        phone_number: '',
        appointment_regularity: 'WEEKLY'
      });
      await fetchClients();
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred. Please try again.');
      console.error('Submit error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this client?')) return;
    
    setIsLoading(true);
    setError('');
    try {
      await axios.delete(`http://localhost:5000/api/clients/${id}`);
      setSuccess('Client deleted successfully');
      await fetchClients();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete client');
      console.error('Delete error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (client) => {
    setFormData({
      name: client.name,
      email: client.email,
      phone_number: client.phone_number,
      appointment_regularity: client.appointment_regularity
    });
    setEditingId(client.client_id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="clients-container">
      <h1>Client Management</h1>
      
      {error && <div className="alert error">{error}</div>}
      {success && <div className="alert success">{success}</div>}

      <form onSubmit={handleSubmit} className="client-form">
        <div className="form-group">
          <label>Full Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            disabled={isLoading}
            required
          />
        </div>

        <div className="form-group">
          <label>Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            disabled={isLoading}
            required
          />
        </div>

        <div className="form-group">
          <label>Phone Number *</label>
          <input
            type="tel"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleInputChange}
            disabled={isLoading}
            required
          />
        </div>

        <div className="form-group">
          <label>Appointment Regularity</label>
          <select
            name="appointment_regularity"
            value={formData.appointment_regularity}
            onChange={handleInputChange}
            disabled={isLoading}
          >
            <option value="WEEKLY">Weekly</option>
            <option value="MONTHLY">Monthly</option>
          </select>
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className="btn primary"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : editingId ? 'Update Client' : 'Add Client'}
          </button>
          
          {editingId && (
            <button 
              type="button" 
              className="btn secondary"
              onClick={() => {
                setEditingId(null);
                setFormData({
                  name: '',
                  email: '',
                  phone_number: '',
                  appointment_regularity: 'WEEKLY'
                });
              }}
              disabled={isLoading}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="clients-list">
        <h2>Client List</h2>
        
        {isLoading && clients.length === 0 ? (
          <p>Loading clients...</p>
        ) : clients.length === 0 ? (
          <p>No clients found</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Regularity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.map(client => (
                <tr key={client.client_id}>
                  <td>{client.name}</td>
                  <td>{client.email}</td>
                  <td>{client.phone_number}</td>
                  <td>{client.appointment_regularity}</td>
                  <td className="actions">
                    <button 
                      className="btn edit"
                      onClick={() => handleEdit(client)}
                      disabled={isLoading}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn danger"
                      onClick={() => handleDelete(client.client_id)}
                      disabled={isLoading}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ClientsPage;