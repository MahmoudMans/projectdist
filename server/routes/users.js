// routes/users.js
const express = require("express");
const passport = require("passport");
const User = require("../models/User");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const user = new User({ username, password });
    await user.save();

    req.login(user, (err) => {
      if (err) return res.status(500).json({ message: "Login failed" });

      return res.status(201).json({ message: "Registration successful" });
    });
  } catch (error) {
    return res.status(500).json({ message: "Registration failed" });
  }
});

router.post("/login", passport.authenticate("local"), (req, res) => {
  res.json({ message: "Login successful", user: req.user });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.json({ message: "Logout successful" });
});

module.exports = router;
