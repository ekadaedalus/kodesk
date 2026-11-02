const express = require('express');
const Task = require('../models/Task');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Get all tasks for a language
router.get('/language/:language', authenticate, async (req, res) => {
  try {
    const { language } = req.params;
    const tasks = await Task.getUnlockedTasks(req.user.id, language);

    // Strip solution_code from list responses to prevent answer leaks
    const safeTasks = tasks.map(({ solution_code, ...task }) => task);

    res.json({
      success: true,
      tasks: safeTasks
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get single task by ID
router.get('/:taskId', authenticate, async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findById(taskId);
    
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // Don't send solution code to students
    if (req.user.role !== 'admin') {
      delete task.solution_code;
    }

    res.json({
      success: true,
      task
    });
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Create new task (admin only)
router.post('/', authenticate, authorize('admin'), async (req, res) => {
  try {
    const taskData = req.body;
    const task = await Task.create(taskData);
    
    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task
    });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update task (admin only)
router.put('/:taskId', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { taskId } = req.params;
    const updates = req.body;
    
    const task = await Task.update(taskId, updates);
    
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    res.json({
      success: true,
      message: 'Task updated successfully',
      task
    });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;

