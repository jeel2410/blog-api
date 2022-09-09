const express=require('express')
const router=new express.Router()
const Blog=require('../models/blog')
const oauth=require('../middleware/oauath')


router.patch('/owner/blogs/:id',oauth,async(req,res)=>{
    const updates =Object.keys(req.body)
    const allowedUpdates=['title','snippet','description','tags','category']
    const isValidOperation=updates.every((update)=>allowedUpdates.includes(update))

    if(!isValidOperation){
         return res.status(500).send({error: 'invalid updates'})
    }
    try{
        const blog=await Blog.findOne({_id:req.params.id})

        //const task=await Task.findByIdAndUpdate(req.params.id)
        
        if(!blog){
          return res.status(404).send()
        }
        updates.forEach((update)=>task[update]=req.body[update])
        await blog.save()

        res.send(blog)

    }catch (e){
        res.status(500).send()

    }
})

router.delete('/owner/blogs/:id',oauth,async(req,res)=>{
    try{
        
        const blog=await Blog.findOneAndDelete({_id:req.params.id})
        if(!blog){
            res.status(404).send("sorry no task found")
        }
        res.send(blog)

    }
    catch(e){
        res.status(500).send()

    }
})

module.exports=router