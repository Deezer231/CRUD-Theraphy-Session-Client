const express = require('express');
const router = express.Router();
const sessionsController = require('../controllers/sessionsController');

// GET all sessions with therapist and client details
router.get('/', sessionsController.getAllSessions);

// GET single session
router.get('/:id', async (req, res) => {
  try {
    const [session] = await pool.promise().query(`
      SELECT 
        s.*,
        t.name AS therapist_name,
        c.name AS client_name
      FROM sessions s
      JOIN therapists t ON s.therapist_id = t.therapist_id
      JOIN clients c ON s.client_id = c.client_id
      WHERE s.session_id = ?
    `, [req.params.id]);
    
    if (session.length === 0) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    // Format the datetime if needed
    const formattedSession = {
      ...session[0],
      date: session[0].session_date.toISOString().split('T')[0],
      time: session[0].session_date.toTimeString().split(' ')[0]
    };
    
    res.json(formattedSession);
  } catch (err) {
    console.error('GET /sessions/:id error:', err);
    res.status(500).json({ error: 'Failed to fetch session' });
  }
});

// POST create new session
router.post('/', sessionsController.createSession);

// PUT update session
router.put('/:id', sessionsController.updateSession);

// DELETE session
router.delete('/:id', sessionsController.deleteSession);

module.exports = router;