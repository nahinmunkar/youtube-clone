import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    title:{
        type:String,//cloudinary url
        required: true,
    },
    description:{
        type:String,
       required: true,
    },

    images:{
        type: [String], // Defines an array of strings
        default: [], // Ensures an empty array if no images are provided
      },

      video :{
        type:string,

      },
      crimeTime:{
        type:String
      },
      division:{
        type:String,
        required: true
      },
      district:{
        type:String,
        required: true
      },
      exactLocation:{
        type:String
      },
      bannedPost :{
        type:Boolean,
        default:false
      },
  
    PostUploader:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
},{
    timestamps:true, 
})

export const Post = mongoose.model('Post',postSchema)

