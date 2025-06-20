const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const filePath = path.join(__dirname, '..', 'data', 'newsletter.json');

// POST /api/newsletter
router.post('/', (req, res) => {
  const email = req.body.email;
  if (!email) return res.status(400).json({ error: 'Missing email' });

  const existing = fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath)) : [];
  existing.push({ email, date: new Date() });

  fs.writeFileSync(filePath, JSON.stringify(existing, null, 2));
  res.json({ message: 'Email saved successfully' });
});

module.exports = router;
