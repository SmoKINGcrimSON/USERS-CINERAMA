import {config} from 'dotenv'

config()

export const PORT = process.env.PORT || 1234
export const secret = 'mysecrettext'