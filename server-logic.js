const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

let botState = {
  isActive: false,
  amount: 5000,
  asset: 'BTC/USD',
  timeframe: 'M5',
  stopWin: 0,
  stopLoss: 0,
  currentSignal: null,
  lastResult: null
};

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/settings', (req, res) => {
  res.json(botState);
});

app.post('/api/settings', (req, res) => {
  const { isActive, amount, asset, timeframe, stopWin, stopLoss } = req.body;
  if (isActive !== undefined) botState.isActive = isActive;
  if (amount !== undefined) botState.amount = parseFloat(amount);
  if (asset !== undefined) botState.asset = asset;
  if (timeframe !== undefined) botState.timeframe = timeframe;
  if (stopWin !== undefined) botState.stopWin = parseFloat(stopWin);
  if (stopLoss !== undefined) botState.stopLoss = parseFloat(stopLoss);
  console.log('[ERRO404] Config atualizada:', botState);
  res.json({ success: true, state: botState });
});

app.post('/api/signal', (req, res) => {
  botState.currentSignal = req.body;
  console.log('[ERRO404] Novo sinal:', req.body);
  res.json({ success: true });
});

app.get('/api/signal', (req, res) => {
  res.json(botState.currentSignal || { searching: true });
});

app.post('/api/result', (req, res) => {
  botState.lastResult = req.body;
  console.log('[ERRO404] Resultado:', req.body);
  res.json({ success: true });
});

app.get('/api/result', (req, res) => {
  res.json(botState.lastResult || {});
});

app.post('/api/register', (req, res) => {
  const { name, email, phone } = req.body;
  const whatsappUrl = 'https://wa.me/5571999894368?text=' + encodeURIComponent(
    'Ola! Quero validar minha conta no ERRO404.\n\nNome: ' + name + '\nEmail: ' + email + '\nTelefone: ' + phone
  );
  console.log('[ERRO404] Novo cadastro: ' + name + ' - ' + email);
  res.json({ success: true, whatsappUrl });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log('ERRO404 Bot Dashboard rodando na porta ' + PORT);
});
