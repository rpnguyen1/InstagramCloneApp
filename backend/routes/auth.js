const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const {JWT_SECRET} = require('../keys')

const requireLogin = require('../middleware/requireLogin')
// create routes

router.get('/', (req,res)=>{
    res.send("Hello")
})

// testing purposes
// router.get('/protected',requireLogin, (req,res)=>{  // use the middleware
//     res.send("Hello user")
// })

router.post('/signup', (req,res)=>{
    console.log(req.body.name);
    console.log(req.body.password);
    const {name,email,password} = req.body
    if(!email || !password || !name){
        return res.status(422).json({error: "Please add all the fields"})
    }
    //res.json({message:"sucessfully posted"})

    User.findOne({email:email})
    .then((savedUser)=>{
        if(savedUser){
            return res.status(422).json({error: "user already exists with that email"})
        }// bigger number, more secure
        bcrypt.hash(password,12) 
        .then(hashedpassword=>{
            const user = new User({
                email,
                password:hashedpassword,
                name
            })
    
            user.save()
            .then(user=>{
                console.log("success!!");
                console.log(req.body.name);
                console.log(req.body.password);
                res.json({message:"saved sucessfully"})
            })
            .catch(err=>{
                console.log("Error:", err)
            })
        })


    })
    .catch(err=>{
        console.log("Error",err)
    })
})

router.post('/signin',(req,res)=>{
    const {email,password} = req.body;
    if(!email || !password){
        return res.status(422).json({error:"Please provide email or password"})
    }
    User.findOne({email:email}) // search for user by email
    .then(savedUser=>{
        if(!savedUser){
            return res.status(422).json({error:"Invalid email or password"})
        }
        bcrypt.compare(password,savedUser.password)
        .then(doMatch=>{
            if(doMatch){
                //res.json({message:"Successfully signed in"})

                const token = jwt.sign({_id:savedUser._id}, JWT_SECRET)
                const { _id, name, email, followers, following} = savedUser
                res.json({token,user:{_id,name,email, followers, following}})

            }
            else{ // same error so you cant know if email or password is wrong
                return res.status(422).json({error:"Invalid email or password"}) 
            }
        })
        .catch(err=>{
            console.log(err)
        })

    })
})

module.exports = router