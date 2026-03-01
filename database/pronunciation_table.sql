-- SQL Query to create pronunciation table in Supabase
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS pronunciation (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_id UUID REFERENCES lesson(id),
  language VARCHAR(50) NOT NULL,
  text VARCHAR(500) NOT NULL,
  phonetic VARCHAR(500),
  difficulty VARCHAR(20) DEFAULT 'beginner',
  audio_url TEXT,
  tips TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample pronunciation exercises
INSERT INTO pronunciation (language, text, phonetic, difficulty, tips) VALUES
('Spanish', '¡Hola! ¿Cómo estás?', 'oh-lah koh-moh es-tahs', 'beginner', 'Emphasize the rolled "r" in "cómo"'),
('Spanish', 'Buenos días', 'bweh-nohs dee-ahs', 'beginner', 'The "b" is soft, almost like a "v"'),
('Spanish', 'Mucho gusto', 'moo-choh goos-toh', 'beginner', 'Pronounce each syllable clearly'),
('Spanish', 'Por favor', 'pohr fah-vohr', 'beginner', 'Roll the "r" sounds'),
('Spanish', 'Me llamo...', 'meh yah-moh', 'beginner', 'The "ll" sounds like "y" in yes'),

('French', 'Bonjour', 'bon-zhoor', 'beginner', 'The "j" is soft like "zh" in pleasure'),
('French', 'Comment allez-vous?', 'koh-mahn tah-lay voo', 'beginner', 'Silent "t" at the end of comment'),
('French', 'Merci beaucoup', 'mehr-see boh-koo', 'beginner', 'Silent "p" at the end'),
('French', 'S''il vous plaît', 'seel voo pleh', 'beginner', 'Nasal sound for "plaît"'),
('French', 'Enchanté', 'ahn-shahn-tay', 'beginner', 'Nasal "en" sound'),

('German', 'Guten Tag', 'goo-ten tahk', 'beginner', 'Hard "g" sound at the start'),
('German', 'Wie geht es Ihnen?', 'vee gayt es ee-nen', 'beginner', 'The "w" sounds like "v"'),
('German', 'Danke schön', 'dahn-kuh shurn', 'beginner', 'The "ö" is rounded lips with "e" sound'),
('German', 'Auf Wiedersehen', 'owf vee-der-zay-en', 'beginner', 'Strong "f" in "Auf"'),
('German', 'Ich heiße...', 'ikhhy-seh', 'beginner', 'Guttural "ch" sound from the throat'),

('Italian', 'Ciao', 'chow', 'beginner', 'Quick and light pronunciation'),
('Italian', 'Come stai?', 'koh-meh stah-ee', 'beginner', 'Roll the "r" in conversation'),
('Italian', 'Grazie', 'graht-see-eh', 'beginner', 'Rolling "r" and soft "z"'),
('Italian', 'Per favore', 'pehr fah-voh-reh', 'beginner', 'Clear vowel sounds'),
('Italian', 'Mi chiamo...', 'mee kyah-moh', 'beginner', 'The "ch" sounds like "k"');

-- Create index for faster queries
CREATE INDEX idx_pronunciation_language ON pronunciation(language);
CREATE INDEX idx_pronunciation_difficulty ON pronunciation(difficulty);
