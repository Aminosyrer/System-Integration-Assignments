const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.static('public'));

app.get('/events', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    setInterval(() => {
        res.write(`data: ${new Date().toISOString()}\n\n`);
    }, 1000);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});