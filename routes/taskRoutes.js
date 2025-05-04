const express = require('express');
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask
} = require('../controllers/taskController');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

// Authenticated task routes
router.post('/', auth, createTask);             // Create a new task
router.get('/', auth, getTasks);                // Get all tasks (with filters)
router.get('/:id', auth, getTaskById);         // Get a specific task
router.put('/:id', auth, updateTask);          // Update a task
router.delete('/:id', auth, deleteTask);       // Delete a task

module.exports = router;
