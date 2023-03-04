import { RequestHandler } from "express";
import Users from "../models/users";
import jwt from 'jsonwebtoken'

const refreshTokenController : RequestHandler = async (req, res) => {
    const refreshToken = req.headers.authorization?.split(" ")[1];
    
    const decodedClaims : any = jwt.verify(refreshToken!, process.env.BRANCA_KEY!)

    const user = await Users.findById(decodedClaims.id)

    try {

        if(!user){

             return res.status(404).json({

                message : "User id does not find"
             })

        }

        if (user.refreshToken != refreshToken) {
            return res.status(403).json({
              message: "invalid refresh token"
            });
          }

          const accessToken = jwt.sign({
            email : user.email
        },process.env.ACCESS_SECRET!,{
            expiresIn : "1m",
            issuer:"http://localhost:5000", 
            subject : user._id.toString()
        })
    
        

        return res.json({
            message: "Access Token regenerated successfully",
            data: accessToken

        })
 
} catch (error) {
    return res.json(error)
    
}
          
}

export default refreshTokenController