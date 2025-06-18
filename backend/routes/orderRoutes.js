const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const ordersFile = path.join(__dirname, '..', 'data', 'order.json');

// GET all orders
router.get('/', (req, res) => {
  if (!fs.existsSync(ordersFile)) {
    return res.status(404).json({ message: 'orders.json not found' });
  }
  const data = fs.readFileSync(ordersFile);
  res.json(JSON.parse(data));
});

// DELETE order by id
router.delete('/:id', (req, res) => {
  const id = req.params.id;

  if (!fs.existsSync(ordersFile)) {
    return res.status(404).json({ message: 'orders.json not found' });
  }

  const data = fs.readFileSync(ordersFile, 'utf-8');
  let orders = JSON.parse(data);

  // หา index ของ order ที่จะลบ
  const index = orders.findIndex(order => order.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Order not found' });
  }

  // ลบ order ออกจาก array
  orders.splice(index, 1);

  // เขียนไฟล์ทับอันเก่า
  fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2));

  res.json({ message: `Order ${id} deleted successfully.` });
});

module.exports = router;
