const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const dataFiles = [
  'Games.json',
  'Gaming-Gear.json',
  'Console.json',
  'Gift-Card.json'
];

router.get('/', (req, res) => {
  const query = req.query.query?.toLowerCase() || '';
  const products = [];

  let filesRead = 0;
  let hasError = false;

  dataFiles.forEach((file) => {
    const filePath = path.join(__dirname, '../data', file);

    fs.readFile(filePath, 'utf8', (err, data) => {
      filesRead++;

      if (err) {
        console.error(`Error reading ${file}:`, err);
        if (!hasError) {
          hasError = true;
          return res.status(500).json({ error: 'Internal Server Error' });
        }
        return;
      }

      try {
        const parsed = JSON.parse(data);
        // กรณีเป็น array ตรง ๆ ไม่ห่อใน { products: [...] }
        if (Array.isArray(parsed)) {
          products.push(...parsed);
        } else if (Array.isArray(parsed.products)) {
          products.push(...parsed.products);
        }
      } catch (e) {
        console.error(`Error parsing ${file}:`, e);
      }

      if (filesRead === dataFiles.length && !hasError) {
        const results = products.filter(product =>
          product.name?.toLowerCase().includes(query)
        );

        const simplified = results.map(p => ({
          name: p.name,
          id: p.id,
          category: p.category
        }));

        res.json(simplified);
      }
    });
  });
});

module.exports = router;
