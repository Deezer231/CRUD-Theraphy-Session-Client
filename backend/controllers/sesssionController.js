const db = require('../db');

// CREATE Session
exports.createSession = async (req, res) => {
  const { therapist_id, client_id, notes, session_date, length_minutes } = req.body;
  
  if (!therapist_id || !client_id || !session_date || !length_minutes) {
    return res.status(400).json({ 
      error: 'Therapist ID, client ID, session date and length are required' 
    });
  }

  try {
    // Check if therapist and client exist
    const [therapist] = await db.query('SELECT 1 FROM therapists WHERE therapist_id = ?', [therapist_id]);
    const [client] = await db.query('SELECT 1 FROM clients WHERE client_id = ?', [client_id]);
    
    if (!therapist.length || !client.length) {
      return res.status(400).json({ error: 'Invalid therapist or client ID' });
    }

    const [result] = await db.query(
      'INSERT INTO sessions SET ?',
      { 
        therapist_id, 
        client_id, 
        notes, 
        session_date: new Date(session_date),
        length_minutes 
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
    console.error('CREATE session error:', err);
    res.status(500).json({ 
      error: 'Failed to create session',
      details: err.message
    });
  }
};

// READ All Sessions
exports.getAllSessions = async (req, res) => {
  try {
    const [sessions] = await db.query(`
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
    
    // Format dates if needed
    const formattedSessions = sessions.map(session => ({
      ...session,
      date: session.session_date.toISOString().split('T')[0],
      time: session.session_date.toTimeString().split(' ')[0]
    }));
    
    res.json(formattedSessions);
  } catch (err) {
    console.error('GET all sessions error:', err);
    res.status(500).json({ 
      error: 'Failed to fetch sessions',
      details: err.message
    });
  }
};

// UPDATE Session
exports.updateSession = async (req, res) => {
  const sessionId = req.params.id;
  const { therapist_id, client_id, notes, session_date, length_minutes } = req.body;

  try {
    const [result] = await db.query(
      'UPDATE sessions SET ? WHERE session_id = ?',
      [{ 
        therapist_id, 
        client_id, 
        notes, 
        session_date: new Date(session_date),
        length_minutes 
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
    console.error('UPDATE session error:', err);
    res.status(500).json({ 
      error: 'Failed to update session',
      details: err.message
    });
  }
};

// DELETE Session
exports.deleteSession = async (req, res) => {
  try {
    const [result] = await db.query(
      'DELETE FROM sessions WHERE session_id = ?',
      [req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    res.json({ message: 'Session deleted successfully' });
  } catch (err) {
    console.error('DELETE session error:', err);
    res.status(500).json({ 
      error: 'Failed to delete session',
      details: err.message
    });
  }
};