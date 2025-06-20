const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const PORT = 5000;
const path = require('path');
const orderRoutes = require('./routes/orderRoutes');

app.use(cors());
app.use(bodyParser.json());

// เส้นทาง API ต่างๆ
app.use('/api/account', require('./routes/account'));
app.use('/api/country', require('./routes/country'));
app.use('/api/products', require('./routes/products'));
app.use('/api/order', orderRoutes); 
app.use('/img', express.static(path.join(__dirname, '..', 'img')));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/checkout', require('./routes/checkout'));
app.use('/api/catagory', require('./routes/catagory')); //สำหรับแยกหมวดหมู่Add commentMore actions
app.use('/api/search', require('./routes/search')); //สำหรับการค้นหาสินค้า

app.use('/api/newsletter', require('./routes/newsletter'));//ส่งอีเมล์ตรงfooter
app.use('/api/contactus', require('./routes/contactus'));//ส่งข้อมูลในcontactus

app.listen(PORT, () => {
  console.log('✅ Server running at http://localhost:' + PORT);
});
