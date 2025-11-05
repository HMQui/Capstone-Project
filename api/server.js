const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(cors());
app.get('/api/data', (req, res) => {
    res.json({ message: 'Hello từ Express API!' });
});

app.listen(port, () => {
    console.log(`API server đang chạy trên cổng ${port}`);
});