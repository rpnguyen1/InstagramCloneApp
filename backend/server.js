const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const cors = require("cors")
const app = express();
const uri = "mongodb+srv://nguyenprichard:mernstack@cluster0.709vmnp.mongodb.net/?retryWrites=true&w=majority";
const PORT = 5000


require('./models/user')
require('./models/post')


app.use(express.json()); // middle ware!!
app.use(cors())


app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))


mongoose.model("User")

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.log(error));

// mongoose.connect(uri)
// mongoose.connection.on('connected', ()=>{
//   console.log("connected to mongo yearaehhah")
// })
// mongoose.connection.on('error', (err)=>{
//   console.log("err connecting",err)
// })


// const userSchema = new mongoose.Schema({
//     username: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     password: {
//       type: String,
//       required: true,
//     },
//   });

//   userSchema.pre("save", async function (next) {
//     const user = this;
  
//     if (!user.isModified("password")) {
//       return next();
//     }
  
//     const salt = await bcrypt.genSalt(10);
//     user.password = await bcrypt.hash(user.password, salt);
//     next();
//   });

//   const User = mongoose.model("User", userSchema);

//   app.post("/register", async (req, res) => {
//     const user = new User({
//       username: req.body.username,
//       password: req.body.password,
//     });
  
//     try {
//       await user.save();
//       res.send("User created successfully");
//     } catch (error) {
//       console.log(error);
//       res.send("Error creating user");
//     }
//   });
  
//   app.post("/login", async (req, res) => {
//     const user = await User.findOne({ username: req.body.username });
  
//     if (!user) {
//       return res.send("Username not found");
//     }
  
//     const validPassword = await bcrypt.compare(req.body.password, user.password);

//     if (!validPassword) {
//         return res.send("Invalid password");
//     }

//     res.send("Login successful");
// });

app.listen(PORT, () => console.log("Server running on port", PORT));