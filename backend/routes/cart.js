const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const filePath = path.join(__dirname, '..', 'data', 'cart.json');

// อ่าน cart จากไฟล์
function readCart() {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return content ? JSON.parse(content) : [];
  } catch (err) {
    return [];
  }
}

// เขียน cart ลงไฟล์
function writeCart(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// ✅ ดึงสินค้าทั้งหมดในตะกร้าของ user
router.get('/', (req, res) => {
  const username = req.query.username;
  if (!username) {
    return res.status(400).json({ error: 'โปรดล็อคอิน' });
  }

  const cart = readCart();
  const userCart = cart.filter(p => p.username === username);
  res.json(userCart);
});

// ✅ ดึงสินค้ารายการเดียวตาม id และ username
router.get('/:id', (req, res) => {
  const id = req.params.id;
  const username = req.query.username;
  if (!username) {
    return res.status(400).json({ error: 'โปรดล็อคอิน' });
  }

  const cart = readCart();
  const item = cart.find(p => p.id == id && p.username === username);
  if (!item) return res.status(404).json({ error: 'ไม่พบสินค้าในตะกร้า' });
  res.json(item);
});

// ✅ เพิ่มสินค้าลงตะกร้า
router.post('/', (req, res) => {
  const cart = readCart();
  const newItem = req.body;

  if (
    !newItem.username ||
    !newItem.id ||
    !newItem.productname ||
    typeof newItem.priceSelect !== 'number' ||
    typeof newItem.quantity !== 'number' ||
    !newItem.option
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

// ✅ แก้ไขจำนวนสินค้า
router.put('/:id', (req, res) => {
  router.put('/:id', (req, res) => {
  const id = req.params.id;
  const currentusername = req.query.username;
  const oldOption = req.query.option; 

  const {
    quantity,
    option,
    priceSelect,
    productname,
    newUsername
  } = req.body;

  if (!currentusername || !oldOption) {
    return res.status(400).json({ error: 'โปรดล็อคอิน หรือระบุ option เดิม' });
  }

  const cart = readCart();
  const index = cart.findIndex(item =>
    item.id == id &&
    item.currentusername === currentusername &&
    item.option === oldOption
  );

  if (index === -1) {
    return res.status(404).json({ error: 'ไม่พบสินค้าในตะกร้า' });
  }

  // ตรวจสอบว่ามีรายการซ้ำในตะกร้าของผู้ใช้ใหม่หรือไม่
  const newUser = newUsername || currentusername;
  const existingIndex = cart.findIndex(item =>
    item.id == id &&
    item.currentusername === newUser &&
    item.option === option &&
    item.option !== oldOption
  );

  if (existingIndex !== -1) {
    // รวมจำนวนสินค้าเข้าไปในรายการที่มีอยู่
    cart[existingIndex].quantity += quantity;
    cart.splice(index, 1); // ลบของเดิมออก
  } else {
    // อัปเดตข้อมูลรายการ
    cart[index].quantity = quantity;
    if (option) cart[index].option = option;
    if (priceSelect !== undefined) cart[index].priceSelect = priceSelect;
    if (productname) cart[index].productname = productname;
    if (newUsername) cart[index].currentusername = newUsername;
  }

  writeCart(cart);
  res.json({ message: 'แก้ไขสินค้าสำเร็จ', cart });
});

});



router.delete('/:id', (req, res) => {
  const id = req.params.id;
  const username = req.query.username;
  const option = req.query.option;
  if (!username) {
    return res.status(400).json({ error: 'โปรดล็อคอิน' });
  }

  let cart = readCart();
  const item = cart.find(p => p.id == id && p.username === username && p.option === option);
  if (!item) return res.status(404).json({ error: 'ไม่พบสินค้าในตะกร้า' });

  cart = cart.filter(p => !(p.id === id && p.username === username && p.option === option));
  writeCart(cart);
  res.json({ message: 'ลบสินค้าสำเร็จ' });
});

// ✅ ล้างตะกร้าทั้งหมดของผู้ใช้
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
