const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  try {
    const cards = db.prepare('SELECT * FROM cards').all();
    res.json(cards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
