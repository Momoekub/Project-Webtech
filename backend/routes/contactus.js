const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const filePath = path.join(__dirname, '..', 'data', 'contact.json');

router.post('/', (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'ข้อมูลไม่ครบ' });
  }

  let existing = [];
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, 'utf8');
    existing = data ? JSON.parse(data) : [];
  }

  existing.push({ name, email, subject, message, date: new Date() });

  try {
    fs.writeFileSync(filePath, JSON.stringify(existing, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing file:', error);
    return res.status(500).json({ error: 'ไม่สามารถบันทึกข้อมูลได้' });
  }

  res.json({ message: 'ส่งข้อมูลสำเร็จ' });
});

module.exports = router;
