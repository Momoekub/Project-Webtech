const express = require('express');
const router = express.Router();

const categories = require('../data/Catagory-shop.json')

router.get('/', (req, res) => {
    res.json(categories);
});

module.exports = router;
