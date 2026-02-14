import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../middleware/models/User.js";

const router = express.Router();

const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  if (!token) {
    return res.status(401).json({ message: "Authorization token is required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

/* EMAIL SIGNUP */
router.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const exists = await User.findOne({ email: normalizedEmail });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: normalizedEmail,
      password: hashed,
    });

    const token = jwt.sign(
      { id: user._id, firstName: user.firstName, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Signup failed" });
  }
});

/* EMAIL LOGIN */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.password) {
      return res
        .status(400)
        .json({
          message: "Use Google login for this account",
          code: "GOOGLE_ONLY_ACCOUNT",
        });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, firstName: user.firstName, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
});

/* SET PASSWORD FOR GOOGLE-FIRST ACCOUNT */
router.post("/set-password", requireAuth, async (req, res) => {
  try {
    const { password } = req.body;

    if (!password || password.trim().length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.password) {
      return res
        .status(400)
        .json({ message: "Password is already set for this account" });
    }

    user.password = await bcrypt.hash(password, 10);
    await user.save();

    return res.status(200).json({
      message: "Password has been set successfully",
      canUseEmailLogin: true,
    });
  } catch {
    return res.status(500).json({ message: "Failed to set password" });
  }
});

export default router;
