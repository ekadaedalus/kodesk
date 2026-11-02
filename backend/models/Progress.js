const pool = require('./database');

class Progress {
  static async getOrCreate(userId, language) {
    const query = `
      INSERT INTO user_progress (user_id, language, created_at)
      VALUES ($1, $2, NOW())
      ON CONFLICT (user_id, language) 
      DO UPDATE SET updated_at = NOW()
      RETURNING *
    `;
    
    const result = await pool.query(query, [userId, language]);
    return result.rows[0];
  }

  static async getProgress(userId, language) {
    const query = `
      SELECT * FROM user_progress 
      WHERE user_id = $1 AND language = $2
    `;
    const result = await pool.query(query, [userId, language]);
    return result.rows[0];
  }

  static async updateProgress(userId, language, updates) {
    const { total_score, total_xp, completed_tasks_count, current_level } = updates;
    
    const query = `
      UPDATE user_progress 
      SET 
        total_score = COALESCE($3, total_score),
        total_xp = COALESCE($4, total_xp),
        completed_tasks_count = COALESCE($5, completed_tasks_count),
        current_level = COALESCE($6, current_level),
        updated_at = NOW()
      WHERE user_id = $1 AND language = $2
      RETURNING *
    `;
    
    const result = await pool.query(query, [
      userId,
      language,
      total_score,
      total_xp,
      completed_tasks_count,
      current_level
    ]);
    
    return result.rows[0];
  }

  static async recordTaskCompletion(userId, taskId, language, score, xp) {
    // Check if this task was already completed (to avoid inflating totals)
    const existingQuery = `
      SELECT id, score AS old_score, xp_earned AS old_xp
      FROM user_task_progress
      WHERE user_id = $1 AND task_id = $2 AND status = 'completed'
    `;
    const existing = await pool.query(existingQuery, [userId, taskId]);
    const wasAlreadyCompleted = existing.rows.length > 0;
    const oldScore = existing.rows[0]?.old_score || 0;
    const oldXp = existing.rows[0]?.old_xp || 0;

    // Record/update task completion
    const taskQuery = `
      INSERT INTO user_task_progress (user_id, task_id, language, status, score, xp_earned, completed_at)
      VALUES ($1, $2, $3, 'completed', $4, $5, NOW())
      ON CONFLICT (user_id, task_id)
      DO UPDATE SET
        status = 'completed',
        score = GREATEST(user_task_progress.score, $4),
        xp_earned = GREATEST(user_task_progress.xp_earned, $5),
        completed_at = NOW()
      RETURNING *
    `;

    await pool.query(taskQuery, [userId, taskId, language, score, xp]);

    // Ensure progress row exists before updating
    const progress = await this.getOrCreate(userId, language);

    if (wasAlreadyCompleted) {
      // Only apply the delta (improvement over previous best)
      const scoreDelta = Math.max(0, score - oldScore);
      const xpDelta = Math.max(0, xp - oldXp);
      if (scoreDelta > 0 || xpDelta > 0) {
        await this.updateProgress(userId, language, {
          total_score: (progress.total_score || 0) + scoreDelta,
          total_xp: (progress.total_xp || 0) + xpDelta
        });
      }
    } else {
      // First completion - add full values and increment count
      await this.updateProgress(userId, language, {
        total_score: (progress.total_score || 0) + score,
        total_xp: (progress.total_xp || 0) + xp,
        completed_tasks_count: (progress.completed_tasks_count || 0) + 1
      });
    }
  }

  static async getTaskSubmissions(userId, taskId) {
    const query = `
      SELECT * FROM code_submissions 
      WHERE user_id = $1 AND task_id = $2 
      ORDER BY submitted_at DESC
    `;
    const result = await pool.query(query, [userId, taskId]);
    return result.rows;
  }

  static async saveSubmission(userId, taskId, language, code, verdict, output, errors) {
    const query = `
      INSERT INTO code_submissions (
        user_id, task_id, language, code, verdict, output, errors, submitted_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      RETURNING *
    `;
    
    const result = await pool.query(query, [
      userId,
      taskId,
      language,
      code,
      verdict,
      output,
      errors
    ]);
    
    return result.rows[0];
  }

  static async unlockGamesForTask(userId, taskId, language) {
    try {
      // Get games linked to this task
      const query = `
        SELECT g.* FROM games g
        JOIN game_tasks gt ON g.id = gt.game_id
        WHERE gt.task_id = $1
      `;
      
      const gamesResult = await pool.query(query, [taskId]);
      const games = gamesResult.rows;

      // Unlock each game by creating a record in user_game_progress
      for (const game of games) {
        const insertQuery = `
          INSERT INTO user_game_progress (user_id, game_id, created_at)
          VALUES ($1, $2, NOW())
          ON CONFLICT (user_id, game_id) DO NOTHING
          RETURNING *
        `;
        await pool.query(insertQuery, [userId, game.id]);
        console.log(`[DEBUG] Unlocked game ${game.id} for user ${userId}`);
      }

      return games;
    } catch (error) {
      console.error('[DEBUG] Error unlocking games:', error);
      return [];
    }
  }
}

module.exports = Progress;

