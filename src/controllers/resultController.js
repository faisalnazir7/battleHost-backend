const asyncHandler=require('express-async-handler')
const Tournament=require('../models/tournamentModel')
const RegisterTournament = require("../models/registerTournamentModel");
const User = require("../models/userModel");
const Result=require('../models/resultModel')
//------Declare Results of a particular tournament------//
const declareResultsController=asyncHandler(async(req,res)=>{
    const matchId=req.params.tournamentId
const {Winner,FirstRunnerUp,SecondRunnerUp}=req.body
if(!matchId || !Winner || !FirstRunnerUp || !SecondRunnerUp){
    res.status(400);
    throw new Error('One or more fields missing')
}
const checkMatchId=await Tournament.findById(matchId)
if(!checkMatchId){
    res.status(404);
    throw new Error('Match not found')
}

const isDeclared=await Result.find({matchId:matchId})
if(isDeclared.length>0){
    res.status(422);
    throw new Error('Results already declared for the tournament')
}
const positionHoldersArray=[Winner,FirstRunnerUp,SecondRunnerUp]
const positionHoldersId=[]

// const getIndividual1=await User.find({email:positionHoldersArray[0]})
//         console.log(getIndividual1[0]._id)
for(let i=0;i<positionHoldersArray.length;i++){
    const getData=await RegisterTournament.find({teamName:positionHoldersArray[i]})
    if(getData.length===0){
        const getIndividual=await User.find({email:positionHoldersArray[i]})
        if(!getIndividual.length){
            res.status(404);
            throw new Error('Team/Individual Not found')
        }
     
        const findIndividualData=await RegisterTournament.find({user:getIndividual[0]._id,tournament:matchId})
        if(!findIndividualData){
            res.status(404);
            throw new Error('Team/Individual Not found')
        }
        positionHoldersId.push(findIndividualData[0]._id)
    }
    else{
        positionHoldersId.push(getData[0]._id)
    }
}
// console.log(positionHoldersId)
if(!checkMatchId.participants.includes(positionHoldersId[0]) || !checkMatchId.participants.includes(positionHoldersId[1]) || !checkMatchId.participants.includes(positionHoldersId[2])){
    res.status(404);
    throw new Error('One or more team/participants not found')
}
const checkDuplicate=new Set()
checkDuplicate.add(positionHoldersId[0])
checkDuplicate.add(positionHoldersId[1])
checkDuplicate.add(positionHoldersId[2])
// console.log(checkDuplicate)
if(checkDuplicate.size!==3){
    res.status(422);
    throw new Error('One or more position contains duplicate team/participants')
}

const declareResult=new Result({
    matchId,
    organizerId:req.user._id,
    Winner:positionHoldersId[0],
    FirstRunnerUp:positionHoldersId[1],
    SecondRunnerUp:positionHoldersId[2]
})
const declare=await declareResult.save()
if(!declare){
    res.status(500);
    throw new Error('Internal Server Error')
}
return res.status(200).json({success:'Results declared successfully'})
})

module.exports={declareResultsController}