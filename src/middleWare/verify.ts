import { RequestHandler } from "express";
import jwt from 'jsonwebtoken'


const verifyToken : RequestHandler = async (req, res, next) => {

    const accessToken = req.headers.authorization?.split("")[1]

    try {
  
        const decodeClaims  =  jwt.verify(accessToken!,process.env.BRANCA_KEY!)

            return next()

    } catch (error) {
        return res.status(500).json(error)
    }

}

export default verifyToken

