const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test database connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to database successfully');
  connection.release();
});

// ======================
// CLIENT ROUTES
// ======================

// GET all clients
app.get('/api/clients', async (req, res) => {
  try {
    const [clients] = await pool.promise().query(`
      SELECT client_id, name, email, phone_number, appointment_regularity 
      FROM clients
    `);
    res.json(clients);
  } catch (err) {
    console.error('GET /api/clients error:', err);
    res.status(500).json({ error: 'Failed to fetch clients' });
  }
});

// GET single client
app.get('/api/clients/:id', async (req, res) => {
  try {
    const [client] = await pool.promise().query(
      'SELECT * FROM clients WHERE client_id = ?',
      [req.params.id]
    );
    if (client.length === 0) {
      return res.status(404).json({ error: 'Client not found' });
    }
    res.json(client[0]);
  } catch (err) {
    console.error('GET /api/clients/:id error:', err);
    res.status(500).json({ error: 'Failed to fetch client' });
  }
});

// POST create new client
app.post('/api/clients', async (req, res) => {
  const { name, email, phone_number, appointment_regularity } = req.body;
  
  if (!name || !email || !phone_number) {
    return res.status(400).json({ error: 'Name, email and phone number are required' });
  }

  try {
    const [result] = await pool.promise().query(
      'INSERT INTO clients SET ?',
      { name, email, phone_number, appointment_regularity }
    );
    res.status(201).json({ 
      client_id: result.insertId,
      name,
      email,
      phone_number,
      appointment_regularity
    });
  } catch (err) {
    console.error('POST /api/clients error:', err);
    res.status(500).json({ error: 'Failed to create client' });
  }
});

// PUT update client
app.put('/api/clients/:id', async (req, res) => {
  const clientId = req.params.id;
  const { name, email, phone_number, appointment_regularity } = req.body;

  try {
    const [result] = await pool.promise().query(
      'UPDATE clients SET ? WHERE client_id = ?',
      [{ name, email, phone_number, appointment_regularity }, clientId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Client not found' });
    }
    res.json({ 
      therapist_id: result.insertId,
      name,
      email,
      phone_number,
      appointment_regularity
    });
  } catch (err) {
    console.error('PUT /api/clients/:id error:', err);
    res.status(500).json({ error: 'Failed to update client' });
  }
});

// DELETE client
app.delete('/api/clients/:id', async (req, res) => {
  const clientId = req.params.id;
  
  try {
    // Check for existing sessions first
    const [sessions] = await pool.promise().query(
      'SELECT 1 FROM sessions WHERE client_id = ? LIMIT 1',
      [clientId]
    );
    
    if (sessions.length > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete client with existing sessions' 
      });
    }

    const [result] = await pool.promise().query(
      'DELETE FROM clients WHERE client_id = ?',
      [clientId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Client not found' });
    }
    res.json({ message: 'Client deleted successfully' });
  } catch (err) {
    console.error('DELETE /api/clients/:id error:', err);
    res.status(500).json({ error: 'Failed to delete client' });
  }
});

// ======================
// THERAPIST ROUTES
// ======================

// GET all therapists
app.get('/api/therapists', async (req, res) => {
  try {
    const [therapists] = await pool.promise().query(`
      SELECT therapist_id, title, name, email, location, years_of_practice, availability
      FROM therapists
    `);
    res.json(therapists);
  } catch (err) {
    console.error('GET /api/therapists error:', err);
    res.status(500).json({ error: 'Failed to fetch therapists' });
  }
});

// GET single therapist
app.get('/api/therapists/:id', async (req, res) => {
  try {
    const [therapist] = await pool.promise().query(
      'SELECT * FROM therapists WHERE therapist_id = ?',
      [req.params.id]
    );
    if (therapist.length === 0) {
      return res.status(404).json({ error: 'Therapist not found' });
    }
    res.json(therapist[0]);
  } catch (err) {
    console.error('GET /api/therapists/:id error:', err);
    res.status(500).json({ error: 'Failed to fetch therapist' });
  }
});
// POST create new therapist
app.post('/api/therapists', async (req, res) => {
  const { name, email, location } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  try {
    const [result] = await pool.promise().query(
      'INSERT INTO therapists SET ?',
      { therapist_id, title, name, email, location, years_of_practice, availability }
    );
    res.status(201).json({ 
      therapist_id: result.insertId,
      title,
      name,
      email,
      location,
      years_of_practice,
      availability

    });
  } catch (err) {
    console.error('POST /api/therapists error:', err);
    res.status(500).json({ error: 'Failed to create therapist' });
  }
});

