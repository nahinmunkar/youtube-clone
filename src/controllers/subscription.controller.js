import mongoose,{isValidObjectId} from "mongoose";
import {User} from "../models/user.model.js"
// import {Subcription} from "../models/subscription.model.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {ApiError} from "../utils/ApiError.js"
import { asyncHandler } from "../utils/AsyncHandler.js";
// import { response } from "express";



const toggleSubscription = asyncHandler(async (req, res) => {
   
    /*
    1.req.user._id
    2. channelId
    3) channelid , ami user --->subscribe? 
    4) if ---> no----> subscribe
    5) if---->yes --->unsubscribe
      
    */

    const {channelId} = req.params

    if(!channelId){
        throw new ApiError(400,"channelId is required")
    }


    if(!isValidObjectId(channelId)){
        throw new ApiError(500,"malformated channelId")
    }


   const subscriberExists=  await Subscription.aggregate([
        {
            $match:{
                subscriber: new mongoose.Types.ObjectId(req.user._id) ,
                channel: new mongoose.Types.ObjectId(channelId)  
            }
        }
    ])
 
   console.log(subscriberExists)

    if(subscriberExists.length==0){
        //subscribe 
       const newSubscription=  await Subscription.create({
            subscriber:req.user._id,
            channel:channelId
        })

        if(!newSubscription){
            throw new ApiError(500,"error while creating subscription")
        }
        return res.status(201).json(
            new ApiResponse(201,newSubscription,"successfully subscribed")
        )


    }
    else{
        //unsubscribe 

        const rmSubscription = await Subscription.findByIdAndDelete(subscriberExists[0]._id)
    
        if(!rmSubscription){
            throw new ApiError(500,"error while unsubscribe")
        }

        return res.status(200).json(
            new ApiResponse(201,[],"successfully unsubscribed")
        )

    
    }

})



//we will get all the subscriber of this channel id
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params

    if(!channelId){
        throw new ApiError(400,"channelId is required")
    }


    if(!isValidObjectId(channelId)){
        throw new ApiError(500,"malformated channelId")
    }


    const findChannel = await User.findById(channelId)

    if(!findChannel){
        res.status(404).json(new ApiResponse(404,{},`channel with ${channelId} is not found`))
    }



   const allSubscriber=  await Subscription.aggregate([
        {
            $match:{
               channel: new mongoose.Types.ObjectId(channelId) ,
            }
        },
        {
            $project:{
                subscriber:1
            }


        }
    ])

    if(!allSubscriber){
        throw new ApiError(500,"error while getting all subscribers")
    }

    return res.status(200).json(
        new ApiResponse(200,allSubscriber,"successfully get all the subscriber")
    )



   
})




// a user subscribed how many channel 
const getSubscribedChannels = asyncHandler(async (req, res) => {
    

    const {subscriberId} = req.params

    if(!subscriberId){
        throw new ApiError(400,"subscriberId is required")
    }


    if(!isValidObjectId(subscriberId)){
        throw new ApiError(500,"malformated subscriberId")
    }


    const findSubscriber = await User.findById(subscriberId)

    if(!findSubscriber){
        res.status(404).json(new ApiResponse(404,{},`subscriber is not found`))
    }



    const allChannel=  await Subscription.aggregate([
        {
            $match:{
               subscriber: new mongoose.Types.ObjectId(subscriberId) ,
            }
        },
        {
            $project:{
                channel:1
            }


        }
    ])

    if(!allChannel){
        throw new ApiError(500,"error while getting all subscribed channels")
    }

    return res.status(200).json(
        new ApiResponse(200,allChannel,"successfully get all subscribed channels")
    )



    
})


export {toggleSubscription,getUserChannelSubscribers,getSubscribedChannels}
