import mongooes, {Schema } from 'mongoose'

const userSchema = new Schema({

    email:{
        type : String,
        require : true,
        unique : true,
        maxlength : 30
    },

    password:{
        type : String,
        require : true,
        minlength : 8

    },
    
    name:{
        type : String,
        require : true,
        maxlength : 20

    },

    refreshToken:{
        type : String,
        require: false,
        default: ""

    }
},
{
    timestamps : true
})

const Users = mongooes.model("Users", userSchema)

export default Users