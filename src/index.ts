import dotenv from 'dotenv'
dotenv.config()
import mongoose from 'mongoose';
import app from './app'


mongoose.set('strictQuery',false);
mongoose.connect(process.env.MONGO_URI!)

.then(()=>{
app.listen(process.env.PORT!,()=>{
    console.log(`Server is running on ${process.env.PORT}`); 
})
})

.catch(error=>{
    console.log("Mongoose Error",error)
})