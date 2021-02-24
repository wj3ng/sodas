const express = require('express')
const bodyParser = require('body-parser')

const app = express()
const port = 3000

app.use(bodyParser.json())

app.get('/', (_req, res) => {
	res.send('Hello world!')
})

app.get('/hello', (_req, res) => {
	res.send('Hello there!')
})

app.post('/add', (req, res) => {
	console.log(req.body);
	res.send(`${req.body.a} + ${req.body.b} = ${req.body.a + req.body.b}`);
})

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
})

