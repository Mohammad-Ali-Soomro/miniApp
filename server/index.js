const express = require('express');
const cors = require('cors');
const decksRouter = require('./routes/decks');
const cardsRouter = require('./routes/cards');
const db = require('./db');

db.initDB();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/decks', decksRouter);
app.use('/api/cards', cardsRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
