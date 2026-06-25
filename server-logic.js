const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
let botState = { isActive: false, amount: 5000, asset: 'BTC/USD', timeframe: 'M5' };
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.get('/api/settings', (req, res) => res.json(botState));
app.post('/api/settings', (req, res) => {
    botState = { ...botState, ...req.body };
    res.json({ success: true, state: botState });
});
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.listen(PORT, () => console.log('ERRO404 ON'));
