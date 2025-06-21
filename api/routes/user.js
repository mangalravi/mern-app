const express = require("express");
const router = express.Router();
const user = require("../model/user");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Signup Route
router.post("/signup", (req, res) => {
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const newUser = new user({
      _id: new mongoose.Types.ObjectId(),
      username: req.body.username,
      password: hash,
      phone: req.body.phone,
      email: req.body.email,
      userType: req.body.userType,
    });

    newUser
      .save()
      .then((result) => {
        res.status(201).json({
          message: "User created successfully",
          user: result,
        });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ error: err.message });
      });
  }).catch((err) => {
    res.status(500).json({ error: err.message });
  });
});

// Login Route
router.post("/login", (req, res) => {
  user.find({ username: req.body.username })
    .then((users) => {
      if (users.length < 1) {
        return res.status(401).json({ message: "User Not Exist" });
      }

      const foundUser = users[0];

      bcrypt.compare(req.body.password, foundUser.password)
        .then((isMatch) => {
          if (!isMatch) {
            return res.status(401).json({ message: "Auth Failed" });
          }

          const token = jwt.sign(
            {
              username: foundUser.username,
              userType: foundUser.userType,
              email: foundUser.email,
              phone: foundUser.phone,
            },
            "this_is_dummy_secret", // replace with env secret in production
            { expiresIn: "1h" }
          );

          return res.status(200).json({
            message: "Auth Successful",
            token: token,
            username: foundUser.username,
            userType: foundUser.userType,
            email: foundUser.email,
            phone: foundUser.phone,
          });
        })
        .catch((err) => {
          console.error(err);
          res.status(500).json({ error: "Something went wrong" });
        });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.message });
    });
});

module.exports = router;
