import mongoose from "mongoose";

export default ()=>{
     mongoose.connect(process.env.MONGO_URL)
    .then(()=>console.log("MongoDB Connected"))
    .catch((error)=>console.log("Mongodb error",error))
} 