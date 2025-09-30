import dotenv from 'dotenv';
import connectDB from "./db/index.js";
import  app  from "./app.js";
import { mongo } from 'mongoose';

//import express from 'express'; /// app.js e pathano hoise

dotenv.config({
    path: './.env',
});

//const app = express(); /// app.js e pathano hoise

//app.listen(process.env.PORT, () => {
//    console.log(`Server is running on port ${process.env.PORT}`);
//});

connectDB()
  .then(() => {
    app.listen(process.env.PORT||3000, () => {
      console.log(`listening on port ${process.env.PORT}`);
    });
  })
  .catch(
    (error)=>{
        console.log("mongoDB connection failed !!!", error)
    }
    // console.error("Error:", e)
  );


/*
  //IIFE
  ;(
        async () => {
            try {
                await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`)
                console.log('Database connected successfully');
                app.on('error', (err) => {
                    console.error('Error occurred:', err);
                    throw err; // Re-throw the error to stop the server from running
                })
                app.listen(process.env.PORT || 3000, () => {
                    console.log(`Server is running on port ${process.env.PORT || 3000}`);
                })
            } catch (error) {
                console.error('Database connection failed:', error);
                throw error; // Re-throw the error to stop the server from running
            }
        }
  )
  ();

  */