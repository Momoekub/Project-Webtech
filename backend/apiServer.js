const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const PORT = 5000; // <-- มาเปลี่ยนพอร์ตตรงนี้นะจ๊ะ

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//ของโมโม่
app.use('/api/account', require('./routes/account'));
app.use('/api/country', require('./routes/country'));
app.use('/api/checkout', require('./routes/checkout'));

//Inn
app.use('/img', express.static(path.join(__dirname, '..', '/img')));
app.use('/api/products', require('./routes/products')); 
app.use('/api/cart', require('./routes/cart'));

//First
app.use('/api/catagory', require('./routes/catagory')); //สำหรับแยกหมวดหมู่
app.use('/api/search', require('./routes/search')); //สำหรับการค้นหาสินค้า

app.listen(PORT, () => {
    console.log('Server running at http://localhost:'+ PORT);
});
