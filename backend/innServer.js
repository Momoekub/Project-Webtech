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
app.use('/api/products', require('./routesInn/products'));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});