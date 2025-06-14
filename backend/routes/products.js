const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const filePath = path.join(__dirname, '..', 'data', 'products.json');
function readProducts() {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return content ? JSON.parse(content) : [];
  } catch (err) {
    return [];
  }
}

// สินค้าทั้งหมด
router.get('/', (req, res) => {
  const data = readProducts();
  res.json(data);
});

//ดึงข้อมูลตามid
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const data = readProducts();
  const product = data.find(p => p.id === id);
  if (!product) {
    return res.status(404).json({ error: 'ไม่พบสินค้า' });
  }
  res.json(product);
});

// เพิ่มสินค้าใหม่
router.post('/', (req, res) => {
  const data = readProducts();
  const newProduct = req.body;
  const maxId = data.length > 0 ? Math.max(...data.map(p => p.id)) : 0;
  newProduct.id = maxId + 1;
  data.push(newProduct);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  res.json({ message: 'เพิ่มสินค้าสำเร็จ', product: newProduct });
});

// แก้ไขสินค้า
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const data = readProducts();
  const index = data.findIndex(p => p.id === id);
  if (index === -1) return res.status(404).json({ error: 'ไม่พบสินค้า' });

  data[index] = { ...data[index], ...req.body };
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  res.json({ message: 'แก้ไขสินค้าสำเร็จ' });
});

// ลบสินค้า
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  let data = readProducts();
  const product = data.find(p => p.id === id);
  if (!product) return res.status(404).json({ error: 'ไม่พบสินค้า' });

  data = data.filter(p => p.id !== id);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  res.json({ message: 'ลบสินค้าสำเร็จ' });
});

module.exports = router;
