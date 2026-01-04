import bcrypt from "bcryptjs";
import User from "../models/user.js";
import  generateToken from "../utils/generateToken.js";
 const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1. Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Wrong credentials" });
    }

    // 3. Generate token (include role)
    const token = generateToken({
      id: user._id,
      role: user.role,
      username:user.username,
    });

    // 4. Send response
    return res.status(200).json({
      message: "Login successful",
      token,
      role: user.role,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};


export default login;