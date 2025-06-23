// routes/order.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const router = express.Router();

const cartFile = path.join(__dirname, '..', 'data', 'cart.json');
const orderFile = path.join(__dirname, '..', 'data', 'order.json');

// setup upload folder
const upload = multer({ dest: path.join(__dirname, '..', 'uploads') });

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

// POST /api/order
router.post('/', upload.single('slipFile'), (req, res) => {
  const {
    username, firstName, lastName, email,
    mobile, country,  city, address1,
    paymentMethod
  } = req.body;

  const slipFile = req.file;

  if (!username) {
    return res.status(400).json({ error: 'กรุณาระบุ username' });
  }

  const cart = readCart();
  const userCart = cart.filter(item => item.username === username);
  if (userCart.length === 0) {
    return res.status(400).json({ error: 'ไม่มีสินค้าในตะกร้า' });
  }

  const newOrder = {
    id: Date.now().toString(),//สร้างไอดีจากเวลา
    username,
    items: userCart,
    status: 'รอตรวจสอบ',
    shipping: {
      firstName, lastName, email, mobile, country, city, address1
    },
    paymentMethod,
    paymentDetails: {
      slipFilename: slipFile ? slipFile.filename : null,
      originalName: slipFile ? slipFile.originalname : null
    },
    createdAt: new Date().toISOString()
  };

  const orders = readOrders();
  orders.push(newOrder);
  writeOrders(orders);

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
