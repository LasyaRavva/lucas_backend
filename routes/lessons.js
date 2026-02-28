const express = require('express')
const router = express.Router()
const supabase = require('../config/supabase')

// GET /api/lessons
router.get('/', async (req, res) => {
  const { data, error } = await supabase.from('lesson').select('*')
  if (error) return res.status(500).json({ error: error.message })
  const lessons = data.map(lesson => ({
    ...lesson,
    topics: typeof lesson.topics === 'string' ? JSON.parse(lesson.topics) : lesson.topics || [],
    learning_practices: typeof lesson.learning_practices === 'string' ? JSON.parse(lesson.learning_practices) : lesson.learning_practices || null,
  }))
  res.json(lessons)
})

// GET /api/lessons/:id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('lesson')
    .select('*')
    .eq('id', id)
    .single();
  if (error) return res.status(404).json({ error: 'Lesson not found' });
  const lesson = {
    ...data,
    topics: typeof data.topics === 'string' ? JSON.parse(data.topics) : data.topics || [],
    learning_practices: typeof data.learning_practices === 'string' ? JSON.parse(data.learning_practices) : data.learning_practices || null,
  };
  res.json(lesson);
});

module.exports = router
