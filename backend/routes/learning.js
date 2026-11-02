const express = require('express');
const router = express.Router();
const pool = require('../models/database');

// Get learning content for a language (public)
router.get('/:language', async (req, res) => {
  try {
    const { language } = req.params;
    const query = `
      SELECT id, topic, title, content, code_examples, order_index
      FROM learning_content
      WHERE language = $1
      ORDER BY COALESCE(order_index, 0), id
    `;

    const result = await pool.query(query, [language]);

    res.json({ success: true, content: result.rows });
  } catch (error) {
    console.error('Error fetching learning content:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;