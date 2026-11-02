const express = require('express');
const path = require('path');
const { authenticate } = require('../middleware/auth');
const pool = require('../models/database');

const router = express.Router();

const GAME_CATALOG = [
  {
    id: 'g-01',
    slug: '1024-moves',
    title: '1024 Moves',
    description: 'Slide and plan every move to reach the target tile.',
    required_level: 1,
    root_dir: '../../games/1024-moves',
    entry_file: 'index.html'
  },
  {
    id: 'g-02',
    slug: 'back-attacker',
    title: 'Back Attacker',
    description: 'React quickly and strike from the right timing windows.',
    required_level: 2,
    root_dir: '../../games/back-attacker',
    entry_file: 'index.html'
  },
  {
    id: 'g-03',
    slug: 'hare-y-situation',
    title: 'Hare-y Situation',
    description: 'Fast bunny rescue chaos with explosive hazards.',
    required_level: 3,
    root_dir: '../../games/Hare-y-Situation',
    entry_file: 'index.html'
  },
  {
    id: 'g-04',
    slug: 'play-back',
    title: 'Play Back',
    description: 'Replay-focused challenge with fast decision timing.',
    required_level: 4,
    root_dir: '../../games/play-back',
    entry_file: 'index.html'
  },
  {
    id: 'g-05',
    slug: 'push-back',
    title: 'Push Back',
    description: 'Physics and timing challenge with layered obstacles.',
    required_level: 5,
    root_dir: '../../games/push-back/dist',
    entry_file: 'index.html'
  },
  {
    id: 'g-06',
    slug: 'snake',
    title: 'Snake',
    description: 'Classic snake gameplay with precision movement.',
    required_level: 6,
    root_dir: '../../games/snake',
    entry_file: 'index.html'
  },
  {
    id: 'g-07',
    slug: 'spacecraft',
    title: 'Spacecraft',
    description: 'Pilot control challenge through a reactive scene.',
    required_level: 7,
    root_dir: '../../games/spacecraft',
    entry_file: 'index.html'
  },
  {
    id: 'g-08',
    slug: 'swagshot',
    title: 'Swagshot',
    description: 'Quick-reflex score chaser with shot accuracy focus.',
    required_level: 8,
    root_dir: '../../games/Swagshot',
    entry_file: 'index.html'
  },
  {
    id: 'g-09',
    slug: 'tilting-maze',
    title: 'Tilting Maze',
    description: 'Tilt, balance, and route through maze pathways.',
    required_level: 9,
    root_dir: '../../games/Tilting Maze Game',
    entry_file: 'index.html'
  }
];

const GAME_MAP = Object.fromEntries(GAME_CATALOG.map((game) => [game.slug, game]));

async function getCompletedLevels(userId) {
  const query = `
    SELECT DISTINCT t.level_number
    FROM user_task_progress utp
    JOIN tasks t ON t.id = utp.task_id
    WHERE utp.user_id = $1 AND utp.status = 'completed'
    ORDER BY t.level_number
  `;
  const result = await pool.query(query, [userId]);
  return new Set(result.rows.map((row) => row.level_number));
}

// Get games catalog with unlock state by completed quest levels (1..10)
router.get('/catalog', authenticate, async (req, res) => {
  try {
    const completedLevels = await getCompletedLevels(req.user.id);

    const games = GAME_CATALOG.map((game) => {
      const unlocked = completedLevels.has(game.required_level);
      return {
        id: game.id,
        slug: game.slug,
        title: game.title,
        description: game.description,
        required_level: game.required_level,
        unlocked,
        play_url: `/api/games/play/${game.slug}/`
      };
    });

    res.json({
      success: true,
      completedLevels: Array.from(completedLevels),
      games
    });
  } catch (error) {
    console.error('Error building game catalog:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Backward-compatible alias for old frontend endpoint
router.get('/unlocked', authenticate, async (req, res) => {
  try {
    const completedLevels = await getCompletedLevels(req.user.id);

    const games = GAME_CATALOG.map((game) => ({
      id: game.id,
      slug: game.slug,
      title: game.title,
      description: game.description,
      level_number: game.required_level,
      unlocked: completedLevels.has(game.required_level),
      play_url: `/api/games/play/${game.slug}/`
    }));
    res.json({ success: true, games });
  } catch (error) {
    console.error('Error fetching unlocked games:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

function resolveGameFile(slug, requestedPath) {
  const game = GAME_MAP[slug];
  if (!game) return null;
  const baseDir = path.resolve(__dirname, game.root_dir);
  const normalized = path.normalize(requestedPath || game.entry_file).replace(/^(\.\.(\/|\\|$))+/, '');
  const resolvedPath = path.resolve(baseDir, normalized);
  if (!resolvedPath.startsWith(baseDir)) return null;
  return resolvedPath;
}

// Serve game entry file
router.get('/play/:slug', (req, res) => {
  const filePath = resolveGameFile(req.params.slug, null);
  if (!filePath) {
    return res.status(404).send('Game not found');
  }
  return res.sendFile(filePath);
});

// Serve game assets
router.get('/play/:slug/*', (req, res) => {
  const assetPath = req.params[0];
  const filePath = resolveGameFile(req.params.slug, assetPath);
  if (!filePath) {
    return res.status(404).send('Asset not found');
  }
  return res.sendFile(filePath);
});

router.post('/:gameId/complete', authenticate, async (req, res) => {
  try {
    const { gameId } = req.params;
    const { score, timeSpent } = req.body;

    // Record game completion
    const query = `
      INSERT INTO user_game_progress (user_id, game_id, score, time_spent, completed_at)
      VALUES ($1, $2, $3, $4, NOW())
      ON CONFLICT (user_id, game_id) 
      DO UPDATE SET 
        score = GREATEST(user_game_progress.score, $3),
        time_spent = $4,
        completed_at = NOW()
      RETURNING *
    `;
    
    const result = await pool.query(query, [req.user.id, gameId, score || 0, timeSpent || 0]);
    
    res.json({
      success: true,
      message: 'Game completion recorded',
      gameProgress: result.rows[0]
    });
  } catch (error) {
    console.error('Error recording game completion:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/arcade/score', authenticate, async (req, res) => {
  try {
    const { gameId, score } = req.body;

    if (!gameId || score === undefined) {
      return res.status(400).json({
        success: false,
        message: 'gameId and score are required',
      });
    }

    // Store arcade scores in a simple format
    // Try to use existing table, fall back gracefully
    try {
      const query = `
        INSERT INTO user_arcade_scores (user_id, game_id, score, played_at)
        VALUES ($1, $2, $3, NOW())
        RETURNING *
      `;
      const result = await pool.query(query, [req.user.id, gameId, score]);
      res.json({
        success: true,
        message: 'Arcade score recorded',
        scoreRecord: result.rows[0],
      });
    } catch (dbError) {
      // Table may not exist yet - still return success to not break frontend
      console.log('Arcade scores table not available, score not persisted');
      res.json({
        success: true,
        message: 'Score acknowledged (not persisted - table not set up)',
        score,
      });
    }
  } catch (error) {
    console.error('Error recording arcade score:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;

