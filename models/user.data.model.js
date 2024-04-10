import mongoose from 'mongoose';

const userAuthSchema=new mongoose.Schema({
    firstName:{
        type:String,
        require:true,
    },
    lastName:{
        type:String,
        require:true,
    },
    password:{
        type:String,
        require:true
    },
    mobileNumber:{
        type:String,
        require:true,
        length:10,
    },
    email:{
        type:String,
        require:true,
        
    },
})

const userAuth = mongoose.model('UserAuth',userAuthSchema);

export default userAuth;