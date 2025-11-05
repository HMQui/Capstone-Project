const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.get('/api/data', (req, res) => {
    console.log('Request received cho /api/data (API thật)');
    res.json({ message: 'Hello từ Express API!' });
});

// === EXT_AUTHZ SERVICE ===
app.all('/auth/check/*', (req, res) => {
    console.log('==> Envoy đang hỏi ý kiến /auth/check...');
    res.sendStatus(200);
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});