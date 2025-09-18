import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddClient = ({ onAdd, editingClient, setEditingClient }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: '',
    appointment_regularity: 'WEEKLY'
  });

  useEffect(() => {
    if (editingClient) {
      setFormData({
        name: editingClient.name,
        email: editingClient.email,
        phone_number: editingClient.phone_number,
        appointment_regularity: editingClient.appointment_regularity
      });
    }
  }, [editingClient]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingClient) {
        await axios.put(
          `http://localhost:5000/api/clients/${editingClient.client_id}`,
          formData
        );
      } else {
        await axios.post('http://localhost:5000/api/clients', formData);
      }
      setFormData({
        name: '',
        email: '',
        phone_number: '',
        appointment_regularity: 'WEEKLY'
      });
      setEditingClient(null);
      onAdd();
    } catch (error) {
      console.error('Error saving client:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="client-form">
      <input
        type="text"
        placeholder="Full Name"
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
        required
      />
      <input
        type="tel"
        placeholder="Phone Number"
        value={formData.phone_number}
        onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
        required
      />
      <select
        value={formData.appointment_regularity}
        onChange={(e) => setFormData({...formData, appointment_regularity: e.target.value})}
      >
        <option value="WEEKLY">Weekly</option>
        <option value="MONTHLY">Monthly</option>
      </select>
      <button type="submit">
        {editingClient ? 'Update Client' : 'Add Client'}
      </button>
      {editingClient && (
        <button type="button" onClick={() => setEditingClient(null)}>
          Cancel
        </button>
      )}
    </form>
  );
};

export default AddClient;