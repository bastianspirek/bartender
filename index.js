const express = require('express')
const winston = require('winston'),
    expressWinston = require('express-winston')

const app = express()
app.use(express.json())

//Using Winston as middleware to create logs. Logs with importance level "error" will be written to error.log
app.use(expressWinston.logger({
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
    ]
}))
const port = 3000

//Bar environment variables
const menu = { BEER: { prep_time: 5000, hands_needed: 1 }, DRINK: { prep_time: 5000, hands_needed: 2 } }
const history = []
let free_hands = 2

app.listen(port, () => {
    console.log(`Bartender listening on port ${port}`)
})

//Ordering the drink after checking whether the drink is in the menu and the bartender has enough free hands
app.post('/order/:drink', (req, res) => {
    const { drink } = req.params
    const { prep_time, hands_needed } = menu[drink]

    if (!('customerId' in req.body)) res.status(401).send(`Unauthorized: no customerId given`)

    if (Object.keys(menu).includes(drink)) {
        if (free_hands >= hands_needed) {
            prepare_drink(req.body.customerId, drink)
            res.status(200).send(`Serving ${drink} in ${prep_time}ms`)
        } else res.status(429).send(`Order not accepted: bartender is busy`)
    }
    else res.status(406).send(`Order not accepted: product ${drink} is not in menu`)
})

//Preparing the drink reduces the available free hands until the drink is done. In the end the record will be filled
const prepare_drink = (customer, drink) => {
    const { prep_time, hands_needed } = menu[drink]

    free_hands -= hands_needed
    setTimeout(() => {
        //Serving the drink
        free_hands += hands_needed
        history.push({ customer, drink, served: + new Date() })
    }, prep_time)
}

//Endpoint to get the drink history in json format
app.get('/history', (req, res) => {
    res.json(history)
})




//Example HTTP Post Request
/*const axios = require('axios');
axios.post('http://localhost:3000/order/DRINK', {
  customerId: 42281
}).then(res => {
    console.log(res.data)
}).catch(error => {
    console.log(error)
})*/