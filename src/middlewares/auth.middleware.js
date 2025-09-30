import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.access_token ||
    req.header("Authorization").replace("Bearer ", "");

    console.log(token,"token");

  if (!token) {
    throw new ApiError(401, "Unauthorized request");
  }

  const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  console.log(decodedToken);
 
  const user = await User.findById(decodedToken?._id).select(
    "-password -refreshToken"
  );
  console.log("hellloooo")


  if (!user) {
    throw new ApiError(401, "Invalid access token");
  }

  req.user = user;
  next()
 
  //we add a rew object in the req 
});