const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// GET /api/conversations
router.get('/', async (req, res) => {
  const { lessonId } = req.query;
  let query = supabase.from('conversation').select('*');
  if (lessonId) query = query.eq('lesson_id', lessonId);
  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// GET /api/conversations/:id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('conversation')
    .select('*')
    .eq('id', id)
    .single();
  if (error || !data) return res.status(404).json({ error: 'Conversation not found' });
  res.json(data);
});

module.exports = router;
