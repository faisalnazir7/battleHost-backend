const express=require('express')
const router=express.Router()
const mongoose=require('mongoose')
const USERS=mongoose.model('USERS')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
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
router.post('/login',(req,res)=>{
    const{email,password}=req.body
    if(!email || !password){
        return res.status(422).json({error:'One or more fields are missing'})
    }
    USERS.findOne({email:email})
    .then(match=>{
        if(!match){
            return res.status(404).json({error:'User not found'})
        }
        bcrypt.compare(password,match.password)
        .then(passwordMatch=>{
            if(!passwordMatch){
                return res.status(403).json({error:'Passwords dont match'})
            }
            const token=jwt.sign({id:match._id},process.env.SECRET_KEY)
            const {_id,email,userName}=match
            return res.status(200).json({token,userdata:{_id,email,userName},message:'Successfully logged in'})
        })
    })
})
module.exports=router