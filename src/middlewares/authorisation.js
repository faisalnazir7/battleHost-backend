const mongoose=require('mongoose')
const USERS=mongoose.model('USERS')
const jwt=require('jsonwebtoken')
module.exports=(req,res,next)=>{
    const {authorization}=req.headers
    if(!authorization){
        return res.status(403).json({error:'Cant authorize'})
    }
    const token=authorization.replace("Bearer ","")
    jwt.verify(token,process.env.SECRET_KEY)
    .then(payload=>{
        const {_id}=payload
        USERS.findById({id:_id}).then(data=>{
            req.user=data
            next();
        })
    })
    .catch(err=>{return res.status(401).json({error:'Cant verify token...'})})

}