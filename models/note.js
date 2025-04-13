import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
    title : String,
    content : String,
    position : Number
})

export default mongoose.model('Note',noteSchema)