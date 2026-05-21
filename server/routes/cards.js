const express = require('express');
const router = express.Router();
const db = require('../db');
const { updateCard } = require('../sm2');

router.get('/decks/:deckId/cards', (req, res) => {
  try {
    const cards = db.prepare('SELECT * FROM cards WHERE deck_id = ?').all(req.params.deckId);
    res.json(cards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/decks/:deckId/cards', (req, res) => {
  try {
    const { front, back } = req.body;
    const result = db.prepare('INSERT INTO cards (deck_id, front, back) VALUES (?, ?, ?)').run(req.params.deckId, front, back);
    const newCard = db.prepare('SELECT * FROM cards WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(newCard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/cards/:id', (req, res) => {
  try {
    const { front, back } = req.body;
    db.prepare('UPDATE cards SET front = ?, back = ? WHERE id = ?').run(front, back, req.params.id);
    const updatedCard = db.prepare('SELECT * FROM cards WHERE id = ?').get(req.params.id);
    if (!updatedCard) return res.status(404).json({ error: 'Card not found' });
    res.json(updatedCard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/cards/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM cards WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/decks/:deckId/study', (req, res) => {
  try {
    const cards = db.prepare(`
      SELECT * FROM cards 
      WHERE deck_id = ? 
      AND datetime(next_review) <= datetime('now') 
      ORDER BY next_review ASC 
      LIMIT 20
    `).all(req.params.deckId);
    res.json(cards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/cards/:id/review', (req, res) => {
  try {
    const { quality } = req.body;
    const card = db.prepare('SELECT * FROM cards WHERE id = ?').get(req.params.id);
    
    if (!card) return res.status(404).json({ error: 'Card not found' });
    if (quality < 0 || quality > 5) return res.status(400).json({ error: 'Quality must be between 0 and 5' });

    const updatedStats = updateCard(card, quality);
    const last_reviewed = new Date().toISOString();

    db.prepare(`
      UPDATE cards 
      SET interval = ?, ease_factor = ?, repetitions = ?, next_review = ?, last_reviewed = ?
      WHERE id = ?
    `).run(
      updatedStats.interval, 
      updatedStats.ease_factor, 
      updatedStats.repetitions, 
      updatedStats.next_review, 
      last_reviewed, 
      req.params.id
    );

    const updatedCard = db.prepare('SELECT * FROM cards WHERE id = ?').get(req.params.id);
    res.json(updatedCard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/stats', (req, res) => {
  try {
    const total_decks = db.prepare('SELECT COUNT(*) as count FROM decks').get().count;
    const total_cards = db.prepare('SELECT COUNT(*) as count FROM cards').get().count;
    const due_today = db.prepare("SELECT COUNT(*) as count FROM cards WHERE datetime(next_review) <= datetime('now')").get().count;
    const reviewed_today = db.prepare("SELECT COUNT(*) as count FROM cards WHERE date(last_reviewed) = date('now')").get().count;
    
    const dates = db.prepare("SELECT DISTINCT date(last_reviewed) as review_date FROM cards WHERE last_reviewed IS NOT NULL ORDER BY review_date DESC").all();
    
    let streak = 0;
    let checkDate = new Date();
    const getSqliteDate = (d) => d.toISOString().split('T')[0];
    
    let dateStr = getSqliteDate(checkDate);
    if (dates.some(d => d.review_date === dateStr)) {
        streak++;
        while(true) {
            checkDate.setUTCDate(checkDate.getUTCDate() - 1);
            if (dates.some(d => d.review_date === getSqliteDate(checkDate))) {
                streak++;
            } else {
                break;
            }
        }
    } else {
        checkDate.setUTCDate(checkDate.getUTCDate() - 1);
        if (dates.some(d => d.review_date === getSqliteDate(checkDate))) {
            streak++;
            while(true) {
                checkDate.setUTCDate(checkDate.getUTCDate() - 1);
                if (dates.some(d => d.review_date === getSqliteDate(checkDate))) {
                    streak++;
                } else {
                    break;
                }
            }
        }
    }

    res.json({ total_decks, total_cards, due_today, reviewed_today, streak });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
