

import mongoose from 'mongoose';
import bcrypt from "bcrypt"

const bookHistorySchema = new mongoose.Schema(
  {
    book_id:{
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Book",
      default: null
    },
    reading_status:{
      enum:["pending", "read"]
    },
    from_time:{
      type: Date,
      default : null
    },
    end_time:{
      type: Date,
      default: null
    }
  },
  {timestamps:true,_id:false})

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
  books_history: [bookHistorySchema]
},{timeStamps:true});


userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});


userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};
export const user_model = mongoose.model("user",userSchema)

