const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const requireLogin = require('../middleware/requireLogin')
const Post = mongoose.model("Post")


router.get('/allpost',requireLogin,(req,res)=>{
    Post.find() //no conditions to get all posts
    .populate("postedBy", "_id name")
    .populate("comments.postedBy", "_id name")
    .then(posts=>{
        res.json(posts)
    })
    .catch(err=>{
    console.log(err)
    })
})


router.post('/createpost', requireLogin, (req,res)=>{
    const {title,body,pic} = req.body
    if(!title || !body || !pic){
        return res.status(422).json({error:"Please add all the fields"})
    }
    //console.log(req.user)
    //res.send("ok")

    req.user.password = undefined
    const post = new Post({
        title,
        body,
        photo:pic,
        postedBy:req.user
    })
    post.save().then(result=>{
        res.json({post:result})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.get("/mypost",requireLogin, (req,res)=>{   // posts of user who is logged in
    Post.find({postedBy:req.user._id})
    .populate("postedBy", "_id name")
    .then(mypost=>{
        res.json({mypost})
    })
    .catch(err=>{
        console.log(err)
    })
})

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

router.put("/unlike",requireLogin, async (req,res)=>{

    try {
        const result = await Post.findByIdAndUpdate(
          req.body.postId,
          {
            $pull: { likes: req.user._id }
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

})

router.put("/comment",requireLogin, async (req,res)=>{
    const comment = {
        text:req.body.text,
        postedBy:req.user._id
    }
    try {
        const result = await Post.findByIdAndUpdate(
          req.body.postId,
          {
            $push: { comments: comment}
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


router.delete('/deletepost/:postId',requireLogin, async (req,res)=>{

    Post.findOne({ _id: req.params.postId })
    .populate("postedBy", "_id")
    .then(post => {
      if (!post) {
        return res.status(422).json({ error: "Post not found" });
      }
  
      if (post.postedBy._id.toString() === req.user._id.toString()) {
        return post.deleteOne()
          .then(result => {
            res.json(result);
          })
          .catch(err => {
            console.log(err);
            res.status(500).json({ error: "Error removing post" });
          });
      } else {
        res.status(401).json({ error: "Unauthorized to remove post" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "Error finding post" });
    });
    // Post.findOne({_id:req.params.postId})
    // .populate("postedBy" , "_id")
    // .exec((err,post)=>{
    //     if(err || post){
    //         return res.status(422).json({error:err})
    //     }
    //     if(post.postedBy._id.toString() === req.user._id.toString()){
    //         post.remove()
    //         .then(result=>{
    //             res.json(result)
    //         }).catch(err=>{
    //             console.log(err)
    //         })
    //     }
    // })
})

module.exports = router