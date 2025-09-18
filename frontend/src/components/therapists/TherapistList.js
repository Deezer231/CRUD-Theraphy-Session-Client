import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EditTherapist from './EditTherapist';

const TherapistList = () => {
  const [therapists, setTherapists] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchTherapists();
  }, []);

  const fetchTherapists = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/therapists');
      setTherapists(response.data);
    } catch (error) {
      console.error('Error fetching therapists:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this therapist?')) return;
    
    try {
      await axios.delete(`http://localhost:5000/api/therapists/${id}`);
      fetchTherapists(); // Refresh the list after deletion
    } catch (error) {
      console.error('Error deleting therapist:', error);
      alert('Failed to delete therapist. Please try again.');
    }
  };

  return (
    <div className="therapists-container">
      <h2>Therapists</h2>
      <ul>
        {therapists.map(therapist => (
          <li key={therapist.therapist_id}>
            {editingId === therapist.therapist_id ? (
              <EditTherapist 
                therapist={therapist} 
                onUpdate={() => {
                  setEditingId(null);
                  fetchTherapists();
                }} 
              />
            ) : (
              <>
                <strong>{therapist.title} {therapist.name}</strong>
                <p>Email: {therapist.email}</p>
                <p>Location: {therapist.location}</p>
                <p>Experience: {therapist.years_of_practice} </p>
                <p>Availability: {therapist.availability}</p>
                <button onClick={() => setEditingId(therapist.therapist_id)}>Edit</button>
                <button onClick={() => handleDelete(Number(therapist.therapist_id))}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TherapistList;