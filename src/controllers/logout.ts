import { RequestHandler } from "express";
import Users from "../models/users";
import  jwt  from "jsonwebtoken";
import refreshToken from "../models/users";
const logoutController : RequestHandler = async (req, res) => {

    const refreshTok = req.headers.authorization?.split(" ")[1];
    
    const decodedClaims : any = jwt.verify(refreshTok!, process.env.BRANCA_KEY!)

    const user = await Users.findById(decodedClaims.id)

    try {
        if(!user){
            return res.status(404).json({
                message : "User not found"
            })
        }

        if (user.refreshToken != refreshTok) {
            return res.status(403).json({
              message: "invalid refresh token"
            });
          }

          let now = new Date()
    now.setMinutes(now.getMinutes()+0)
    now = new Date(now)

    console.log(now)

   
    res.cookie("refeshToken",refreshToken,{
        httpOnly : true,
        expires : now
    })

    

          const newUser = await Users.findByIdAndUpdate(user._id,{
            $set : {
                refreshToken
            }
          })

          console.log(newUser)

          
         return  res.status(200).json({
            message : "Logout Successfully"
          })


        
    } catch (error) {

        return res.json(error)
        
    }
   
    }

export default logoutController



