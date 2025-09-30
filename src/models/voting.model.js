import mongoose from 'mongoose';


const votingSchema = new mongoose.Schema({
    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref :"Post"
    },
    voteBy:{
         type:mongoose.Schema.Types.ObjectId,
        ref :"User"
    },
        vote:{
            type:Number,
            /*
            0-> no vote
            1-> upvote
            -1 -> downvote
            */
        },
       




},{timestamps:true})

export const Voting = mongoose.model("Voting",votingSchema)