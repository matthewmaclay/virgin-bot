const gis = require('g-i-s');
const fetch = require('node-fetch');
const { Telegraf } = require('telegraf');
const express = require('express')
const Tinkoff = require('./tinkoff')
const app = express()
const port = process.env.PORT || 3000

const SPCE_GROUP_ID = '-1001287162745'

app.get('/', (req, res) => {
    res.status(200).send('ping');
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

const tinkoff = new Tinkoff();


setInterval(() => fetch('https://matthew-virgin-bot.herokuapp.com/'), 1000 * 60 * 10)

const bot = new Telegraf(process.env.BOT_TOKEN)

let lastPrice = 0;
const prices = {}

const sendPrice = async ({ groupId, interval }) => {
    const price = await tinkoff.getVirginPrice();
    const lastPrice = prices[groupId] || 0;
    const higher = lastPrice <= price;
    if (interval) {
        if (lastprice !== price) {
            bot.telegram.sendMessage(groupId, `🚀🚀🚀 SPCE ${higher ? `⬆` : `⬇`} ${price}$`)
        }
    } else {
        bot.telegram.sendMessage(groupId, `🚀🚀🚀 SPCE ${higher ? `⬆` : `⬇`} ${price}$`)
    }

    prices[groupId] = price
}

setInterval(() => sendPrice({ groupId: SPCE_GROUP_ID, interval: true }), 1000 * 60 * 15)


bot.on('text', async (ctx) => {
    try {
        const message = ctx.message.text.toLowerCase();
        if (/spceprice/.exec(message)) {
            sendPrice({ groupId: ctx.message.chat.id })
        }
    } catch (error) {
        console.log('ДЕД ЕРРОР', error)
    }



    // Using context shortcut
    //   ctx.reply(`Hello ${ctx.state.role}`)
})

bot.on('callback_query', (ctx) => {
    // Explicit usage
    ctx.telegram.answerCbQuery(ctx.callbackQuery.id)

    // Using context shortcut
    ctx.answerCbQuery()
})

bot.on('inline_query', (ctx) => {
    const result = []
    // Explicit usage
    ctx.telegram.answerInlineQuery(ctx.inlineQuery.id, result)

    // Using context shortcut
    ctx.answerInlineQuery(result)
})

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
