import mongoose from 'mongoose';


const commentSchema = new mongoose.Schema({
    content:{
        type:String,
        required:true
    },
    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref :"Post"
    },
    image:{
        type:string,
        required:true
      },
    commentUploader:{
         type:mongoose.Schema.Types.ObjectId,
        ref :"User"
    }
},{timestamps:true})

export const Comment = mongoose.model("Comment",commentSchema)