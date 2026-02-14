import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import User from "../middleware/models/User.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email, given_name, family_name, sub } = ticket.getPayload();

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        email,
        firstName: given_name,
        lastName: family_name,
        googleId: sub,
        role: "user",
      });
    } else if (!user.googleId) {
      user.googleId = sub;
      if (!user.firstName && given_name) user.firstName = given_name;
      if (!user.lastName && family_name) user.lastName = family_name;
      await user.save();
    } else if (user.googleId !== sub) {
      return res.status(401).json({ message: "Google authentication failed" });
    }

    const jwtToken = jwt.sign(
      {
        id: user._id,
        firstName: user.firstName,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      token: jwtToken,
      hasPassword: Boolean(user.password),
    });
  } catch (error) {
    res.status(401).json({ message: "Google authentication failed" });
  }
};
