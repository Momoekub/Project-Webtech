const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const PORT = 7000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve รูปภาพจาก img/use/product 
app.use('/img', express.static(path.join(__dirname, '..', '/img')));
app.use('/api/products', require('./routesInn/products')); //เปลี่ยนเป็นroutesเฉยๆทีหลัง
app.use('/api/cart', require('./routesInn/cart'));
app.use('/api/account', require('./routesMomoe/account'));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});