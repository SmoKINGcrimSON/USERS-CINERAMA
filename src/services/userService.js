import { UserRepository } from "../models/userRepository.js";
import { validatePartialUser, validateUser } from "../schemas/userSchema.js";
import jwt from 'jsonwebtoken'
import {secret} from '../config.js'
import { validateSignIn } from "../schemas/signInSchema.js";

export class UserService{

    /**
   * @param {UserRepository} repository
   */

    constructor(repository){
        this.repository = repository
    }
    async readAll(req, res) {
        const users = await this.repository.readAll()
        return res.json(users)
    }
    async readById(req, res){
        const id = req.id
        const user = await this.repository.readById({id: id})
        return user === null? 
            res.status(403).json({"403": "you're not authorized"}) :
            res.status(200).json(user)
    }
    async create(req, res){
        /*
        const body = req.body
        body.register_date = new Date(body.register_date)
        const result = validateUser(body)
        if(result.error) return res.status(400).json({mess: JSON.parse(result.error.message)})
        const user = await this.repository.create({body: body})
        ///jwt!!! dangerous!!!
        const token = jwt.sign({id: user.id}, secret, {expiresIn: '1h'}) //ten minutes
        console.log(token)
        ///
        return user === null? 
            res.status(400).json({"Error": "resource not created"}) : 
            res.json({user: user, token: token})
            */
            try {
                const body = req.body;
                body.register_date = new Date(body.register_date);
                const result = validateUser(body);
                if (result.error) {
                    console.error('Error de validación:', result.error);
                    return res.status(400).json({ mess: JSON.parse(result.error.message) });
                }
                const user = await this.repository.create({ body: body });
                const token = jwt.sign({ id: user.id }, secret || process.env.secret, { expiresIn: '1h' });
                console.log(token);
                return user === null ? 
                    res.status(400).json({ "Error": "Recurso no creado" }) : 
                    res.json({ user: user, token: token });
            } catch (error) {
                console.error('Error creando usuario:', error);
                return res.status(500).json({ message: 'Error interno del servidor' });
            }
    }
    async deleteById(req, res){
        const id = req.id
        const user = await this.repository.deleteById({id: id})
        return user === null? 
            res.status(400).json({"400": "bad request."}) :
            res.status(200).json(user)
    }
    async updateById(req, res){
        const body = req.body
        body.register_date = new Date(body.register_date)
        const result = validateUser(body)
        if(result.error) return res.status(400).json({mess: JSON.parse(result.error.message)})
        const id = req.id
        console.log(id)
        const user = await this.repository.updateById({id: id, body: result.data})
        return user === null? 
            res.status(400).json({"400": "bad request."}) :
            res.status(200).json(user)
    }
    async signIn(req, res){
        const body = req.body
        const result = validateSignIn(body)
        if(result.error) return res.status(400).json({mess: JSON.parse(result.error.message)})
        const user = await this.repository.findUser(result.data)
        if(user === null) return res.status(400).json({auth: false, token: null})
        console.log(user)
        const token = jwt.sign({id: user.id}, secret, {expiresIn: 60 * 5})
        res.status(200).json({auth: true, token: token})
    }

    async test(req, res){
        res.status(200).json({"200": "ok"})
    }
}