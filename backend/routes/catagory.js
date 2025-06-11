const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const categoryMap = {
  games: 'Games.json',
  gear: 'Gaming-Gear.json',
  giftcard: 'Gift-Card.json',
  console: 'Console.json',
};

router.get('/', (req, res) => {
  const type = req.query.type;

  if (!type || !categoryMap[type]) {
    return res.status(400).json({ error: 'Invalid or missing category type' });
  }

  const filePath = path.join(__dirname, '..', 'data', categoryMap[type]);

  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return res.status(500).json({ error: 'Failed to load products' });
    }

    res.json(JSON.parse(data));
  });
});

module.exports = router;
