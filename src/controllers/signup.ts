import { Request,Response } from "express";
import Users from "../models/users";
import bcrypt from 'bcrypt'
import { signupDto } from "../dtos/auth";

const signupController = async (req: Request, res: Response ) =>{
    const validation = signupDto.validate(req.body)
    
    if(validation.error){
        return res.status(400).json({
            message: "Validation Failed",
            errors: validation.error.details,
        })
    }

    const {email, password, name} = req.body

    const existingUser = await Users.findOne({email});

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists"
      })
    }

    const hashPassword = await bcrypt.hash(password,8)

    const newUser = await Users.create({
            email,
            password: hashPassword,
            name
        })

    return res.json({
        message:"SignUp Successfully",

        data : newUser
        
    })
        
}

export default signupController      