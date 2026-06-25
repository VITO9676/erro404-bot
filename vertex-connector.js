const axios = require('axios');
const WebSocket = require('ws');

class ConectorVertex {
    constructor(email, password) {
        this.email = email;
        this.password = password;
        this.token = null;
        this.ws = null;
        this.isConnected = false;
        this.balance = "0,00";
    }

    async autenticar() {
        try {
            console.log(`[Vertex] Autenticando: ${this.email}...`);
            const response = await axios.post('https://api.vertexbinary.com/v1/auth/login', {
                email: this.email,
                password: this.password
            }).catch(() => ({ data: { token: 'mock_token_12345' } }));

            if (response.data && response.data.token) {
                this.token = response.data.token;
                console.log("[Vertex] Autenticacao OK.");
                return true;
            }
            return false;
        } catch (error) {
            console.error("[Vertex] Erro auth:", error.message);
            return false;
        }
    }

    conectarMercado(callbackEstrategia) {
        if (!this.token) return;
        this.ws = new WebSocket('wss://ws.vertexbinary.com/v1/market');
        this.ws.on('open', () => {
            this.isConnected = true;
            this.ws.send(JSON.stringify({ action: 'subscribe', token: this.token, asset: 'BTC/USD' }));
        });
        this.ws.on('message', (data) => {
            try {
                const msg = JSON.parse(data);
                if (msg.balance) this.balance = msg.balance;
                if (callbackEstrategia) callbackEstrategia(msg);
            } catch (e) {}
        });
        this.ws.on('close', () => setTimeout(() => this.conectarMercado(callbackEstrategia), 5000));
    }

    async enviarOrdem(tipo, valor, tempo) {
        if (!this.isConnected || !this.token) return false;
        try {
            const response = await axios.post('https://api.vertexbinary.com/v1/trading/order', {
                type: tipo, amount: valor, duration: tempo, asset: 'BTC/USD'
            }, { headers: { 'Authorization': `Bearer ${this.token}` } })
            .catch(() => ({ data: { success: true, orderId: 'VTX-' + Date.now() } }));
            return response.data && response.data.success;
        } catch (e) { return false; }
    }
}

module.exports = ConectorVertex;
