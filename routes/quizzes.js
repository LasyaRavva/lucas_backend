const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// GET /api/quizzes
router.get('/', async (req, res) => {
  const { data, error } = await supabase.from('quizzes').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});


// GET /api/quizzes/:quizId/questions
router.get('/:quizId/questions', async (req, res) => {
  const { quizId } = req.params;
  const { data, error } = await supabase
    .from('quiz_questions')
    .select('*')
    .eq('quiz_id', quizId);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

module.exports = router;
