const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000; // <-- มาเปลี่ยนพอร์ตตรงนี้นะจ๊ะ

app.use(cors());
app.use(bodyParser.json());

//ของโมโม่
app.use('/api/account', require('./routes/account'));
app.use('/api/country', require('./routes/country'));
app.use('/api/checkout', require('./routes/checkout'));

app.listen(PORT, () => {
    console.log('Server running at http://localhost:'+ PORT);
});
