import { Router } from "express";
import { UserService } from "../services/userService.js";
import { verifyToken } from "../../middlewares/verify.js";

export class UserRouter{
    
    /**
   * @param {UserService} service
   */

    constructor(service){ //dependency injection
        this.router = Router()
        this.service = service
        this.defineRoutes()
    }

    defineRoutes(){
        this.router.get('/', verifyToken, this.service.readAll.bind(this.service))
        this.router.post('/', this.service.create.bind(this.service))
        this.router.get('/readById', verifyToken, this.service.readById.bind(this.service)) //always before /:id, could be confused
        this.router.delete('/', verifyToken, this.service.deleteById.bind(this.service))
        this.router.patch('/', verifyToken, this.service.updateById.bind(this.service))
        this.router.post('/signin', this.service.signIn.bind(this.service))
    }
}