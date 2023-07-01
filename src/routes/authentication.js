const express=require('express')
const router=express.Router()
const mongoose=require('mongoose')
const USERS=mongoose.model('USERS')
const bcrypt=require('bcrypt')
router.post('/register',async(req,res)=>{
    const{email,userName,password}=req.body
    if(!email || !userName || !password){
        return res.status(422).json({error:'One or more fields missing'})
    }
    
    const {error}=USERS.validate({email,userName,password})
    if(error){
        return res.status(400).json({error:error})
    }
    USERS.findOne({$or:[{email:email},{userName:userName}]}).then(existingUser=>{
        if(existingUser){
            return res.status(409).json({error:'User already registered'})
        }
        bcrypt.hash(password,10).then(hashedPassword=>{
            const user=new USERS({
                email,
                userName,
                password:hashedPassword
            })
            user.save().then(user=> {return res.status(200).json({message:'User registered successfully'})})
            .catch(err=>{return res.status(400).json({error:err})})
        })
    })
})
module.exports=router