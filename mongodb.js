const mongoose= require('mongoose')
const dotenv= require('dotenv');
dotenv.config();
mongoose.connect(process.env.MONGO_URL).then(()=>{
        console.log("connection is successfully")

    })
    .catch((e)=>{
        console.log("connection is failed")

    })
