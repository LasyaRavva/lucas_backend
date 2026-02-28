const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// POST /api/progress/complete
router.post('/progress/complete', async (req, res) => {
  const { userId, type, itemId } = req.body;
  if (!userId || !type) return res.status(400).json({ error: 'userId and type are required' });

  // XP values per activity type
  const xpMap = { lesson: 50, flashcard: 5, quiz: 20 };
  const xpEarned = xpMap[type] || 0;

  // Fetch user profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('xp, streak, last_active, progress, id')
    .eq('id', userId)
    .single();
  if (profileError) return res.status(400).json({ error: profileError.message });

  // Calculate streak
  const today = new Date().toISOString().slice(0, 10);
  let newStreak = profile.streak || 0;
  if (!profile.last_active || profile.last_active !== today) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    if (profile.last_active === yesterday) {
      newStreak += 1;
    } else {
      newStreak = 1;
    }
  }

  // Calculate new XP
  const newXp = (profile.xp || 0) + xpEarned;

  // Calculate progress (dummy: +2% per lesson, +0.5% per flashcard, +1% per quiz)
  let newProgress = profile.progress || 0;
  if (type === 'lesson') newProgress += 2;
  if (type === 'flashcard') newProgress += 0.5;
  if (type === 'quiz') newProgress += 1;
  if (newProgress > 100) newProgress = 100;

  // Update profile
  const { data, error } = await supabase
    .from('profiles')
    .update({ xp: newXp, streak: newStreak, last_active: today, progress: newProgress })
    .eq('id', userId)
    .select('xp, streak, last_active, progress')
    .single();
  if (error) return res.status(400).json({ error: error.message });

  res.json(data);
});
// GET /api/auth/progress/:id
router.get('/progress/:id', async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: 'User ID required' });
  const { data, error } = await supabase
    .from('profiles')
    .select('xp, streak, last_active, progress')
    .eq('id', id)
    .single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// PUT /api/auth/progress/:id
router.put('/progress/:id', async (req, res) => {
  const { id } = req.params;
  const { xp, streak, last_active, progress } = req.body;
  if (!id) return res.status(400).json({ error: 'User ID required' });
  const { data, error } = await supabase
    .from('profiles')
    .update({ xp, streak, last_active, progress })
    .eq('id', id)
    .select('xp, streak, last_active, progress')
    .single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { email, password, fullName } = req.body;
  // Create user in Supabase Auth and force email confirmation
  const { data, error } = await supabase.auth.admin.createUser({ email, password, email_confirm: true });
  if (error) {
    console.error('Supabase Auth Error:', error);
    return res.status(400).json({ error: error.message });
  }
  const user = data.user;
  // Insert into profiles table
  if (user && user.id) {
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({ id: user.id, full_name: fullName })
    if (profileError) {
      console.error('Profile Insert Error:', profileError);
      return res.status(400).json({ error: profileError.message });
    }
  }
  res.json({ user });
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    console.error('Supabase Login Error:', error, 'Request body:', req.body);
    return res.status(400).json({ error: error.message });
  }
  res.json({ session: data.session, user: data.user });
})

// GET /api/auth/profile
router.get('/profile', async (req, res) => {
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'User ID required' });
  const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// PUT /api/auth/profile
router.put('/profile', async (req, res) => {
  const { id, fullName, learningLanguage, level } = req.body;
  if (!id) return res.status(400).json({ error: 'User ID required' });
  const { data, error } = await supabase
    .from('profiles')
    .update({ full_name: fullName, learning_language: learningLanguage, level })
    .eq('id', id)
    .select()
    .single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

module.exports = router
