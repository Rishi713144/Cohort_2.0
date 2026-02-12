const mongoose = require('mongoose');
const express = require('express');
const app = express();

app.use(express.json());
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/test")




const User = mongoose.model('User', {
    name: String,
    email: String,
    password: String
});





app.post("/signup", async function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
        return res.status(400).send("Username already exists");
    }

    const user = new User({
        username: username,
        email: email,
        password: password
    });

    user.save();
    res.json({
        "msg": "User created successfully"
    });
});


app.listen(3000)
