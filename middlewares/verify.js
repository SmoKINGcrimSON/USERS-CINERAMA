import { secret } from "../src/config.js"
import jwt from 'jsonwebtoken'

export function verifyToken(req, res, next){
    try{
        const token = req.headers['x-access-token']
        if(!token) return res.status(401).json({auth: false, message: 'no token provided'})
        const decoded = jwt.verify(token, secret)
        console.log(decoded)
        req.id = decoded.id
        next()
    }
    catch(error){
        res.status(403).json({"403": "you're not authorized"})
    }
}