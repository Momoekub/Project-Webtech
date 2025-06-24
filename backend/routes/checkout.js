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
  const {
    username, firstName, lastName, email,
    mobile, country, city, address1,
    paymentMethod
  } = req.body;

  if (!username) {
    return res.status(400).json({ error: 'โปรด login' });
  }

  const cart = readCart();
  const userCart = cart.filter(item => item.username === username);
  if (userCart.length === 0) {
    return res.status(400).json({ error: 'ไม่มีสินค้าในตะกร้า' });
  }

  // ต้องตรวจสอบหลังจากมี userCart แล้ว
  const isDigitalOrder = userCart.every(item =>
    item.category === 'Gift-Card' || item.category === 'Games'
  );

  // ตรวจสอบข้อมูลให้ครบตามประเภทสินค้า
  if (isDigitalOrder) {
    if (!email || !paymentMethod) {
      return res.status(400).json({ error: 'โปรดกรอกข้อมูลให้ครบ' });
    }
  } else {
    if (!firstName || !lastName || !email || !mobile || !country || !city || !address1 || !paymentMethod) {
      return res.status(400).json({ error: 'โปรดกรอกข้อมูลให้ครบ' });
    }
  }

  const shipping = isDigitalOrder
    ? { email }
    : { firstName, lastName, email, mobile, country, city, address1 };

  const newOrder = {
    id: Date.now().toString(),
    username,
    items: userCart,
    status: 'รอตรวจสอบ',
    shipping,
    paymentMethod,
    createdAt: new Date().toISOString()
  };

  const orders = readOrders();
  orders.push(newOrder);
  writeOrders(orders);

  // ล้างตะกร้าผู้ใช้
  const newCart = cart.filter(item => item.username !== username);
  writeCart(newCart);

  res.json({ message: 'สั่งซื้อสำเร็จ', order: newOrder });
});



// GET /api/order
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