import {Router} from "express"
// import { registerUser,loginUser,logoutUser,} from "../controllers/user.controllers.js"
import {upload} from "../middlewares/multer.middleware.js"

import {
    registerUser,loginUser,logoutUser,
    refreshAccessToken,
    getCurrentUser ,
    otpandregistration,updateName, updateBio,
    updateUserProfileImage
    
} from "../controllers/user.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"


const router = Router()

// upload.fields([
//     {
//         name:"avatar",
//         maxCount:1
//     }
// ])
router.route("/register").post(
    registerUser)
    
    router.route("/login").post(loginUser)
    router.route("/logout").post(verifyJWT,logoutUser)
    router.route("/refreshAccessToken").post(refreshAccessToken)
    // router.route("/change-password").patch(verifyJWT,changeCurrentPassword)
    router.route("/otp-registration").post( otpandregistration)
    router.route("/updateName").patch(verifyJWT,updateName)
    router.route("/updateBio").patch(verifyJWT,updateBio)
router.route("/get-current-user").get(verifyJWT,getCurrentUser)
router.route("/updateUserProfileImage")
.patch(verifyJWT,
    upload.single("avatar")
,updateUserProfileImage)

export default router 