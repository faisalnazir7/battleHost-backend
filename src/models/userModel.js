const mongoose=require('mongoose')
const Joi=require('joi')

    const emailSchema=Joi.string().email().required()
    const userNameSchema= Joi.string().min(5)
    const passwordSchema= Joi.string()
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'))
    .required()
    .messages({
      'string.pattern.base': 'Password must contain at least one lowercase, one uppercase, one digit, and one special character',
    })


const registerUserSchema=new mongoose.Schema({
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

registerUserSchema.pre('save',async function(next){
    try{
           // Validate email
    await emailSchema.validateAsync(this.email);

    // Validate name
    await userNameSchema.validateAsync(this.name);

    // Validate password
    await passwordSchema.validateAsync(this.password)
    next();
    }
    catch(error){
        next(error)
    }
})
mongoose.model("USERS",registerUserSchema)