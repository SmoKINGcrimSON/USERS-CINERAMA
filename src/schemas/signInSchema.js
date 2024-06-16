import { UserSchema } from './userSchema.js'

const signInSchema = UserSchema.pick({
    email: true, password: true
})

export const validateSignIn = (data) => {
    return signInSchema.safeParse(data)
}