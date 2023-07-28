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

router.put('/follow', requireLogin, async (req, res) => {
    try {
      const updatedFollowId = await User.findByIdAndUpdate(
        req.body.followId,
        { $addToSet: { followers: req.user._id } },
        { new: true }
      ).exec();
  
      const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        { $addToSet: { following: req.body.followId } },
        { new: true }
      ).select("-password");
  
      res.json(updatedUser);
    } catch (err) {
      res.status(422).json({ error: err.message });
    }
});
  
router.put('/unfollow', requireLogin, async (req, res) => {
    try {
      const updatedFollowId = await User.findByIdAndUpdate(
        req.body.unfollowId,
        { $pull: { followers: req.user._id } },
        { new: true }
      ).exec();
  
      const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        { $pull: { following: req.body.unfollowId } },
        { new: true }
      ).select("-password");
  
      res.json(updatedUser);
    } catch (err) {
      res.status(422).json({ error: err.message });
    }
});

// router.put('/unfollow',requireLogin,(req,res)=>{
//     User.findByIdAndUpdate(req.body.unfollowId,{
//         $pull:{followers:req.user._id}
//     },{
//         new:true
//     },(err,result)=>{
//         if(err){
//             return res.status(422).json({error:err})
//         }
//       User.findByIdAndUpdate(req.user._id,{
//           $pull:{following:req.body.unfollowId}
          
//       },{new:true}).select("-password").then(result=>{
//           res.json(result)
//       }).catch(err=>{
//           return res.status(422).json({error:err})
//       })

//     }
//     )
// })
  
/*
router.put("/like",requireLogin, async (req,res)=>{
    try {
        const result = await Post.findByIdAndUpdate(
          req.body.postId,
          {
            $addToSet: { likes: req.user._id }
          },
          {
            new: true
          }
        )
        .populate("comments.postedBy","_id name")
        .populate("postedBy", "_id name")
        .exec();
    
        res.json(result);
    } catch (err) {
    res.status(422).json({ error: err.message });
    }
});
*/


module.exports = router