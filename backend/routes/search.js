const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// GET /api/search?query=xxx
router.get('/', (req, res) => {
  const query = req.query.query?.toLowerCase() || '';

  const filePath = path.join(__dirname, '../data/allProduct.json');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading allProduct.json:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    const all = JSON.parse(data);
    const allNames = all.products || [];

    const result = allNames.filter(name => name.toLowerCase().includes(query));

    res.json(result);
  });
});

module.exports = router;
