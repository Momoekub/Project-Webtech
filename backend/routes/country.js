const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const countryFile = path.join(__dirname, '..', 'data', 'country.json');

// GET /api/country/list
router.get('/list', (req, res) => {
  try {
    const data = fs.readFileSync(countryFile);
    const countries = JSON.parse(data);
    res.json(countries);
  } catch (err) {
    res.status(500).json({ success: false, message: "ไม่สามารถโหลดรายชื่อประเทศได้" });
  }
});

module.exports = router;
