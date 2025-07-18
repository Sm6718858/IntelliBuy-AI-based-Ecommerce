import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    address:{
        type:String,
    },
    role:{
        type:Number,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    answer:{
        type:String,
        required:true
    },
    createdAt: {
        type: Date,
        default: Date.now
      }
})

const Ecom_User = mongoose.model("User",userSchema);
export default Ecom_User;