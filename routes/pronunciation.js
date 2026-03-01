const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// GET /api/pronunciation - Get all pronunciation exercises or filter by language/difficulty
router.get('/', async (req, res) => {
  try {
    const { language, difficulty, lessonId } = req.query;
    
    let query = supabase.from('pronunciation').select('*');
    
    if (language) {
      query = query.eq('language', language);
    }
    
    if (difficulty) {
      query = query.eq('difficulty', difficulty);
    }
    
    if (lessonId) {
      query = query.eq('lesson_id', lessonId);
    }
    
    const { data, error } = await query.order('created_at', { ascending: true });
    
    if (error) {
      console.error('Error fetching pronunciations:', error);
      return res.status(500).json({ error: error.message });
    }
    
    res.json(data);
  } catch (err) {
    console.error('Error in GET /pronunciation:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/pronunciation/:id - Get a specific pronunciation exercise
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('pronunciation')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching pronunciation:', error);
      return res.status(404).json({ error: 'Pronunciation exercise not found' });
    }
    
    res.json(data);
  } catch (err) {
    console.error('Error in GET /pronunciation/:id:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/pronunciation - Create new pronunciation exercise (admin)
router.post('/', async (req, res) => {
  try {
    const { lesson_id, language, text, phonetic, difficulty, audio_url, tips } = req.body;
    
    if (!language || !text) {
      return res.status(400).json({ error: 'Language and text are required' });
    }
    
    const { data, error } = await supabase
      .from('pronunciation')
      .insert([{
        lesson_id,
        language,
        text,
        phonetic,
        difficulty: difficulty || 'beginner',
        audio_url,
        tips
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating pronunciation:', error);
      return res.status(500).json({ error: error.message });
    }
    
    res.status(201).json(data);
  } catch (err) {
    console.error('Error in POST /pronunciation:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/pronunciation/:id - Update pronunciation exercise
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { lesson_id, language, text, phonetic, difficulty, audio_url, tips } = req.body;
    
    const { data, error } = await supabase
      .from('pronunciation')
      .update({
        lesson_id,
        language,
        text,
        phonetic,
        difficulty,
        audio_url,
        tips
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating pronunciation:', error);
      return res.status(500).json({ error: error.message });
    }
    
    res.json(data);
  } catch (err) {
    console.error('Error in PUT /pronunciation/:id:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/pronunciation/:id - Delete pronunciation exercise
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { error } = await supabase
      .from('pronunciation')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting pronunciation:', error);
      return res.status(500).json({ error: error.message });
    }
    
    res.json({ message: 'Pronunciation exercise deleted successfully' });
  } catch (err) {
    console.error('Error in DELETE /pronunciation/:id:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
