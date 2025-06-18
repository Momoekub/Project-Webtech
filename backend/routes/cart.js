const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const filePath = path.join(__dirname, '..', 'data', 'cart.json');

// อ่านข้อมูลตะกร้าจากไฟล์
function readCart() {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return content ? JSON.parse(content) : [];
  } catch (err) {
    return [];
  }
}

// เขียนข้อมูลตะกร้าลงไฟล์
function writeCart(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// ดึงสินค้าทั้งหมดในตะกร้าของผู้ใช้
router.get('/', (req, res) => {
  const username = req.query.username;
  if (!username) {
    return res.status(400).json({ error: 'โปรดล็อคอิน' });
  }
  const cart = readCart();
  const userCart = cart.filter(p => p.username === username);
  res.json(userCart);
});

// เปลี่ยนชื่อผู้ใช้ในตะกร้า
router.post('/change-username', (req, res) => {
  const { oldUsername, newUsername } = req.body;

  if (!oldUsername || !newUsername) {
    return res.status(400).json({ error: 'กรุณาระบุชื่อผู้ใช้เดิมและใหม่' });
  }

  const cart = readCart();
  let changed = false;

  cart.forEach(item => {
    if (item.username === oldUsername) {
      item.username = newUsername;
      changed = true;
    }
  });

  if (!changed) {
    return res.status(404).json({ error: 'ไม่พบรายการที่ใช้ชื่อผู้ใช้นี้' });
  }

  writeCart(cart);
  res.json({ message: 'เปลี่ยนชื่อผู้ใช้ในตะกร้าสำเร็จ' });
});

// ดึงสินค้ารายการเดียวตาม id, username และ option
router.get('/:id', (req, res) => {
  const id = req.params.id;
  const username = req.query.username;
  const option = req.query.option;

  if (!username || !option) {
    return res.status(400).json({ error: 'โปรดล็อคอิน และระบุ option' });
  }

  const cart = readCart();
  const item = cart.find(p => p.id == id && p.username === username && p.option === option);
  if (!item) return res.status(404).json({ error: 'ไม่พบสินค้าในตะกร้า' });
  res.json(item);
});

// เพิ่มสินค้าลงตะกร้า
router.post('/', (req, res) => {
  const cart = readCart();
  const newItem = req.body;

  if (
    !newItem.username ||
    !newItem.id ||
    !newItem.image ||
    !newItem.productname ||
    !newItem.price||
    !newItem.quantity||
    !newItem.option ||
    !newItem.category
  ) {
    return res.status(400).json({ error: 'เกิดข้อผิดพลาดในข้อมูล' });
  }

  const existing = cart.find(
    item =>
      item.username === newItem.username &&
      item.id == newItem.id &&
      item.option === newItem.option
  );

  if (existing) {
    existing.quantity += newItem.quantity;
  } else {
    cart.push(newItem);
  }

  writeCart(cart);
  res.json({ message: 'เพิ่มสินค้าสำเร็จ', product: newItem });
});

// แก้ไขจำนวนสินค้าในตะกร้า
router.put('/:id', (req, res) => {
  const id = req.params.id;
  const oldOption = req.query.option;
  const {
    quantity,
    option,
    price,
    productname,
    username,
    newUser // กรณีเปลี่ยนชื่อผู้ใช้ (ถ้ามี)
  } = req.body;

  if (!username || !oldOption) {
    return res.status(400).json({ error: 'โปรดล็อคอิน หรือระบุ option เดิม' });
  }

  const cart = readCart();

  // หา index รายการเดิม
  const index = cart.findIndex(item =>
    item.id == id &&
    item.username === username &&
    item.option === oldOption
  );

  if (index === -1) {
    return res.status(404).json({ error: 'ไม่พบสินค้าในตะกร้า' });
  }

  const targetUser = newUser || username;

  // ตรวจสอบรายการซ้ำในตะกร้าผู้ใช้ใหม่ (ยกเว้นรายการเดิม)
  const existingIndex = cart.findIndex(item =>
    item.id == id &&
    item.username === targetUser &&
    item.option === option &&
    !(item.username === username && item.option === oldOption)
  );

  if (existingIndex !== -1) {
    // รวมจำนวนสินค้า
    cart[existingIndex].quantity += quantity;
    cart.splice(index, 1); // ลบรายการเดิม
  } else {
    // อัปเดตข้อมูลรายการ
    cart[index].quantity = quantity;
    if (option) cart[index].option = option;
    if (price !== undefined) cart[index].price = price;
    if (productname) cart[index].productname = productname;
    if (newUser) cart[index].username = newUser;
  }

  writeCart(cart);
  res.json({ message: 'แก้ไขสินค้าสำเร็จ', cart });
});

// ลบสินค้าในตะกร้า
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  const username = req.query.username;
  const option = req.query.option;

  if (!username || !option) {
    return res.status(400).json({ error: 'โปรดล็อคอิน และระบุ option' });
  }

  let cart = readCart();
  const item = cart.find(p => p.id == id && p.username === username && p.option === option);
  if (!item) return res.status(404).json({ error: 'ไม่พบสินค้าในตะกร้า' });

  cart = cart.filter(p => !(p.id == id && p.username === username && p.option === option));
  writeCart(cart);
  res.json({ message: 'ลบสินค้าสำเร็จ' });
});

// ล้างตะกร้าทั้งหมดของผู้ใช้
router.delete('/', (req, res) => {
  const username = req.query.username;
  if (!username) {
    return res.status(400).json({ error: 'โปรดล็อคอิน' });
  }

  const cart = readCart();
  const newCart = cart.filter(item => item.username !== username);
  writeCart(newCart);
  res.json({ message: 'ล้างตะกร้าของคุณเรียบร้อยแล้ว' });
});

module.exports = router;
