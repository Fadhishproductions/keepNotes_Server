import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String },  
  googleId: { type: String }, 
});

export default mongoose.model('User', userSchema);
