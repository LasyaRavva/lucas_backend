const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// GET /api/users/dashboard?userId=...
router.get('/dashboard', async (req, res) => {
  const userId = req.query.userId;
  if (!userId) return res.status(400).json({ error: 'userId is required' });
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) return res.status(404).json({ error: 'User not found' });
  res.json(data);
});

module.exports = router;
