
import fs from "fs"
import { supabase } from "../../lib/supabase_config.js"
const uploadOnSupabase = async(localFilePath,file)=>{
    try{
        if(!localFilePath) return null
     console.log("hiisfasdfsdf")
        console.log(file)
        
    const fileName = `${Date.now()}-${file.originalname}`;
    print(fileName)
    const fileBuffer = fs.readFileSync(localFilePath)
    console.log(fileBuffer)
    // Upload to Supabase
    const { data, error } = await supabase.storage
      .from('hackathon')
      .upload(fileName, fileBuffer, {
        contentType: file.mimetype,
        upsert: false
      });

      if(error){
        console.log("error", error)
      }
      const { data: { publicUrl } } = supabase.storage
      .from('hackathon')
      .getPublicUrl(fileName);

      console.log(publicUrl,"oke fine upload ")
    


    fs.unlinkSync(localFilePath)
         
    return publicUrl

    }
    catch(err){
            // fs.unlinkSync(localFilePath)
            return null;
    }
}

export {uploadOnSupabase}