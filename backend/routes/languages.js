const express = require('express');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Supported languages
const SUPPORTED_LANGUAGES = [
  {
    id: 'cpp',
    name: 'C++',
    displayName: 'C++',
    description: 'Learn C++ programming with hands-on challenges',
    icon: '⚡'
  },
  {
    id: 'java',
    name: 'Java',
    displayName: 'Java',
    description: 'Master Java programming fundamentals',
    icon: '☕'
  },
  {
    id: 'python',
    name: 'Python',
    displayName: 'Python',
    description: 'Start your Python journey with interactive coding',
    icon: '🐍'
  }
];

// Get all supported languages
router.get('/', (req, res) => {
  res.json({
    success: true,
    languages: SUPPORTED_LANGUAGES
  });
});

// Get user's selected language (requires auth)
// IMPORTANT: Must be declared BEFORE /:languageId to avoid "user" being captured as a languageId
router.get('/user/selected', authenticate, async (req, res) => {
  try {
    const pool = require('../models/database');
    const query = `
      SELECT selected_language FROM user_settings
      WHERE user_id = $1
    `;
    const result = await pool.query(query, [req.user.id]);

    const selectedLanguage = result.rows[0]?.selected_language || null;

    res.json({
      success: true,
      selectedLanguage: selectedLanguage ?
        SUPPORTED_LANGUAGES.find(lang => lang.id === selectedLanguage) : null
    });
  } catch (error) {
    console.error('Error fetching selected language:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Set user's selected language (requires auth)
// IMPORTANT: Must be declared BEFORE /:languageId
router.post('/user/select', authenticate, async (req, res) => {
  try {
    const { languageId } = req.body;
    
    if (!SUPPORTED_LANGUAGES.find(lang => lang.id === languageId)) {
      return res.status(400).json({
        success: false,
        message: 'Language not supported'
      });
    }

    const pool = require('../models/database');
    const query = `
      INSERT INTO user_settings (user_id, selected_language, updated_at)
      VALUES ($1, $2, NOW())
      ON CONFLICT (user_id) 
      DO UPDATE SET selected_language = $2, updated_at = NOW()
      RETURNING selected_language
    `;
    
    const result = await pool.query(query, [req.user.id, languageId]);
    
    res.json({
      success: true,
      message: 'Language selected successfully',
      selectedLanguage: SUPPORTED_LANGUAGES.find(lang => lang.id === languageId)
    });
  } catch (error) {
    console.error('Error setting selected language:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get language details
// Declared AFTER /user/* routes so "user" isn't captured as a languageId
router.get('/:languageId', (req, res) => {
  const { languageId } = req.params;
  const language = SUPPORTED_LANGUAGES.find(lang => lang.id === languageId);

  if (!language) {
    return res.status(404).json({
      success: false,
      message: 'Language not supported'
    });
  }

  res.json({
    success: true,
    language
  });
});

module.exports = router;

