const taskService = require('../services/taskService');

class TaskController {
  async getTasks(req, res) {
    try {
      const tasks = await taskService.getAllTasks();
      return res.status(200).json({ data: tasks });
    } catch (err) {
      return res.status(500).json({
        error: 'Ocurrió un error interno al recuperar el listado de tareas.'
      });
    }
  }

  async createTask(req, res) {
    const { title } = req.body;

    // Validación de FORMATO (responsabilidad exclusiva de la Capa API)
    if (title === undefined || title === null || typeof title !== 'string') {
      return res.status(400).json({
        error: 'El campo "title" es obligatorio y debe ser una cadena de texto.',
        field: 'title'
      });
    }

    if (title.trim() === '') {
      return res.status(400).json({
        error: 'El título no puede estar vacío.',
        field: 'title'
      });
    }

    try {
      const createdTask = await taskService.createTask(title);
      return res.status(201).json({
        message: 'Tarea creada con éxito.',
        data: createdTask
      });
    } catch (err) {
      const status = err.statusCode || 500;
      return res.status(status).json({
        error: err.message,
        field: err.field || null
      });
    }
  }

  async toggleStatus(req, res) {
    const { id } = req.params;

    if (isNaN(Number(id))) {
      return res.status(400).json({
        error: 'El identificador de la tarea debe ser un valor numérico.',
        field: 'id'
      });
    }

    try {
      const updatedTask = await taskService.toggleTaskStatus(id);
      return res.status(200).json({
        message: 'Estado de tarea actualizado con éxito.',
        data: updatedTask
      });
    } catch (err) {
      return res.status(err.statusCode || 500).json({
        error: err.message
      });
    }
  }

  async deleteTask(req, res) {
    const { id } = req.params;

    if (isNaN(Number(id))) {
      return res.status(400).json({
        error: 'El identificador debe ser numérico.',
        field: 'id'
      });
    }

    try {
      await taskService.removeTask(id);
      return res.status(200).json({
        message: 'Tarea eliminada exitosamente.'
      });
    } catch (err) {
      return res.status(err.statusCode || 500).json({
        error: err.message
      });
    }
  }
}

module.exports = new TaskController();
