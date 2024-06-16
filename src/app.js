import express, { json, urlencoded } from 'express'
import cors from 'cors'
import { UserRouter } from './routes/userRouter.js'
import { UserService } from './services/userService.js'
import { UserRepository } from './models/userRepository.js'

export const app = express()
//middlewares
app.use(json())
app.use(urlencoded({extended: false}))
app.use(cors())
//routers
const userRouter = new UserRouter(new UserService(new UserRepository())).router 
//end-points
app.use('/users', userRouter)