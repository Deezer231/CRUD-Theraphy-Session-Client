const db = require('../db');

exports.createClient = async (req, res) => {
  const { name, email, phone_number, appointment_regularity } = req.body;
  
  // Validation
  if (!name || !email || !phone_number) {
    return res.status(400).json({ error: 'Name, email and phone number are required' });
  }

  try {
    const [result] = await db.promise().query(
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
    console.error('Database error:', err);
    res.status(500).json({ error: 'Failed to create client' });
  }
};

exports.getAllClients = async (req, res) => {
  try {
    const [clients] = await db.promise().query(
      'SELECT client_id, name, email, phone_number, appointment_regularity FROM clients'
    );
    res.json(clients);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Failed to fetch clients' });
  }
};

exports.updateClient = async (req, res) => {
  const clientId = req.params.id;
  const { name, email, phone_number, appointment_regularity } = req.body;

  if (!name || !email || !phone_number) {
    return res.status(400).json({ error: 'Name, email and phone number are required' });
  }

  try {
    const [result] = await db.promise().query(
      'UPDATE clients SET ? WHERE client_id = ?',
      [{ name, email, phone_number, appointment_regularity }, clientId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Client not found' });
    }
    
    res.json({ 
      client_id: clientId, 
      name, 
      email, 
      phone_number, 
      appointment_regularity 
    });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Failed to update client' });
  }
};

exports.deleteClient = async (req, res) => {
  const clientId = req.params.id;
  
  try {
    // Check for existing sessions
    const [sessions] = await db.promise().query(
      'SELECT 1 FROM sessions WHERE client_id = ? LIMIT 1',
      [clientId]
    );
    
    if (sessions.length > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete client with existing sessions' 
      });
    }

    const [result] = await db.promise().query(
      'DELETE FROM clients WHERE client_id = ?',
      [clientId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Client not found' });
    }
    
    res.json({ message: 'Client deleted successfully' });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Failed to delete client' });
  }
};