const express = require('express');
const Progress = require('../models/Progress');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Get user progress for a language
router.get('/:language', authenticate, async (req, res) => {
  try {
    const { language } = req.params;
    const progress = await Progress.getProgress(req.user.id, language);
    
    if (!progress) {
      // Create progress if it doesn't exist
      const newProgress = await Progress.getOrCreate(req.user.id, language);
      return res.json({
        success: true,
        progress: {
          ...newProgress,
          total_score: 0,
          total_xp: 0,
          completed_tasks_count: 0,
          current_level: 1
        }
      });
    }

    res.json({
      success: true,
      progress
    });
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get all progress for user
router.get('/', authenticate, async (req, res) => {
  try {
    const pool = require('../models/database');
    const query = `
      SELECT * FROM user_progress 
      WHERE user_id = $1
      ORDER BY language
    `;
    const result = await pool.query(query, [req.user.id]);
    
    res.json({
      success: true,
      progress: result.rows
    });
  } catch (error) {
    console.error('Error fetching all progress:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get task submissions
router.get('/tasks/:taskId/submissions', authenticate, async (req, res) => {
  try {
    const { taskId } = req.params;
    const submissions = await Progress.getTaskSubmissions(req.user.id, taskId);
    
    res.json({
      success: true,
      submissions
    });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;

