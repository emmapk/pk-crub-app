const express = require("express");
const router = express.Router();
const User = require("../models/users.js");
const multer = require("multer");

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public");
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    }
});

// File Upload Middleware
const upload = multer({
    storage: storage,
}).single("image");

// Route to insert a user into the database
router.post("/add", upload, async (req, res) => {
    try {
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            image: req.file.filename // Use filename to save the actual uploaded file name
        });

        // Save user to the database
        await user.save();

        // Set success message in session
        req.session.message = {
            type: "success",
            message: "User added successfully"
        };

        // Redirect to home page
        res.redirect("/");
    } catch (err) {
        // Handle errors and send response
        res.json({ message: err.message, type: "danger" });
    }
});

router.get("/", (req, res) => {
    User.find()
        .then(users => {
            res.render("index", {
                title: "Home Page",
                users: users
            });
        })
        .catch(err => {
            res.json({ message: err.message });
        });
});


// Route to render home page
router.get("/", (req, res) => {
    res.render("index", { title: "Home Page" });
});

// Route to render add user page
router.get("/add", (req, res) => {
    res.render("add_users", { title: "Add Users" });
});

// Edit an user route

route.get("/edit/:id", (req, res) => {
    
})

module.exports = router;
