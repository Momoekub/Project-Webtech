const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const ordersFile = path.join(__dirname, '..', 'data', 'order.json');

router.get('/', (req, res) => {
  if (!fs.existsSync(ordersFile)) {
    return res.status(404).json({ message: 'orders.json not found' });
  }
  const data = fs.readFileSync(ordersFile);
  res.json(JSON.parse(data));
});

module.exports = router; // ✅ สำคัญที่สุด ห้ามลืม!
