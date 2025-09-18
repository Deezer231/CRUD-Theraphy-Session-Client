const express = require('express');
const therapistController = require('../controllers/therapistController');
const router = express.Router();


// CRUD Routes
router.get('/', therapistController.getAllTherapists);
router.get('/:id', therapistController.getTherapist);
router.post('/', therapistController.createTherapist);
router.put('/:id', therapistController.updateTherapist);
router.delete('/:id', therapistController.deleteTherapist);
router.get('/:id/sessions/count', therapistController.getSessionCount);
router.get('/:id/sessions/count', async (req, res) => {
    try {
      const [count] = await db.query(
        'SELECT COUNT(*) AS count FROM sessions WHERE therapist_id = ?',
        [req.params.id]
      );
      res.json({ count: count[0].count });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
// Export the router
module.exports = router;