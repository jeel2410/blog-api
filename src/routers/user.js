const express=require('express')
const router=new express.Router()
const User=require('../models/user')
const auth=require('../middleware/auth')
const multer=require('multer')
const sharp=require('sharp')

router.post('/users', async(req,res)=>{
    const user=new User (req.body)

    try{
        await user.save()
        
        const token= await user.generateAuthToken()
        res.status(201).send({user,token})
    }
    catch (e){
        res.status(500).send(e)
    }

})
router.post('/users/login',async (req,res)=>{
    try{
        const user=await User.findByCredentials(req.body.email , req.body.password)
        const token=await user.generateAuthToken()
        res.send({user,token})

    }catch(e){
        res.status(400).send()

    }


})

router.post('/users/logout',auth,async(req,res)=>{
    try{
        req.user.tokens=req.user.tokens.filter((token)=>{
            return token.token!=req.token
        })
        await req.user.save()
        res.send()

    }catch(e){
        res.status(500).send()

    }
})
router.post('/users/logoutAll',auth,async(req,res)=>{
    try{
        req.user.tokens=[]
        req.user.save()
        res.send()

    }catch(e){
        res.status(500).send()

    }
})
router.get('/users/me',auth, async (req,res)=>{
    res.send(req.user)
})

router.patch('/users/me',auth,async(req,res)=>{
    const Update =Object.keys(req.body)
    const allowupdate=['name','email','password','age']
    const isvalidOperation=Update.every((update)=>allowupdate.includes(update))
    
    if(!isvalidOperation){
       return  res.status(500).send({error: 'invalid updates'})
    }


    try{
        Update.forEach((update)=>req.user[update]=req.body[update])
        await req.user.save()
        res.send(req.user)
    }catch(e){
        res.status(500).send()

    }
})

router.delete('/users/me',auth, async(req,res)=>{
    try{
        await req.user.remove()
        sendCancelationEmail(req.user.email,req.user.name)
        res.send(req.user)

    }catch (e){
        res.status(500).send()

    }

})

module.exports=router