const express=require('express')
require('./db/mongoose')
const UserRouter=require('./routers/user')
const BlogRouter=require('./routers/blog')
const OwnerRouter=require('./routers/owner')
const app=express()

app.use(express.json())
app.use(UserRouter)
app.use(BlogRouter)
app.use(OwnerRouter)

module.exports=app




