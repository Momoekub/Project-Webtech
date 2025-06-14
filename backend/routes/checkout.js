const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const cartFile = path.join(__dirname, '..', 'data', 'cart.json');
const orderFile = path.join(__dirname, '..', 'data', 'order.json');

function readCart() {
  try {
    const content = fs.readFileSync(cartFile, 'utf8');
    return content ? JSON.parse(content) : [];
  } catch (err) {
    return [];
  }
}

function writeCart(data) {
  fs.writeFileSync(cartFile, JSON.stringify(data, null, 2));
}

function readOrders() {
  try {
    const content = fs.readFileSync(orderFile, 'utf8');
    return content ? JSON.parse(content) : [];
  } catch (err) {
    return [];
  }
}

function writeOrders(data) {
  fs.writeFileSync(orderFile, JSON.stringify(data, null, 2));
}

router.post('/', (req, res) => {
  const { username, shipping } = req.body;

  if (!username || !shipping) {
    return res.status(400).json({ error: 'กรุณาระบุ username และข้อมูลการจัดส่ง' });
  }

  const cart = readCart();
  const orders = readOrders();

  const userCart = cart.filter(item => item.username === username);

  if (userCart.length === 0) {
    return res.status(400).json({ error: 'ไม่มีสินค้าในตะกร้า' });
  }

  const newOrder = {
    id: Date.now().toString(),
    username,
    items: userCart,
    status: 'รอตรวจสอบ',
    shipping,
    createdAt: new Date().toISOString()
  };

  orders.push(newOrder);
  writeOrders(orders);

  const newCart = cart.filter(item => item.username !== username);
  writeCart(newCart);

  res.json({ message: 'สั่งซื้อสำเร็จ', order: newOrder });
});

router.get('/', (req, res) => {
  const { username } = req.query;
  const orders = readOrders();

  if (username) {
    const filtered = orders.filter(order => order.username === username);
    return res.json(filtered);
  }

  res.json(orders);
});

module.exports = router;
