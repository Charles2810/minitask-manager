const taskRepository = require('../repositories/taskRepository');

class TaskService {
  async getAllTasks() {
    return await taskRepository.findAll();
  }

  async createTask(rawTitle) {
    // 1. Normalización de datos (regla de negocio)
    const sanitizedTitle = rawTitle.trim().replace(/\s+/g, ' ');

    // 2. Regla de negocio: Longitud mínima y máxima de una tarea
    if (sanitizedTitle.length < 3) {
      const error = new Error('El título de la tarea debe tener al menos 3 caracteres significativos.');
      error.statusCode = 422; // Unprocessable Entity
      error.field = 'title';
      throw error;
    }

    // 3. Regla de negocio: Moderación de contenido / política interna
    const FORBIDDEN_WORDS = ['groseria', 'spam', 'invalido'];
    const hasForbiddenWord = FORBIDDEN_WORDS.some(word =>
      sanitizedTitle.toLowerCase().includes(word)
    );

    if (hasForbiddenWord) {
      const error = new Error('El título contiene términos no permitidos por la política de uso.');
      error.statusCode = 422;
      error.field = 'title';
      throw error;
    }

    // 4. Regla: Toda nueva tarea inicia siempre como 'pending'
    const newTaskData = {
      title: sanitizedTitle,
      status: 'pending'
    };

    return await taskRepository.create(newTaskData);
  }

  async toggleTaskStatus(id) {
    const existingTask = await taskRepository.findById(id);
    if (!existingTask) {
      const error = new Error(`No se encontró la tarea con identificador ${id}.`);
      error.statusCode = 404;
      throw error;
    }

    // Regla de transición de estado: pending <-> done
    const nextStatus = existingTask.status === 'pending' ? 'done' : 'pending';
    return await taskRepository.updateStatus(id, nextStatus);
  }

  async removeTask(id) {
    const existingTask = await taskRepository.findById(id);
    if (!existingTask) {
      const error = new Error(`No se encontró la tarea con identificador ${id}.`);
      error.statusCode = 404;
      throw error;
    }

    return await taskRepository.delete(id);
  }
}

module.exports = new TaskService();
