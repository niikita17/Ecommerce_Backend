import users from "../models/user.js";
import bcrypt from "bcryptjs";


export const create=async(req, res)=>{
  try {
    
    const {name, username, email, password}=req.body;
    if (!name || !username || !email || !password) {
  return res.status(400).json({ message: "All fields are required" });
}
    const existingUser = await users.findOne({
  $or: [{ email }, { username }]
});

if (existingUser) {
  return res.status(409).json({
    message: "User with email or username already exists"
  });
}
   
    const hashedPassword=await bcrypt.hash(password,10);
    const customer = await users.create({
        name,
        username,
        email,
        password: hashedPassword,
        role: "customer"
      });
    
      if(customer)
      return res.status(201).json(customer);
    else
          return res.status(500).json({message:"internal server error"});
  
  } catch (error) {
    console.log(error);
    return res.status(500).json({message:"internal server error"});

  }
}
export const update = async (req, res) => {
  try {
    const userId = req.user.id; // from JWT
    const { name, email, password } = req.body;

    const updateData = {};

    if (name) updateData.name = name;
    if (email) updateData.email = email;

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await users.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true }
    ).select("-password");

    return res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const Delete=async(req, res)=>{
  try {
    
    const userId=req.params.id;
     
    const customer = await users.findByIdAndDelete(userId);
    
      if(customer)
      return res.status(201).json({message:"delete the customer"});
    else
          return res.status(500).json({message:"internal server error"});
  
  } catch (error) {
    return res.status(500).json({message:"internal server error"});

  }
}