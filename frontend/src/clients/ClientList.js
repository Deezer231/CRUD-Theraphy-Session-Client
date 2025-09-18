import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ClientCard from './ClientCard';
import AddClient from './AddClient';

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const [editingClient, setEditingClient] = useState(null);

  useEffect(() => {
    fetchclients();
  }, []);

  const fetchclients = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/clients');
      setClients(response.data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/clients/${id}`);
      fetchclients();
    } catch (error) {
      console.error('Error deleting client:', error);
    }
  };

  return (
    <div className="client-list">
      <AddClient 
        onAdd={fetchclients} 
        editingClient={editingClient}
        setEditingClient={setEditingClient}
      />
      <div className="client-grid">
        {clients.map(client => (
          <ClientCard 
            key={client.client_id}
            client={client}
            onEdit={() => setEditingClient(client)}
            onDelete={() => handleDelete(client.client_id)}
          />
        ))}
      </div>
    </div>
  );
};

export default ClientList;