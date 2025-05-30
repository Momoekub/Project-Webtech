const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');


const app = express();
const PORT = 8000; // <-- มาเปลี่ยนพอร์ตตรงนี้นะจ๊ะ

app.use(cors());
app.use(bodyParser.json());

app.use('/api/account', require('./routesMomoe/account'));

app.listen(PORT, () => {
    console.log('Server running at http://localhost:'+ PORT);
});
