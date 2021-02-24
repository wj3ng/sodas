import * as express from 'express'

import { createUser } from './controllers/user'

const PORT = 3000

const app = express()

app.use(express.json())

app.listen(PORT, async () => {
    console.log(`Ready to receive connections on port ${PORT}`)
    console.log(await createUser('Willie', 'Jeng', 'doodoo@gmail.com', 'cowshagger2002'))
})
