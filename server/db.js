const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'spaced_out.db');
const db = new Database(dbPath, { verbose: console.log });

db.pragma('foreign_keys = ON');

function initDB() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS decks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );
    
    CREATE TABLE IF NOT EXISTS cards (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      deck_id INTEGER NOT NULL REFERENCES decks(id) ON DELETE CASCADE,
      front TEXT NOT NULL,
      back TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      next_review TEXT DEFAULT (datetime('now')),
      interval INTEGER DEFAULT 1,
      ease_factor REAL DEFAULT 2.5,
      repetitions INTEGER DEFAULT 0,
      last_reviewed TEXT
    );
  `);
}

module.exports = db;
module.exports.initDB = initDB;
