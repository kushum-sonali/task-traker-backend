const moongoose = require('mongoose');
const taskSchema= new moongoose.Schema({
    title:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        required:true
    },
    time:{
        type:String,
        required:true
    },
    desc:{
        type:String,
        required:true
    },
    completed:{
        type:Boolean,
        
        default:false
    },
    createdBy:{
        type:moongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
   
},{
    timestamps:true

})
module.exports=moongoose.model('Task',taskSchema);
