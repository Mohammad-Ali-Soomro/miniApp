const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  try {
    const decks = db.prepare('SELECT * FROM decks').all();
    res.json(decks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
