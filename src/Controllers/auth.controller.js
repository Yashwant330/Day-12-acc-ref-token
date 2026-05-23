const UserModel = require("../models/user.model")


let registerController = async(req,res)=>{
    try {
        

        let {name,email,password,mobile}=req.body;


        if(!email || !password)
            return res.status(400).json({
        message:"All fields are required"
    })

    let existingUser = await UserModel.findOne({
        email
    })


   if(existingUser)
    return res.status(409).json({
    message:"user already exist"
    })

   let newUser = await UserModel({
    name,
    email,
    password,
    mobile,
   })

    } catch (error) {
        return res.status(500).json({
            message:"Internal server error"
        })
    }
}