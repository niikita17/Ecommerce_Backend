import bcrypt from"bcryptjs";
import User from"../models/user.js"

// ✅ ADD CUSTOMER

export const addCustomer=async(req, res)=>{
  try {
    
    const {name, username, email, password}=req.body;
    if (!name || !username || !email || !password) {
  return res.status(400).json({ message: "All fields are required" });
}
    const existingUser = await User.findOne({
  $or: [{ email }, { username }]
});

if (existingUser) {
  return res.status(409).json({
    message: "User with email or username already exists"
  });
}
   
    const hashedPassword=await bcrypt.hash(password,10);
    const customer = await User.create({
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

// ✅ UPDATE CUSTOMER

export const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, username, email, role, password } = req.body;

    const updateData = { name, username, email, role };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).select("-password");

    return res.status(200).json({
      message: "User updated successfully",
      user: updatedUser
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};


// ✅ DELETE CUSTOMER
export const deleteCustomer = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "Customer deleted" });
};
