const Task = require('../models/Task');

// Create a new task
exports.createTask = async (req, res) => {
  try {
    const task = new Task({ ...req.body, owner: req.user._id });
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send({ error: 'Failed to create task', details: e.message });
  }
};

// Get all tasks (with optional filtering)
exports.getTasks = async (req, res) => {
  const match = {};
  if (req.query.status) {
    match.status = req.query.status;
  }
  if (req.query.priority) {
    match.priority = req.query.priority;
  }

  try {
    const tasks = await Task.find().populate('owner', 'name').sort({ createdAt: -1 });   
    res.send(tasks);
  } catch (e) {
    res.status(500).send({ error: 'Failed to fetch tasks' });
  }
};

// Get task by ID
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });
    if (!task) {
      return res.status(404).send({ message: 'Task not found' });
    }
    res.send(task);
  } catch (e) {
    res.status(500).send({ error: 'Server error' });
  }
};

// Update task by ID (PUT = full update)
exports.updateTask = async (req, res) => {
  const allowedUpdates = ['title', 'description', 'dueDate', 'priority', 'status'];
  const updates = Object.keys(req.body);
  const isValid = updates.every((field) => allowedUpdates.includes(field));

  if (!isValid) {
    return res.status(400).send({ error: 'Invalid fields in update' });
  }

  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!task) {
      return res.status(404).send({ message: 'Task not found' });
    }
    res.send(task);
  } catch (e) {
    res.status(400).send({ error: 'Failed to update task', details: e.message });
  }
};

// Delete task by ID
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!task) {
      return res.status(404).send({ message: 'Task not found' });
    }
    res.send({ message: 'Task deleted', task });
  } catch (e) {
    res.status(500).send({ error: 'Failed to delete task' });
  }
};
