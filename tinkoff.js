
const fetch = require('node-fetch');

class Tinkoff {
    constructor() {
        this.token = process.env.TINKOFF_TOKEN;
        this.url = 'https://api-invest.tinkoff.ru/openapi/sandbox'
    }
    async makeRequest(path) {
        const request =  await fetch(this.url + path, {
            method: 'GET',
            headers: { 'Authorization': "Bearer "+ this.token },
        })
        const response  = await request.json();
        return response
    }
    async getVirginPrice() {
        const {payload} = await this.makeRequest('/market/orderbook?figi=BBG00HTN2CQ3&depth=1')
        return payload.lastPrice;
    }
}

module.exports = Tinkoff;
