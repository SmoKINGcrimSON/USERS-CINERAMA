import zod from 'zod'

export const UserSchema =  zod.object({
    nickname: zod.string().min(5).max(30),
    password: zod.string().regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).min(8).max(30),
    name: zod.string(),
    email: zod.string().email(),
    register_date: zod.date()
})

export const validateUser = (data) => {
    return UserSchema.safeParse(data)
}

export const validatePartialUser = (data) => {
    return UserSchema.partial().safeParse(data)
}