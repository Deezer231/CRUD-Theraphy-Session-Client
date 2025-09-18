import React, { useState, useEffect } from 'react';
import axios from 'axios';


const TherapistsPage = () => {
  const [therapists, setTherapists] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    name: '',
    email: '',
    location: '',
    years_of_practice: '',
    availability: 'TAKING CLIENTS'
  });
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

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/therapists/${editingId}`, formData);
      } else {
        await axios.post('http://localhost:5000/api/therapists', formData);
      }
      setEditingId(null);
      setFormData({
        title: '',
        name: '',
        email: '',
        location: '',
        years_of_practice: '',
        availability: 'TAKING_CLIENTS'
      });
      fetchTherapists();
    } catch (error) {
      console.error('Error saving therapist:', error);
    }
  };
  
  const handleEdit = (therapist) => {
    setFormData({
      title: therapist.title,
      name: therapist.name,
      email: therapist.email,
      location: therapist.location,
      years_of_practice: therapist.years_of_practice,
      availability: therapist.availability
    });
    setEditingId(therapist.therapist_id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Permanently delete this therapist and ALL their sessions?')) {
      return;
    }
  
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/therapists/${id}`,
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000
        }
      );
  
      if (!response.data.success) {
        throw new Error(response.data.error || 'Delete failed');
      }
  
      // Force complete refresh
      const freshData = await axios.get('http://localhost:5000/api/therapists');
      setTherapists(freshData.data);
  
      alert(`SUCCESS: ${response.data.message}`);
  
    } catch (error) {
      console.error('DELETE FAILED:', {
        error: error.response?.data || error.message,
        id
      });
      alert(`DELETE FAILED: ${error.response?.data?.error || error.message}`);
    }
  };
  return (
    <div className="therapists-container">
      <h1>Therapists Management</h1>
      
      <form onSubmit={handleSubmit} className="therapist-form">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="years_of_practice"
          placeholder="Years of Practice"
          value={formData.years_of_practice}
          onChange={handleInputChange}
          required
        />
        <select
          name="availability"
          value={formData.availability}
          onChange={handleInputChange}
        >
          <option value="TAKING CLIENTS">Taking clients</option>
          <option value="NOT TAKING CLIENTS">Not Taking clients</option>
        </select>
        <button type="submit">
          {editingId ? 'Update Therapist' : 'Add Therapist'}
        </button>
        {editingId && (
          <button type="button" onClick={() => setEditingId(null)}>
            Cancel
          </button>
        )}
      </form>

      <div className="therapists-list">
        <h2>Therapists List</h2>
        <table>
          <thead>
            <tr>
            <th>therapistId</th>
              <th>Title</th>
              <th>Name</th>
              <th>Email</th>
              <th>Location</th>
              <th>Experience</th>
              <th>Availability</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {therapists.map(therapist => (
              <tr key={therapist.therapist_id}>
                <td>{therapist.therapist_id}</td>
                <td>{therapist.title}</td>
                <td>{therapist.name}</td>
                <td>{therapist.email}</td>
                <td>{therapist.location}</td>
                <td>{therapist.years_of_practice} years </td>
                <td>{therapist.availability} </td>
                <td>
                  <button onClick={() => handleEdit(therapist)}>Edit</button>
                  <button onClick={() => handleDelete(therapist.therapist_id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TherapistsPage;