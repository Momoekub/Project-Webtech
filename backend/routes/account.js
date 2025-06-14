const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const userFile = path.join(__dirname, '..', 'data', 'user.json');

function readUsers() {
  if (!fs.existsSync(userFile)) return [];
  const data = fs.readFileSync(userFile);
  return JSON.parse(data);
}

function writeUsers(users) {
  fs.writeFileSync(userFile, JSON.stringify(users, null, 2));
}

// POST /login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const users = readUsers();
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    res.json({ success: true, username: user.username });
  } else {
    res.status(401).json({ success: false, message: "Email หรือ Password ไม่ถูกต้อง" });
  }
});

// POST /signup
router.post('/signup', (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ success: false, message: "กรุณากรอกข้อมูลให้ครบ" });
  }

  const users = readUsers();
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ success: false, message: "อีเมลนี้ถูกใช้ไปแล้ว" });
  }

  users.push({ username, email, password });
  writeUsers(users);
  res.json({ success: true, username });
});

// POST /reset-password
router.post('/reset-password', (req, res) => {
  const { email, newPassword, otp } = req.body;
  
  // อ่าน users จากไฟล์
  const users = readUsers();
  const user = users.find(u => u.email === email);

  if (!user) {
    return res.status(404).json({ success: false, message: "ไม่พบอีเมลนี้ในระบบ" });
  }

  // **(ตรงนี้ต้องมีการตรวจสอบ otp ด้วย ถ้ามีระบบเก็บ otp)**
  // สมมติผ่านแล้ว

  user.password = newPassword;
  writeUsers(users);

  res.json({ success: true, message: "เปลี่ยนรหัสผ่านสำเร็จ" });
});

// POST /change-username
router.post('/change-username', (req, res) => {
  const { email, newUsername } = req.body;
  const users = readUsers();
  const user = users.find(u => u.email === email);

  if (!user) {
    return res.status(404).json({ success: false, message: "ไม่พบอีเมลในระบบ" });
  }

  user.username = newUsername;
  writeUsers(users);

  res.json({ success: true });
});
module.exports = router;

router.post('/request-otp', (req, res) => {
  const { email } = req.body;
  const users = readUsers();
  const user = users.find(u => u.email === email);

  if (!user) {
    return res.status(404).json({ success: false, message: "ไม่พบอีเมลนี้ในระบบ" });
  }

  // สร้าง OTP ง่าย ๆ แบบสุ่ม 6 หลัก
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  res.json({ success: true, otp });
});