import { asyncHandler } from "../utils/AsyncHandler.js"
import {ApiError } from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import { supabase } from "../../lib/supabase_config.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import fs from "fs"




import jwt from "jsonwebtoken";
const registerUser = asyncHandler(async(req,res)=>{
    
const {name ,email,password,mobilenumber} = req.body

console.log(name, email, password, mobilenumber)
//2nd step 
if([name, email, password, mobilenumber].some((field)=>field.trim()==="")){
    throw new ApiError(400,"all fields are required")
}

//3rd 
const existedUser = await User.findOne({
    $or:[
        {email}
    ]
})

if(existedUser){
    throw new ApiError(405,"user already exists")
}

// const { data, error } = await supabase.auth.signInWithOtp({
//     phone: '+13334445555',
//   })
// const signUp = await clerk.signUp.create({
//     phoneNumber
// });

// Prepare phone verification (sends OTP)
// await signUp.preparePhoneNumberVerification({
//     strategy: 'phone_code'
// })[1];



//   if (error) {
//     throw new ApiError(405, error)
//   }



const user = await User.create({
    name,
    email,
    password,
    mobilenumber
})

const createdUser = await User.findById(user._id)


if(!createdUser){
    throw new ApiError(500,"data not found, something went wrong")
}


// return res.status(201).json(
//    new ApiResponse(201, "user Registered successfully and otp sent") 
// )

return res.status(201).json(
    new ApiResponse(201,{user:user._id}, "user Registered successfully and otp sent") 
 )

})


const otpandregistration =  asyncHandler(async(req,res)=>{
    const {mobilenumber,token,userId} = req.body
    
    
    if([mobilenumber,token,userId].some((field)=>field.trim()==="")){
        throw new ApiError(400,"all fields are required")
    }


    const { error } = await supabase.auth.verifyOtp({
        mobilenumber,
        token,
        type: "sms",
      });
    
      if (error) {
        console.error(error);
        throw new ApiError(400,error);
      }

      return res.status(200).json(
        new ApiResponse(200, "user registration successfull") 
     )
})


const loginUser = asyncHandler(
    async(req,res)=>{

const {email,  password} = req.body


//2nd step
if( !password && !email){
    throw new ApiError(400, "password and email are required")
}



const user = await User.findOne({
    $or:[
        {email}
    ]
})


//3rd step 
if(!user ){
    throw new ApiError(404,"user is not found")
}

console.log(user)
console.log(password)
//4th step
const isPasswordValid = await user.isPasswordCorrect(password) 
console.log(isPasswordValid)

if(!isPasswordValid){
    throw new ApiError(401,"Invalid password")
}



//5th step 

 
const accessToken = await user.generateAccessToken()

const refreshToken = await user.generateRefreshToken()


user.refreshToken=refreshToken
await user.save({validateBeforeSave:false })


const loggedInUser= await User.findById(user._id).select("-password -refreshToken") 

if(!loggedInUser){
    throw new ApiError(500,"something went wrong ")
}


 const options = {
    httpOnly:true,
    secure:true,
 }

return res
.status(200)
.cookie("access_token",accessToken,options)
.cookie("refresh_token",refreshToken,options)
.json(
    new ApiResponse(200,{
        user:loggedInUser,
        accessToken,
        refreshToken
    },
"user logged in successfully"
),

)
    }
)




const logoutUser= asyncHandler(async(req,res)=>{



   const user = await User.findByIdAndUpdate(
    req.user._id,{
        $unset:{
            refreshToken: 1 //  this remove refresh token value 
        }
    },{
        new:true
    }

   )

   if(!user){
    console.log("no user found for logout ")
   }

   const options={
    httpOnly:true,
    secure:true
   }

   return res
   .status(200)
   .clearCookie("access_token",options)
   .clearCookie("refresh_token",options)
   .json(
    new ApiResponse(200,{},"user logged out ")
   )

   
})



