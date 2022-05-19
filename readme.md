# Bartender

Bartender is a node.js express API service.

## Installation

Use git clone and then node package manager to install the dependencies:

```bash
git clone https://github.com/bastianspirek/bartender.git
cd bartender && npm i
```

## Usage

```bash
node index.js
````
Registered API endpoints are:
- POST `/order/:drink` where the body should contain `customerId`
- GET `/history/`

### Example HTTP Post Request

```javascript
const axios = require('axios');
axios.post('http://localhost:3000/order/DRINK', {
  customerId: 42281
}).then(res => {
    console.log(res.data)
}).catch(error => {
    console.log(error)
})
//Should log "Serving DRINK in 5000ms"
//Making two of these requests should result in a 429 response on the second one
```
