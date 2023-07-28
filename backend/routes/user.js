const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin = require('../middleware/requireLogin')
const Post = mongoose.model("Post")
const User = mongoose.model("User")

// router.get('/user/:id', requireLogin, async (req,res)=>{
//     console.log("Attempting to get User")
//     User.findOne({_id:req.params.id})
//     .select("-password")
//     .then(user=>{
//         return Post.find({postedBy:req.params.id})
//         .populate("postedBy", "_id name")
//         .exec()
//     })
//     .then(posts => {
//         console.log("user is " + user)
//         return res.json({user,posts});
//     })
//     .catch(err=>{
//         if (err.name === "CastError") {
//             // If the provided ID is not valid
//             return res.status(404).json({ error: "Invalid user ID" })
//           }
//           // Handle other errors, such as when the user is not found
//           return res.status(404).json({ error: "User not found" })
//         })
// })


// router.get('/user/:id', (req,res)=>{
//     User.findOne({_id:req.params.id})
//     .select("-password")
//     .then(user=>{
//         Post.find({postedBy:req.params.id})
//         .populate("postedBy", "_id name")
//         .exec((err,posts)=>{
//             return res.status(422).json({error:err})
//         })
//         res.json({user,posts})
//     }).catch(err=>{
//         return res.status(404).json({error:"User not found"})
//     })
// })

router.get('/user/:id', requireLogin, (req, res) => {
const userPromise = User.findOne({ _id: req.params.id }).select("-password").exec();
const postsPromise = Post.find({ postedBy: req.params.id }).populate("postedBy", "_id name").exec();

Promise.all([userPromise, postsPromise])
    .then(([user, posts]) => {
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    return res.json({ user, posts });
    })
    .catch(err => {
    if (err.name === "CastError") {
        // If the provided ID is not valid
        return res.status(404).json({ error: "Invalid user ID" });
    }
    // Handle other errors
    return res.status(500).json({ error: "Server error" });
    });
});

  
  
  
  


module.exports = router