const refreshAccessToken =asyncHandler(
    async(req,res)=>{
   
        const incomingRefreshToken =req.cookies.refresh_token
        if(!incomingRefreshToken){
            throw new ApiError(401,"unauthorized request")
        }

        const decodedToken = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)


        const user = await User.findById(decodedToken?._id)

        if(!user){
            throw new ApiError(401,"Invalid refresh token")
        }


        if(incomingRefreshToken!= user.refreshToken){
            throw new ApiError(401,"Refresh Token is expire")
        }



         
const accessToken = await user.generateAccessToken()

const refreshToken = await user.generateRefreshToken()


user.refreshToken=refreshToken
await user.save({validateBeforeSave:false })

const options={
    httpOnly:true,
    secure:true
   }
return res
.status(200)
.cookie("access_token",accessToken,options)
.cookie("refresh_token",refreshToken,options)
.json(
    new ApiResponse(
        200,{
        accessToken:accessToken,
        refreshToken:refreshToken,},
        "access token updated "
    )
)

    }
)

// const changeCurrentPassword = asyncHandler(
//     async(req,res)=>{
//         const {oldPassword,newPassword,confirmPassword} =req.body

//         if(newPassword != confirmPassword){
//             throw new ApiError(401,"confirmPassword isn't match with newpassword")
//         }


//         const user = await User.findById(req.user._id)

//         const isPasswordCorrect= await user.isPasswordCorrect(oldPassword)

//         if(!isPasswordCorrect){
//             throw new ApiError(401,"Invalid old Password")
//         }

//         user.password = newPassword
//         await user.save({validateBeforeSave:false })


//         return res
//         .status(200)
//         .json(
//             new ApiResponse(200,{},"password updated successfully")
//         )


//     }
// )


const getCurrentUser = asyncHandler(
    async(req,res)=>{
        return res
        .status(200)
        .json(
            new ApiResponse(200,req.user,"current user fetched")
        )
    }
)



const updateBio = asyncHandler(
    async(req,res)=>{


          const{bio}= req.body

          if(!bio ){
            throw new ApiError(400, "bio required")
          }


         const user =  await User.findByIdAndUpdate(
            req.user._id,
            {

                $set:{
                    bio:bio
                }
            },{
                new:true
            }
          ).select("-password -refreshToken ")
          if(!user){
            throw new ApiError(500,"something went wrong in server") 
          }

          return res
          .status(200)
          .json(
            new ApiResponse(200, user, "Account details updated successfully")
          )
    }
)


const updateName = asyncHandler(
    async(req,res)=>{
          const{name}= req.body

          if(!name ){
            throw new ApiError(400, "name required")
          }


         const user =  await User.findByIdAndUpdate(
            req.user._id,
            {
                $set:{
                    name:name
                }
            },{
                new:true
            }
          ).select("-password -refreshToken ")
          if(!user){
            throw new ApiError(500,"something went wrong in server") 
          }

          return res
          .status(200)
          .json(
            new ApiResponse(200, user, "Account details updated successfully")
          )
    }
)

const updateUserProfileImage = asyncHandler(
    async(req,res)=>{
        const file =  req.file
        console.log(file)
       if(!file){
        throw new ApiError(404,"avatar file is not send")
       }

       const fileName = `${Date.now()}_${file.originalname}`
       const { data, error } = await supabase.storage
       .from('pdf')
       .upload(fileName, file.buffer, {
        contentType: file.mimetype,
      });



      console.log(error)
      const { data: { publicUrl } } = supabase.storage
      .from('pdf')
      .getPublicUrl(fileName);

      fs.unlinkSync(req.file.path)

      
    //    const profileimageurl = await uploadOnSupabase(avatarLocalPath,req.files?.avatar[0])

    //    if(!profileimageurl){
    //     throw new ApiError(500,"Error while uploading avatar on cloudinary")
    //    }


       const user =  await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                profileImage:publicUrl
            }
        },{
            new:true
        }
      ).select("-password -refreshToken ")

      if(!user){
        throw new ApiError(500,"something went wrong in server") 
      }

      return res
      .status(200)
      .json(
        new ApiResponse(200, user, "avatar file uploaded successfully")
      )

    }   
)









 




export {
    registerUser,loginUser,logoutUser,
    refreshAccessToken,
    getCurrentUser ,
    otpandregistration,updateName, updateBio,
    updateUserProfileImage


}