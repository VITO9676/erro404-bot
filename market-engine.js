/**
 * ERRO404 - Motor de Leitura em Tempo Real (Segunda Camada)
 * Integração de WebSocket com Estratégias AMD + FVG + Retração M5
 */

const WebSocket = require('ws');

// Configurações Globais (RULES.md)
const config = {
    pair: 'BTCUSDT',
    timeframe: '5m',
    entryValue: 5000,
    status: 'OPERANDO',
    authorized: true
};

let candles = [];
const MAX_CANDLES = 20;

function connectToMarket() {
    const wsUrl = `wss://stream.binance.com:9443/ws/${config.pair.toLowerCase()}@kline_${config.timeframe}`;
    const ws = new WebSocket(wsUrl);

    ws.on('open', () => {
        console.log(`[ERRO404] Conectado: Monitorando ${config.pair} (${config.timeframe})`);
    });

    ws.on('message', (data) => {
        const message = JSON.parse(data);
        const kline = message.k;
        if (kline.x) updateCandleHistory(kline);
        analyzeRealTime(kline);
    });

    ws.on('error', (err) => console.error("Erro no WebSocket:", err));
    ws.on('close', () => setTimeout(connectToMarket, 5000));
}

function updateCandleHistory(k) {
    candles.push({
        open: parseFloat(k.o), high: parseFloat(k.h),
        low: parseFloat(k.l), close: parseFloat(k.c),
        volume: parseFloat(k.v), time: k.t
    });
    if (candles.length > MAX_CANDLES) candles.shift();
}

function analyzeRealTime(k) {
    const preco_atual = parseFloat(k.c);
    if (config.status === "OPERANDO" && config.authorized === true) {
        const suporte = 64000;
        if (preco_atual <= suporte) {
            console.log(`[GATILHO] Preço (${preco_atual}) atingiu Suporte!`);
        }
        if (checkAMD(k)) {
            console.log("[ESTRATEGIA DA SORTE] Setup Wyckoff Detectado!");
        }
    }
}

function checkAMD(k) {
    const high = parseFloat(k.h);
    const close = parseFloat(k.c);
    const bodySize = Math.abs(close - parseFloat(k.o));
    const wickSize = high - Math.max(close, parseFloat(k.o));
    return wickSize > (bodySize * 2);
}

module.exports = { connectToMarket };
if (require.main === module) connectToMarket();
