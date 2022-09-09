const mongoose=require('mongoose');
const blogSchema= new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true

    },
    snippet:{
        type:String
    },
    description:{
        type:String
    },
    tags:{
        type:String
    },
    category:{
        type:String
    },

    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    imageurl:{
        type:String
    }
},{
    timestamps:true
})
const Blog=mongoose.model('Blog',blogSchema)


module.exports=Blog;