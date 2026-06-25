const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 10000;

app.use(express.json());
app.use(express.static('public'));

let botSettings = { isActive: false, amount: 5000, asset: 'BTC/USD' };

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/settings', (req, res) => {
    res.json(botSettings);
});

app.post('/api/settings', (req, res) => {
    const { isActive, amount } = req.body;
    if (typeof isActive !== 'undefined') botSettings.isActive = isActive;
    if (typeof amount !== 'undefined') botSettings.amount = Number(amount);
    console.log(`[ERRO404] Status: ${botSettings.isActive ? 'ATIVADO' : 'DESATIVADO'} | Valor: R$ ${botSettings.amount}`);
    res.json({ success: true, settings: botSettings });
});

app.listen(port, () => {
    console.log(`🚀 ERRO404 Dashboard rodando na porta ${port}`);
});
