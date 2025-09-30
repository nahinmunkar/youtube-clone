import express from 'express';
import cors from 'cors';
import userRouter from "./routes/users.route.js"
// import videoRouter from "./routes/video.route.js"
// import subcriptionRouter from "./routes/subscription.route.js"
// import commentsRouter from "./routes/comment.route.js"
import cookieParser from"cookie-parser"
// import { ClerkExpressWithAuth} from '@clerk/clerk-sdk-node';
const app = express()

app.use(cors({
    origin : "*",
    // origin : process.env.CORS_ORIGIN || "http://localhost:5173", //this can be used to restrict the origin

    credentials:true
}
))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended:true, limit:"16kb" }))
app.use(express.static("public"));
app.use(cookieParser())
            
           

app.use("/api/v1/users",userRouter)
// app.use("/api/v1/video",videoRouter)
// app.use("/api/v1/subcription",subcriptionRouter)
// app.use("api/v1/comments",commentsRouter)
            
            
export default app