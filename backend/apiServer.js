const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000; // <-- มาเปลี่ยนพอร์ตตรงนี้นะจ๊ะ

app.use(cors());
app.use(bodyParser.json());

app.use('/api/nametest', require('./routes/nametest'));

app.listen(PORT, () => {
    console.log('Server running at http://localhost:'+ PORT);
});
