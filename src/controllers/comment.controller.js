import mongoose,{isValidObjectId} from "mongoose"
import {Comment} from "../models/comment.model.js"

import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/AsyncHandler.js"


const addComment = asyncHandler(async (req, res) => {
    
    const{videoId}  = req.params
    const {content} = req.body


    if(!videoId){
        throw new ApiError(400, "video Id is required")
    }

    if(!content){
        throw new ApiError(400, "please write anything in comment")
    }

    if (!isValidObjectId(videoId)) {
        throw new ApiError(500, `Malformatted video id ${videoId}`);
      }


      const comment = await Comment.create({
        content: content,
        video: videoId,
        owner: req?.user?._id
      })
      

      if(!comment){
        throw new ApiError(500, `something is wrong while adding comment in video`);
      }

      return res.status(201).json(
        new ApiResponse(200, comment,"successfully added comment on the video")
    )  

})

const updateComment = asyncHandler(async (req, res) => {
  
    const{commentId}  = req.params
    const {content}= req.body
    
    if(!commentId){
        throw new ApiError(400, "comment Id is required")
    }

    if (!isValidObjectId(commentId)) {
        throw new ApiError(500, `Malformatted comment Id ${commentId}`);
      }


      const comment = await Comment.aggregate([
        {
            $match:{
                _id:new mongoose.Types.ObjectId(commentId)
            }
        }
    ])


    if(comment.length==0) 
        throw new ApiError(404, `there is no such comment`);
       
    console.log(comment)
        const result = await Comment.findByIdAndUpdate(
            commentId,
            { $set: { content: content } },
            { new: true }
          );

    // console.log(result)


          return res.status(200).json(
            new ApiResponse(200, result,"successfully updated comment")
        )  

})

const deleteComment = asyncHandler(async (req, res) => {
  
    const{commentId}  = req.params

    if(!commentId){
        throw new ApiError(400, "comment Id is required")
    }

    if (!isValidObjectId(commentId)) {
        throw new ApiError(500, `Malformatted comment Id ${commentId}`);
      }



      const comment = await Comment.aggregate([
        {
            $match:{
                _id:new mongoose.Types.ObjectId(commentId)
            }
        }
    ])


    if(comment.length==0) 
        throw new ApiError(404, `there is no such comment`);


        const result = await Comment.findByIdAndDelete(commentId);


        if (!result){
            throw new ApiError(500,"something is wrong while deleting the comment");
        }
        return res.status(200).json(
            new ApiResponse(200, [],"comment deleted successfully")
          )


})

export { 
    addComment, 
    updateComment,
     deleteComment
    }