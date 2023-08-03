const mongoose = require('mongoose')
const {ObjectId}=mongoose.Schema.Types
const resultSchema= new mongoose.Schema({
    matchId:{
        type:ObjectId,
        ref:'Match'
    },
    organizerId:{
        type:ObjectId,
        ref:'User'
    },
    Winner:{
        type:ObjectId,
        ref:'RegisterTournament'
    },
    FirstRunnerUp:{
        type:ObjectId,
        ref:'RegisterTournament'
    },
    SecondRunnerUp:{
        type:ObjectId,
        ref:'RegisterTournament'
    }
},{
    timestamps:true
})

const Result=mongoose.model('RESULT',resultSchema)
module.exports=Result