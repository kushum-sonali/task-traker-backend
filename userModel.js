const mongoose= require('mongoose')
const userSchema= new mongoose.Schema({
    fullName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        // required:true,
        verified:false
    },
    phone:{
        type:Number,
        // required:true,
    },
    password:{
        type:String,
        // required:true
        
    },
    isGoogleSignin:{
        type:Boolean,
        default:false
    },
    firebaseId:{
    type:String,
    required:false
    }
},{
    timestamps:true
})
module.exports=mongoose.model('User',userSchema);