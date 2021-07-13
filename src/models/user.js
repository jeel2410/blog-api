const mongoose=require('mongoose');
const validator=require('validator');
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const Task =require('./task')


const userschema=mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    age:{
        type:Number,
        default:0,
        validate(value){
            if(value<0){
                throw new Error('age must be positive number ')
            }
        }
    },
    email:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid')
            }
        }
    },
    password:{
        type:String,
        required:true,
        minlength:7,
        trim:true,
        validate(value){
            if(value.toLowerCase(). includes('password')){
                throw new Error('password cannot contain "password"')
            }
        }

    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }],
    avatar:{
        type:Buffer
    }
},{
    timestamps:true
    
})

userschema.virtual('tasks',{
    ref:'Task',
    localField:'_id',
    foreignField:'owner'
})

userschema.methods.toJSON=function(){
    const user=this
    const userobject=user.toObject()

    delete userobject.password
    delete userobject.tokens
    delete userobject.avatar

    return userobject
}

userschema.methods.generateAuthToken=async function(){
    const user=this
    const token=jwt.sign({_id:user._id.toString()},process.env.JWT_SECRET)

    user.tokens=user.tokens.concat({token})

    await user.save()

    return token
}

userschema.statics.findByCredentials=async (email,password)=>{
    const user=await User.findOne({email})
    if(!user){
        throw new Error ('unable to log in')
    }
    const ismatch=await bcrypt.compare(password,user.password)
    if(!ismatch){
        throw new Error('unable to log in')
    }
    return user

}
userschema.pre('remove', async function(next){
    const user=this
    await Task.deleteMany({owner:user._id})


    next()
})
//hash the plain text password before saving
userschema.pre('save',async function(next){
    const user=this 
    if(user.isModified('password')){
        user.password=await bcrypt.hash(user.password,8)

    }
    next()
})

const User=mongoose.model('User',userschema)
module.exports=User