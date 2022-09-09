const express=require('express')
const router=new express.Router()
const Blog=require('../models/blog')
const auth=require('../middleware/auth')

router.post('/blogs',auth, async(req,res)=>{
   // const task=new Task(req.body)
   const blog=new Blog({
       ...req.body,
       owner:req.user._id
   }) 
    try{
        await blog.save()
        res.status(201).send(blog)

    }catch (e){
        res.status(404).send()

    }
})
router.get('/blogs', async (req,res)=>{

    try{
       const blog= await Blog.find({})
       
        res.send(blog)

    }catch(e){
        res.status(500).send()

    }
})

router.get('/blogs/:id',async(req,res)=>{
    const _id=req.params.id

    try{
        
        const blog=await Blog.findOne({_id})
        if(!blog){
            return res.status(404).send()
        }
        res.send(blog)

    }catch(e){
        res.status(500).send()

    }
    
})

router.patch('/blogs/:id',auth,async(req,res)=>{
    const updates =Object.keys(req.body)
    const allowedUpdates=['title','snippet','description','tags','category']
    const isValidOperation=updates.every((update)=>allowedUpdates.includes(update))

    if(!isValidOperation){
         return res.status(500).send({error: 'invalid updates'})
    }
    try{
        const blog=await Blog.findOne({_id:req.params.id,owner:req.user._id})

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

router.delete('/blogs/:id',auth,async(req,res)=>{
    try{
        
        const blog=await Blog.findOneAndDelete({_id:req.params.id,owner:req.user._id})
        if(!blog){
            res.status(404).send()
        }
        res.send(blog)

    }
    catch(e){
        res.status(500).send()

    }
})

module.exports=router