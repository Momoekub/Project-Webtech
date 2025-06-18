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

app.listen(PORT, () => {
  console.log('✅ Server running at http://localhost:' + PORT);
});
