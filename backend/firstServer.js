const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 4000; // <-- มาเปลี่ยนพอร์ตตรงนี้นะจ๊ะ

app.use(cors());
app.use(bodyParser.json());

app.use('/api/catagory', require('./routes/catagory'));
app.use('/api/search', require('./routes/search'));

app.listen(PORT, () => {
    console.log('Server running at http://localhost:'+ PORT);
});
