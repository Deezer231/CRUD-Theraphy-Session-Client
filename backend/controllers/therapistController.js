const db = require('../db');

// GET all therapists
exports.getAllTherapists = async (req, res) => {
  try {
    const [therapists] = await db.query('SELECT * FROM therapists');
    res.json(therapists);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET single therapist
exports.getTherapist = async (req, res) => {
  try {
    const [therapist] = await db.query(
      'SELECT * FROM therapists WHERE therapist_id = ?',
      [req.params.id]
    );
    if (therapist.length === 0) {
      return res.status(404).json({ error: 'Therapist not found' });
    }
    res.json(therapist[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE therapist
exports.createTherapist = async (req, res) => {
  const { title, name, email, location, years_of_practice, availability } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO therapists SET ?',
      { title, name, email, location, years_of_practice, availability }
    );
    res.status(201).json({ therapist_id: result.insertId, ...req.body });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// UPDATE therapist
exports.updateTherapist = async (req, res) => {
  const { title, name, email, location, years_of_practice, availability } = req.body;
  try {
    const [result] = await db.query(
      'UPDATE therapists SET ? WHERE therapist_id = ?',
      [{ title, name, email, location, years_of_practice, availability }, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Therapist not found' });
    }
    res.json({ therapist_id: req.params.id, ...req.body });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// GET session count for therapist
exports.getSessionCount = async (req, res) => {
  try {
    const [result] = await db.query(
      'SELECT COUNT(*) AS count FROM sessions WHERE therapist_id = ?',
      [req.params.id]
    );
    res.json({ count: result[0].count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE therapist - Robust solution with fallback options
exports.deleteTherapist = async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // Option 1: Try direct deletion first (relying on CASCADE)
    const [deleteResult] = await connection.query(
      'DELETE FROM therapists WHERE therapist_id = ?',
      [req.params.id]
    );

    if (deleteResult.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({ 
        success: false,
        error: 'Therapist not found' 
      });
    }

    // If we get here, deletion succeeded
    await connection.commit();
    
    res.json({
      success: true,
      message: 'Therapist deleted successfully'
    });

  } catch (err) {
    await connection.rollback();
    
    // If cascade failed, try manual deletion
    if (err.code === 'ER_ROW_IS_REFERENCED_2' || err.sqlMessage.includes('foreign key constraint')) {
      try {
        await connection.beginTransaction();
        
        // First delete sessions
        await connection.query(
          'DELETE FROM sessions WHERE therapist_id = ?',
          [req.params.id]
        );
        
        // Then delete therapist
        const [result] = await connection.query(
          'DELETE FROM therapists WHERE therapist_id = ?',
          [req.params.id]
        );
        
        if (result.affectedRows === 0) {
          await connection.rollback();
          return res.status(404).json({ 
            success: false,
            error: 'Therapist not found after session deletion' 
          });
        }
        
        await connection.commit();
        return res.json({
          success: true,
          message: 'Therapist and sessions deleted successfully'
        });
      } catch (innerErr) {
        await connection.rollback();
        console.error('SECONDARY DELETE ERROR:', innerErr);
        return res.status(500).json({
          success: false,
          error: 'Failed to delete therapist even with manual session deletion',
          details: innerErr.sqlMessage || innerErr.message
        });
      }
    }

    console.error('DELETE ERROR:', {
      message: err.message,
      sqlMessage: err.sqlMessage,
      stack: err.stack
    });
    res.status(500).json({
      success: false,
      error: 'Delete operation failed',
      details: err.sqlMessage || err.message
    });
  } finally {
    connection.release();
  }
};