import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"


const userSchema =new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
        index:true,
    },
   
    profileImage:{
        type:String,
    },
    mobilenumber:{
        type:String,
        required: true,
    }
    ,
    // allPost:[
    //     {
    //         type:mongoose.Schema.Types.ObjectId,
    //         ref:"Post"
    //     }
    // ],
    password:{
        type:String,
        required:[true,"password is required"]
    },
    role: {
        type: String,
        enum: ['normal', 'banned', 'admin'],
        default: 'normal'
      },
      bio:{
        type:String
      },
    refreshToken:{
        type:String
    }
},{
   timestamps:true 
})

userSchema.pre("save",async function(next){
    console.log("password1")
    if(!this.isModified("password")) return next()

        console.log("password2")
        console.log(this.password)
      this.password= await bcrypt.hash(this.password, 10)
      console.log(this.password)
      next()

})

userSchema.methods.isPasswordCorrect = async function (password){
   return  await bcrypt.compare(password,this.password,)
}




userSchema.methods.generateAccessToken =function(){
    return jwt.sign(
        {
            //payload:
            _id:this._id,
            email:this.email,
            name:this.name,
           
        },
        //access token secret
        process.env.ACCESS_TOKEN_SECRET
        
        ,
        {
           expiresIn: process.env.ACCESS_TOKEN_EXPIRY
            //expiry 
        }
    )
}


userSchema.methods.generateRefreshToken =function(){
    return jwt.sign(
        {
            //payload:
            _id:this._id,
           
        },
        //access token secret
        process.env.REFRESH_TOKEN_SECRET
        
        ,
        {
           expiresIn: process.env.REFRESH_TOKEN_EXPIRY
            //expiry 
        }
    )
}
export const User = mongoose.model('User',userSchema)