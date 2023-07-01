const mongoose=require('mongoose')
const registerSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    userName:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})
mongoose.model("USERS",registerSchema)