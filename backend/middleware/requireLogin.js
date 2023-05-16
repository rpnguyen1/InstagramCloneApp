const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../keys')
const mongoose = require('mongoose')
const User = mongoose.model('User')

module.exports = (req,res,next)=>{

    //console.log("trying to access page that needs log in")
    const {authorization} = req.headers
    // Authorization === bearer asdflasgoihegowhgwg
    if (!authorization){
        return res.status(401).json({error:"you must be logged in"})
    }
    const token = authorization.replace("Bearer ", "")
    jwt.verify(token,JWT_SECRET,(err,payload)=>{
        if (err){
            return res.status(401),json({error:"you must be logged in"})
        }

        const {_id} = payload
        User.findById(_id).then(userdata=>{
            req.user = userdata
            next() // make sure to process all things before going next
        })
    })
}