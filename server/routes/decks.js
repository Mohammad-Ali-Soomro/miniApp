const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  try {
    const decks = db.prepare(`
      SELECT decks.*, 
             COUNT(cards.id) as card_count,
             SUM(CASE WHEN datetime(cards.next_review) <= datetime('now') THEN 1 ELSE 0 END) as due_count
      FROM decks 
      LEFT JOIN cards ON decks.id = cards.deck_id 
      GROUP BY decks.id
    `).all();
    res.json(decks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', (req, res) => {
  try {
    const { name, description } = req.body;
    const result = db.prepare('INSERT INTO decks (name, description) VALUES (?, ?)').run(name, description);
    const newDeck = db.prepare('SELECT * FROM decks WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(newDeck);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', (req, res) => {
  try {
    const { name, description } = req.body;
    db.prepare('UPDATE decks SET name = ?, description = ? WHERE id = ?').run(name, description, req.params.id);
    const updatedDeck = db.prepare('SELECT * FROM decks WHERE id = ?').get(req.params.id);
    if (!updatedDeck) return res.status(404).json({ error: 'Deck not found' });
    res.json(updatedDeck);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM decks WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
