const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// ดึง path ของไฟล์ตาม category
function getFilePathByCategory(category) {
  return path.join(__dirname, '..', 'data', `${category}.json`);
}

// อ่านสินค้า
function readProducts(category) {
  const filePath = getFilePathByCategory(category);
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return content ? JSON.parse(content) : [];
  } catch (err) {
    return [];
  }
}

// เขียนสินค้า
function writeProducts(category, data) {
  const filePath = getFilePathByCategory(category);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// ดึงสินค้าทั้งหมดใน category
router.get('/:category', (req, res) => {
  const { category } = req.params;
  const data = readProducts(category);
  res.json(data);
});

// ดึงสินค้าตาม id และ category
router.get('/:category/:id', (req, res) => {
  const { category, id } = req.params;
  const data = readProducts(category);
  const product = data.find(p => p.id === parseInt(id));
  if (!product) return res.status(404).json({ error: 'ไม่พบสินค้า' });
  res.json(product);
});

// เพิ่มสินค้าใหม่
router.post('/:category', (req, res) => {
  const { category } = req.params;
  const data = readProducts(category);
  const newProduct = req.body;

  const maxId = data.length > 0 ? Math.max(...data.map(p => p.id)) : 0;
  newProduct.id = maxId + 1;

  data.push(newProduct);
  writeProducts(category, data);
  res.json({ message: 'เพิ่มสินค้าสำเร็จ', product: newProduct });
});

// แก้ไขสินค้า
router.put('/:category/:id', (req, res) => {
  const { category, id } = req.params;
  const data = readProducts(category);
  const index = data.findIndex(p => p.id === parseInt(id));

  if (index === -1) return res.status(404).json({ error: 'ไม่พบสินค้า' });

  data[index] = { ...data[index], ...req.body };
  writeProducts(category, data);
  res.json({ message: 'แก้ไขสินค้าสำเร็จ' });
});

// ลบสินค้า
router.delete('/:category/:id', (req, res) => {
  const { category, id } = req.params;
  let data = readProducts(category);
  const product = data.find(p => p.id === parseInt(id));

  if (!product) return res.status(404).json({ error: 'ไม่พบสินค้า' });

  data = data.filter(p => p.id !== parseInt(id));
  writeProducts(category, data);
  res.json({ message: 'ลบสินค้าสำเร็จ' });
});

module.exports = router;
