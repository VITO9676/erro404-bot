const express = require('express');
const { chromium } = require('playwright');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

let isRunning = false;

app.get('/', (req, res) => {
  res.send('ERRO404 Bot is active and standing by.');
});

app.post('/start', async (req, res) => {
  if (isRunning) return res.status(400).json({ status: 'Already running' });
  
  isRunning = true;
  console.log('Starting ERRO404 Signal Hunt...');
  
  // Aqui entra a lógica do market-engine.js que monitora o BTC/USD
  // e executa as ordens de R$ 5.000,00 na Vertex Binary.
  
  res.json({ status: 'ERRO404 Started' });
});

app.post('/stop', (req, res) => {
  isRunning = false;
  console.log('ERRO404 Stopped');
  res.json({ status: 'ERRO404 Stopped' });
});

app.listen(port, () => {
  console.log(`ERRO404 Server running on port ${port}`);
});
