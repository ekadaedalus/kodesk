const pool = require('./database');

class Task {
  static async create(taskData) {
    const {
      title,
      description,
      language,
      difficulty_level,
      level_number,
      prerequisite_task_id,
      test_cases,
      starter_code,
      solution_code
    } = taskData;

    const query = `
      INSERT INTO tasks (
        title, description, language, difficulty_level, level_number,
        prerequisite_task_id, test_cases, starter_code, solution_code, created_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
      RETURNING *
    `;

    const result = await pool.query(query, [
      title,
      description,
      language,
      difficulty_level,
      level_number,
      prerequisite_task_id,
      JSON.stringify(test_cases),
      starter_code,
      solution_code
    ]);

    return result.rows[0];
  }

  static async findByLanguage(language) {
    // Use DISTINCT ON to avoid accidental duplicate rows per level_number
    const query = `
      SELECT DISTINCT ON (level_number) * FROM tasks
      WHERE language = $1
      ORDER BY level_number, id
    `;
    const result = await pool.query(query, [language]);
    return result.rows.map(row => ({
      ...row,
      test_cases: typeof row.test_cases === 'string' ? JSON.parse(row.test_cases) : row.test_cases
    }));
  }

  static async findById(id) {
    const query = 'SELECT * FROM tasks WHERE id = $1';
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) return null;
    
    const task = result.rows[0];
    task.test_cases = typeof task.test_cases === 'string' ? JSON.parse(task.test_cases) : task.test_cases;
    return task;
  }

  static async getUnlockedTasks(userId, language) {
    // Get all tasks for the language
    const allTasks = await this.findByLanguage(language);
    
    // Get user's completed tasks
    const completedQuery = `
      SELECT task_id FROM user_task_progress 
      WHERE user_id = $1 AND language = $2 AND status = 'completed'
    `;
    const completedResult = await pool.query(completedQuery, [userId, language]);
    const completedTaskIds = new Set(completedResult.rows.map(row => row.task_id));
    
    // Determine which tasks are unlocked
    return allTasks.map(task => {
      const isUnlocked = !task.prerequisite_task_id || 
                        completedTaskIds.has(task.prerequisite_task_id);
      return {
        ...task,
        is_unlocked: isUnlocked,
        is_completed: completedTaskIds.has(task.id)
      };
    });
  }

  static async update(id, updates) {
    const allowedFields = ['title', 'description', 'difficulty_level', 'test_cases', 'starter_code', 'solution_code'];
    const fields = Object.keys(updates).filter(key => allowedFields.includes(key));
    
    if (fields.length === 0) {
      throw new Error('No valid fields to update');
    }

    const setClause = fields.map((field, index) => {
      if (field === 'test_cases') {
        return `test_cases = $${index + 2}::jsonb`;
      }
      return `${field} = $${index + 2}`;
    }).join(', ');
    
    const values = fields.map(field => 
      field === 'test_cases' ? JSON.stringify(updates[field]) : updates[field]
    );
    
    const query = `
      UPDATE tasks 
      SET ${setClause}, updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `;
    
    const result = await pool.query(query, [id, ...values]);
    if (result.rows.length === 0) return null;
    
    const task = result.rows[0];
    task.test_cases = typeof task.test_cases === 'string' ? JSON.parse(task.test_cases) : task.test_cases;
    return task;
  }
}

module.exports = Task;

