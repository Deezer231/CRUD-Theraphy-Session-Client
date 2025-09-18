import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SessionsPage = () => {
  const [sessions, setSessions] = useState([]);
  const [therapists, setTherapists] = useState([]);
  const [clients, setClients] = useState([]);
  const [formData, setFormData] = useState({
    therapist_id: '',
    client_id: '',
    notes: '',
    session_date: '',
    length_minutes: 60
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [sessionsRes, therapistsRes, clientsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/sessions'),
        axios.get('http://localhost:5000/api/therapists'),
        axios.get('http://localhost:5000/api/clients')
      ]);
      setSessions(sessionsRes.data);
      setTherapists(therapistsRes.data);
      setClients(clientsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/sessions/${editingId}`, formData);
      } else {
        await axios.post('http://localhost:5000/api/sessions', formData);
      }
      setEditingId(null);
      setFormData({
        therapist_id: '',
        client_id: '',
        notes: '',
        session_date: '',
        length_minutes: 60
      });
      fetchData();
    } catch (error) {
      console.error('Error saving session:', error);
    }
  };

  const handleEdit = (session) => {
    setFormData({
      therapist_id: session.therapist_id,
      client_id: session.client_id,
      notes: session.notes,
      session_date: session.session_date.slice(0, 16), // Remove seconds for datetime-local input
      length_minutes: session.length_minutes
    });
    setEditingId(session.session_id);
  };

  return (
    <div className="page-container">
      <h1>Session Management</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Therapist</label>
          <select
            name="therapist_id"
            value={formData.therapist_id}
            onChange={(e) => setFormData({...formData, therapist_id: e.target.value})}
            required
          >
            <option value="">Select Therapist</option>
            {therapists.map(t => (
              <option key={t.therapist_id} value={t.therapist_id}>
                {t.name} ({t.availability})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Client</label>
          <select
            name="client_id"
            value={formData.client_id}
            onChange={(e) => setFormData({...formData, client_id: e.target.value})}
            required
          >
            <option value="">Select Client</option>
            {clients.map(c => (
              <option key={c.client_id} value={c.client_id}>
                {c.name} ({c.appointment_regularity})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Session Date/Time</label>
          <input
            type="datetime-local"
            name="session_date"
            value={formData.session_date}
            onChange={(e) => setFormData({...formData, session_date: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label>Duration (minutes)</label>
          <input
            type="number"
            name="length_minutes"
            value={formData.length_minutes}
            onChange={(e) => setFormData({...formData, length_minutes: e.target.value})}
            min="30"
            max="120"
            required
          />
        </div>

        <div className="form-group">
          <label>Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
            rows="3"
          />
        </div>

        <button type="submit" className="btn-primary">
          {editingId ? 'Update Session' : 'Add Session'}
        </button>
        {editingId && (
          <button 
            type="button" 
            className="btn-secondary"
            onClick={() => setEditingId(null)}
          >
            Cancel
          </button>
        )}
      </form>

      <div className="sessions-table">
        <h2>Upcoming Sessions</h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Therapist</th>
              <th>Client</th>
              <th>Duration</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map(session => (
              <tr key={session.session_id}>
                <td>{new Date(session.session_date).toLocaleString()}</td>
                <td>{session.therapist_name}</td>
                <td>{session.client_name}</td>
                <td>{session.length_minutes} mins</td>
                <td>{session.notes} </td>
                <td>
                  <button 
                    className="btn-edit"
                    onClick={() => handleEdit(session)}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn-danger"
                    onClick={() => {
                      if (window.confirm('Delete this session?')) {
                        axios.delete(`http://localhost:5000/api/sessions/${session.session_id}`)
                          .then(fetchData);
                      }
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SessionsPage;