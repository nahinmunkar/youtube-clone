import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/likes.model.js"
import {Video} from "../models/video.model.js"
import{Comment} from "../models/comments.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/AsyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params


    if(!videoId){
        throw new ApiError(400, "video Id is required")
    }
    if (!isValidObjectId(videoId)) {
        throw new ApiError(500, `Malformatted video id ${videoId}`);
      }


      const videoAvail = await Video.aggregate([
        {
            $match:{
                _id:new mongoose.Types.ObjectId(videoId)
            }
        }
    ])


    if(videoAvail.length==0) 
        throw new ApiError(404, `there is no such videid`);


        const like = await Like.aggregate([
            {
                $match:{
                    video:new mongoose.Types.ObjectId(videoId),
                    likedBy:new mongoose.Types.ObjectId(req.user._id)
                }
            }
        ])

        if(like.length==0){
            const result = await Like.create({
                video: videoId,
               comment:null,
                
                likedBy:req?.user?._id
            })

            if(!result){
                throw new ApiError(500, "something is wrong while giving like in video")
            }

            return res.status(201).json(
                new ApiResponse(201,result, "successfully likes video")
               )
    
        }

        else{
            const likeId= like[0]._id
            const result = await Like.findByIdAndDelete(likeId)

            if(!result){
                throw new ApiError(500, "something is wrong while unliking the video")
            }

            return res.status(200).json(
                new ApiResponse(200,[], "successfully unlike the video")
               )

        }

})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params

    if(!commentId){
        throw new ApiError(400, "comment Id is required")
    }
    if (!isValidObjectId(commentId)) {
        throw new ApiError(500, `Malformatted comment id ${commentId}`);
      }


      const commentAvail = await Comment.aggregate([
        {
            $match:{
                _id:new mongoose.Types.ObjectId(commentId)
            }
        }
    ])


    if(commentAvail.length==0) 
        throw new ApiError(404, `there is no such comment`);


        const like = await Like.aggregate([
            {
                $match:{
                    comment:new mongoose.Types.ObjectId(commentId),
                    likedBy: new mongoose.Types.ObjectId(commentId),
                }
            }
        ])

        if(like.length==0){
            const result = await Like.create({
                comment: commentId,
                video:null,
                likedBy:req?.user?._id
            })

            if(!result){
                throw new ApiError(500, "something is wrong while giving like in comment")

            }

            return res.status(200).json(
                new ApiResponse(200,result, "successfully likes video")
               )
    
        }

        else{
            const likeId= like[0]._id
            const result = await Like.findByIdAndDelete(likeId)

            if(!result){
                throw new ApiError(500, "something is wrong while unliking the comment")
                
            }


            return res.status(200).json(
                new ApiResponse(200,[], "successfully unlike the comment")
               )

        }
})



const getLikedVideos = asyncHandler(async (req, res) => {
   

    const like = await Like.aggregate([
        {
            $match:{
                likedBy :new mongoose.Types.ObjectId(req?.user?._id),
                comment:null,
               
            }
        }
    ])


    if(!like){
        throw new ApiError(500, "something is wrong while getting all liked video")

    }

    return res.status(200).json(
        new ApiResponse(200,like, "successfully fetched all the liked videos")
    )

})

export {
    toggleCommentLike,
    toggleVideoLike,
    getLikedVideos
}