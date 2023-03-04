import { RequestHandler } from "express";
import { loginDto } from "../dtos/auth";
import Users from "../models/users";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


const brancaKey = process.env.BRANCA_KEY
const branca = require("branca")(brancaKey)


const loginController : RequestHandler = async (req, res, next) =>{
    const validation = loginDto.validate(req.body)

    if(validation.error){
        return res.status(403).json({
            message : "Validation error",
            errors : validation.error.details
        })
    }

    const {email, password} = req.body

    const existingUser = await Users.findOne({email})

    if(!existingUser){
        return res.status(403).json({
            message : "Invalid Credentials"
        })
    }

    const matched = await bcrypt.compare(password,existingUser.password!)

    
    if(!matched){
        return res.json({
            message : "Invalid Credentials"
        })
    }

    const accessToken = jwt.sign({
        email : existingUser.email
    },process.env.ACCESS_SECRET!,{
        expiresIn : "10m",
        issuer:"http://localhost:5000", 
        subject : existingUser._id.toString()
    })

    console.log("access", accessToken)

    const jsonPayload = JSON.stringify({
        email: existingUser.email,
        _id: existingUser._id.toString()

    })
    

    const refresh = branca.encode(jsonPayload)

    const refreshToken = jwt.sign({
        id: existingUser._id,
        email: existingUser
    },process.env.BRANCA_KEY!!,
    {
        expiresIn:"30d",
        issuer : "http://localhost:5000",
        subject : existingUser._id.toString()
    })
  
    const upadateUser = await Users.findByIdAndUpdate(existingUser._id,{
        $set:{
            refreshToken
        }
    },{new : true}
    ) 

    console.log(upadateUser)


    let now = new Date()
    now.setMinutes(now.getMinutes()+5)
    now = new Date(now)

    console.log(now)

    res.cookie("accessToken",accessToken,{
        httpOnly : true,
        expires : now
        
        
    })
    res.cookie("refeshToken",refreshToken,{
        httpOnly : true,
        
    })

    return res.status(200).json({
        message :"Login Sucessfully",
        data:{
        ...existingUser.toJSON(),
        token :accessToken
        }
    })

}

export default loginController