// PUT update therapist
app.put('/api/therapists/:id', async (req, res) => {
  const therapistId = req.params.id;
  const { name, email, location, years_of_practice, availability} = req.body;

  try {
    const [result] = await pool.promise().query(
      'UPDATE therapists SET ? WHERE therapist_id = ?',
      [{ name, email, location, years_of_practice, availability }, therapistId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Therapist not found' });
    }
    res.json({ 
      therapist_id: result.insertId,
      name,
      email,
      location,
      years_of_practice,
      availability
    });
  } catch (err) {
    console.error('PUT /api/therapists/:id error:', err);
    res.status(500).json({ error: 'Failed to update therapist' });
  }
});

// DELETE therapist
app.delete('/api/therapists/:id', async (req, res) => {
  const therapistId = req.params.id;
  
  try {
    // Check for existing sessions first
    const [sessions] = await pool.promise().query(
      'SELECT 1 FROM sessions WHERE therapist_id = ? LIMIT 1',
      [therapistId]
    );
    
    if (sessions.length > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete therapist with existing sessions' 
      });
    }

    const [result] = await pool.promise().query(
      'DELETE FROM therapists WHERE therapist_id = ?',
      [therapistId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Therapist not found' });
    }
    res.json({ message: 'Therapist deleted successfully' });
  } catch (err) {
    console.error('DELETE /api/therapists/:id error:', err);
    res.status(500).json({ error: 'Failed to delete therapist' });
  }
});

// ======================
// SESSION ROUTES
// ======================

// GET all sessions with details (updated to match your schema)
app.get('/api/sessions', async (req, res) => {
  try {
    const [sessions] = await pool.promise().query(`
      SELECT 
        s.session_id,
        s.session_date,
        s.length_minutes,
        s.notes,
        t.therapist_id,
        t.name AS therapist_name,
        c.client_id,
        c.name AS client_name
      FROM sessions s
      JOIN therapists t ON s.therapist_id = t.therapist_id
      JOIN clients c ON s.client_id = c.client_id
      ORDER BY s.session_date DESC
    `);
    
    // Format the datetime if needed
    const formattedSessions = sessions.map(session => ({
      ...session,
      date: session.session_date.toISOString().split('T')[0],
      time: session.session_date.toTimeString().split(' ')[0]
    }));
    
    res.json(formattedSessions);
  } catch (err) {
    console.error('GET /api/sessions error:', {
      message: err.message,
      sql: err.sql,
      stack: err.stack
    });
    res.status(500).json({ 
      error: 'Failed to fetch sessions',
      details: err.message
    });
  }
});

// POST create new session (updated)
app.post('/api/sessions', async (req, res) => {
  const { therapist_id, client_id, session_date, length_minutes, notes } = req.body;
  
  if (!therapist_id || !client_id || !session_date || !length_minutes) {
    return res.status(400).json({ 
      error: 'Therapist ID, client ID, session date and length are required' 
    });
  }

  try {
    const [result] = await pool.promise().query(
      'INSERT INTO sessions SET ?',
      { 
        therapist_id, 
        client_id, 
        session_date: new Date(session_date),
        length_minutes,
        notes 
      }
    );
    
    res.status(201).json({ 
      session_id: result.insertId,
      therapist_id,
      client_id,
      session_date,
      length_minutes,
      notes
    });
  } catch (err) {
    console.error('POST /api/sessions error:', err);
    res.status(500).json({ 
      error: 'Failed to create session',
      details: err.message
    });
  }
});

// PUT update session (updated)
app.put('/api/sessions/:id', async (req, res) => {
  const sessionId = req.params.id;
  const { therapist_id, client_id, session_date, length_minutes, notes } = req.body;

  try {
    const [result] = await pool.promise().query(
      'UPDATE sessions SET ? WHERE session_id = ?',
      [{
        therapist_id, 
        client_id, 
        session_date: new Date(session_date),
        length_minutes,
        notes
      }, sessionId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    res.json({ 
      session_id: sessionId,
      therapist_id,
      client_id,
      session_date,
      length_minutes,
      notes
    });
  } catch (err) {
    console.error('PUT /api/sessions/:id error:', err);
    res.status(500).json({ 
      error: 'Failed to update session',
      details: err.message
    });
  }
});

// DELETE session
app.delete('/api/sessions/:id', async (req, res) => {
  try {
    const [result] = await pool.promise().query(
      'DELETE FROM sessions WHERE session_id = ?',
      [req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Session not found' });
    }
    res.json({ message: 'Session deleted successfully' });
  } catch (err) {
    console.error('DELETE /api/sessions/:id error:', err);
    res.status(500).json({ error: 'Failed to delete session' });
  }
});

// ======================
// SERVER START
// ======================

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  console.log('Available endpoints:');
  console.log(`- Clients: http://localhost:${port}/api/clients`);
  console.log(`- Therapists: http://localhost:${port}/api/therapists`);
  console.log(`- Sessions: http://localhost:${port}/api/sessions`);
});