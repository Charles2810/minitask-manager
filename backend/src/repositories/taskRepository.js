const db = require('../config/db');

class TaskRepository {
  // Obtener todas las tareas ordenadas cronológicamente
  async findAll() {
    const query = `
      SELECT id, title, status, created_at, updated_at
      FROM tasks
      ORDER BY created_at DESC;
    `;
    const { rows } = await db.query(query);
    return rows;
  }

  // Buscar tarea por ID
  async findById(id) {
    const query = `
      SELECT id, title, status, created_at, updated_at
      FROM tasks
      WHERE id = $1;
    `;
    const { rows } = await db.query(query, [id]);
    return rows[0] || null;
  }

  // Crear tarea usando marcadores parametrizados seguros ($1, $2)
  async create({ title, status }) {
    const query = `
      INSERT INTO tasks (title, status)
      VALUES ($1, $2)
      RETURNING id, title, status, created_at, updated_at;
    `;
    const { rows } = await db.query(query, [title, status]);
    return rows[0];
  }

  // Actualizar el estado de una tarea
  async updateStatus(id, newStatus) {
    const query = `
      UPDATE tasks
      SET status = $1
      WHERE id = $2
      RETURNING id, title, status, created_at, updated_at;
    `;
    const { rows } = await db.query(query, [newStatus, id]);
    return rows[0] || null;
  }

  // Eliminar tarea físicamente
  async delete(id) {
    const query = `DELETE FROM tasks WHERE id = $1 RETURNING id;`;
    const { rows } = await db.query(query, [id]);
    return rows.length > 0;
  }
}

module.exports = new TaskRepository();
