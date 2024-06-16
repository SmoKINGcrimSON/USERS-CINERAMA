import {app} from './app.js'
import {PORT} from './config.js'

async function init(){
    await app.listen(PORT) 
    console.log(`server listening on port ${PORT}`)
}

init()