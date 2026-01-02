import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    fullName :{
        type : String,
        required : true
    },
    email :{
        type : String,
        required : true,
        unique :true
    },
    password :{
        type : String,
        
    },
    mobile : {
        type : String,
        required : true
    },

    role : {
        type : String,
        enum : ["user" , "owner" , "deliveryBoy" , "superadmin"],
        required : true
    },

    resetOtp :{
    type :String
    },
isOtpVerified:{
    type : Boolean,
    default : false
},
otmpExpires  :{
    type : Date
}
}

,{timestamps : true})

const User = mongoose.model("User" , UserSchema);

export default User;