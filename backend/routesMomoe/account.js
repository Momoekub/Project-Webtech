const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const userFile = path.join(__dirname, '..', 'dataMomoe', 'user.json');

function readUsers() {
  if (!fs.existsSync(userFile)) return [];
  const data = fs.readFileSync(userFile);
  return JSON.parse(data);
}
function writeUsers(users) {
  fs.writeFileSync(userFile, JSON.stringify(users, null, 2));
}

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

router.post('/signup', (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ success: false, message: "กรุณากรอก username, email และ password ให้ครบ" });
  }
  
  const users = readUsers();

  if (users.find(u => u.email === email)) {
    return res.status(400).json({ success: false, message: "อีเมลนี้ถูกใช้ไปแล้ว" });
  }

  users.push({ username, email, password });
  writeUsers(users);
  res.json({ success: true });
});

module.exports = router;