const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// ที่อยู่ไฟล์หมวดหมู่
const categoriesFile = path.join(__dirname, '..', 'data', 'Catagory-shop.json');

// ดึง path ของไฟล์ตาม category
function getFilePathByCategory(category) {
  return path.join(__dirname, '..', 'data', `${category}.json`);
}

// อ่านหมวดหมู่จากไฟล์ Catagory-shop.json
function readCategories() {
  try {
    const content = fs.readFileSync(categoriesFile, 'utf8');
    return content ? JSON.parse(content) : [];
  } catch (err) {
    console.error('อ่านไฟล์หมวดหมู่ผิดพลาด:', err);
    return [];
  }
}

// อ่านสินค้าในแต่ละหมวด
function readProducts(category) {
  const filePath = getFilePathByCategory(category);
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return content ? JSON.parse(content) : [];
  } catch (err) {
    return [];
  }
}

// เขียนข้อมูลสินค้า
function writeProducts(category, data) {
  const filePath = getFilePathByCategory(category);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// ดึงสินค้าทุกหมวด
router.get('/', (req, res) => {
  try {
    const categoriesObj = readCategories();
    const categories = categoriesObj.categories || [];
    let allProducts = [];

    categories.forEach(category => {
      const products = readProducts(category);
      const productsWithCategory = products.map(p => ({ ...p, category }));
      allProducts = allProducts.concat(productsWithCategory);
    });

    res.json(allProducts);
  } catch (err) {
    console.error('โหลดสินค้าผิดพลาด:', err);
    res.status(500).json({ error: 'โหลดข้อมูลผิดพลาด' });
  }
});

// ดึงสินค้าทั้งหมดใน category เดียว
router.get('/:category', (req, res) => {
  const { category } = req.params;
  const data = readProducts(category);
  res.json(data);
});

// ดึงสินค้ารายตัว
router.get('/:category/:id', (req, res) => {
  const { category, id } = req.params;
  const data = readProducts(category);
  const product = data.find(p => p.id === parseInt(id));
  if (!product) return res.status(404).json({ error: 'ไม่พบสินค้า' });
  res.json(product);
});

// เพิ่มสินค้าใหม่ (ส่ง category ทาง body)
router.post('/', (req, res) => {
  const { category, name, description, image, prices } = req.body;

  if (!category || !name || !prices || !Array.isArray(prices)) {
    return res.status(400).json({ error: 'ข้อมูลไม่ครบหรือราคาผิดพลาด' });
  }

  const data = readProducts(category);
  const maxId = data.length > 0 ? Math.max(...data.map(p => p.id)) : 0;

  const newProduct = {
    id: maxId + 1,
    name,
    description,
    image,
    prices
  };

  data.push(newProduct);
  writeProducts(category, data);

  res.json({ message: 'เพิ่มสินค้าสำเร็จ', product: newProduct });
});

// เพิ่มสินค้าโดยส่ง category ผ่าน URL
router.post('/:category', (req, res) => {
  const { category } = req.params;
  const { name, description, image, prices } = req.body;

  if (!name || !prices || !Array.isArray(prices)) {
    return res.status(400).json({ error: 'ข้อมูลไม่ครบหรือราคาผิดพลาด' });
  }

  const data = readProducts(category);
  const maxId = data.length > 0 ? Math.max(...data.map(p => p.id)) : 0;

  const newProduct = {
    name,
    description,
    image,
    prices,
    id: maxId + 1,
  };

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
