import * as express from 'express'
import * as argon2 from 'argon2'
import { Item, CreateItem } from './controllers/item'
import { User, CreateUser } from './controllers/user'

const PORT = 3000
const app = express()

const items: Item[] = []
const users: User[] = []

// -1: incorrect password, -2: email not found
const checkUser = async (email: string, password: string): Promise<number> => { 
    for(let i=0; i<users.length; i++) {
        if(users[i].email === email) {
            if(await argon2.verify(users[i].password, password)) {
                return i
            } else {
                return -1
            }
        }
    }
    return -2
}

// -1: not found
const checkItem = (itemId: number): number => {
    for(let i=0; i<items.length; i++) {
        if(items[i].id === itemId) {
            return i
        }
    }
    return -1
}

app.use(express.json())

app.get('/items', (_req, res) => {
    res.send(items)
})

app.post('/cart', async (req, res) => {
    
    const userIndex = await checkUser(req.body.email, req.body.password)

    if(userIndex < 0) {
        return res.send('Invalid login.')
    }

    res.send(users[userIndex].cart)

})

app.post('/addToCart', async (req, res) => {

    const userIndex = await checkUser(req.body.email, req.body.password)
    const itemIndex = checkItem(req.body.itemId)

    if(userIndex < 0) {
        return res.send( { 'success': false } )
    } 

    if(itemIndex < 0) {
        return res.send( { 'success': false } )
    }

    if(req.body.itemId in users[userIndex].cart){
        users[userIndex].cart[req.body.itemId]++
    } else {
        users[userIndex].cart[req.body.itemId] = 0
    }

    res.send({
        'success': true, 
        'itemAdded': items[itemIndex],
    })

})

app.post('/remove', async (req, res) => {

    const userIndex = await checkUser(req.body.email, req.body.password)
    const itemIndex = checkItem(req.body.itemId)

    if(userIndex < 0) {
        return res.send({
            'success': false,
            'message': 'Invalid login.',
        })
    } 

    if(itemIndex < 0) {
        return res.send({
            'success': false,
            'message': 'Invalid item.',
        })
    } 

    if(!users[userIndex].cart[itemIndex]) {
        return res.send({
            'success': false,
            'message': 'No such item in cart.',
        })
    }

    const quantityRemoved = Math.min(req.body.quantity, users[userIndex].cart[itemIndex])
    users[userIndex].cart[itemIndex] -= quantityRemoved

    res.send({
        'success': true,
        'message': `Removed ${quantityRemoved} items from the cart`,
        'remainingItems': users[userIndex].cart[itemIndex],
    })

})

app.post('/checkout', async (req, res) => {

    const userIndex = await checkUser(req.body.email, req.body.password)

    if(userIndex < 0) {
        return res.send({ 'success': false })
    } 

    users[userIndex].cart = {}

    res.send({ 'success': true })

})

app.post('/createItem', (req, res) => {

    for(let i of items) {
        if(i.name === req.body.name) {
            return res.send( { 'success': false } )
        }
    }

    items.push( CreateItem(items.length+1, req.body.name, req.body.price, req.body.description) )

    res.send( { 'success': true } )

})

app.post('/createUser', async (req, res) => {

    for(let i of users) {
        if(i.email === req.body.email) {
            res.send('Account already exists.')
            return
        }
    }

    users.push( await CreateUser(req.body.email, req.body.password) )

    res.send(users.length-1 + '')

})

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})