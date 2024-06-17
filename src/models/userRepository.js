import {PrismaClient} from '@prisma/client'
import { Buffer } from 'buffer'
import { stringify } from 'uuid'
import { parse } from 'uuid'

const prisma = new PrismaClient()

export class UserRepository{ //will we dependency injection for services

    async create({body}){
        try{
            const uuid = crypto.randomUUID()
            //call DB
            let user = await prisma.user.create({
                data: {
                    id: Buffer.from(parse(uuid)),
                    nickname: body.nickname,
                    password: body.password,
                    name: body.name,
                    email: body.email,
                    register_date : body.register_date
                }
            })
            //modify user
            user = this.transform(user)
            user = {id: uuid, ...user}
            //return
            return user
        }
        catch(error){
            if(error.code === 'P2002') console.log(`${error.code}: user already exist.`)
            else console.log(error)
            return null
        }
    }
    
    async readAll(){
        //call DB
        let users = await prisma.user.findMany()
        //modify array
        users = users.map(u => {
            u = this.transform(u)
            return u
        })
        //return
        return users
    }
    
    async readById({id}){
        try{
            //call DB
            let user = await prisma.user.findFirst({
                where: {
                    id: parse(id)
                }
            })
            //modify User
            user = this.transform(user)
            //return
            return user
        }
        catch(error){
            console.log(`record doesn't exist.`)
            return null
        }
    }

    async findUser({email, password}){
        try{
            //call DB
            let user = await prisma.user.findFirst({
                where: {
                    AND: [
                        {email: email}, {password: password}
                    ]
                }
            })
            //modify
            const uuid = stringify(user.id)
            user = {
                id: uuid, nickname: user.nickname, name: user.name, email: user.email, register_date: user.register_date
            }
            //return
            return user
        }
        catch(e){
            console.log(`doesn't find user ${email}`)
            return null
        }
    }

    async deleteById({id}){
        try{
            //call DB
            let user = await prisma.user.delete({
                where: {
                    id: parse(id)
                }
            })
            //modify user
            user = this.transform(user)
            //print
            return user
        }
        catch(error){
            if(error.code === 'P2025') console.log(`${error.code}: record doesn't exist.`)
            return null
        }
    }

    async updateById({id, body}){
        try{
            //find
            let user = await this.readById({id})
            user = {...user, ...body}
            //update
            let updatedUser = await prisma.user.update({
                where: {
                    id: parse(id)
                }, 
                data: {
                    nickname: user.nickname,
                    password: user.password,
                    name: user.name,
                    email: user.email,
                    register_date: user.register_date
                }
            })
            //modify updatedUser
            updatedUser = this.transform(updatedUser)
            //print
            return updatedUser
        }
        catch(error){
            if(error.code === 'P2002') console.log(`${error.code}: register already exist.`)
            return null
        }
    }
    ////helper functions
    transform(user){
        user = {
            nickname: user.nickname, name: user.name, email: user.email, register_date: user.register_date
        }
        return user
    }
}