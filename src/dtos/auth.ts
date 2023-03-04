import joi from 'joi'

export const signupDto = joi.object({
    name: joi.string().max(20).required(),
    email: joi.string().email().required(),
    password : joi.string().min(8).required()
})

export const loginDto = joi.object({
    name : joi.string().max(20).required(),
    email: joi.string().email().required(),
    password : joi.string().min(8).required()
})