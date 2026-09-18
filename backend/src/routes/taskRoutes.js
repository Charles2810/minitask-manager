const { Router } = require('express');
const taskController = require('../controllers/taskController');

const router = Router();

router.get('/tasks', (req, res) => taskController.getTasks(req, res));
router.post('/tasks', (req, res) => taskController.createTask(req, res));
router.patch('/tasks/:id/toggle', (req, res) => taskController.toggleStatus(req, res));
router.delete('/tasks/:id', (req, res) => taskController.deleteTask(req, res));

module.exports = router;
