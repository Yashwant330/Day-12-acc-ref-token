let {default:mongoose} = require("mongoose")
let bcrypt = require('bcrypt')

 let jwt = require('jsonwebtoken')

let userSchema = new mongoose.Schema


({
    name:{
        type:String,
        trim:true,
    },
     email:{
        type:String,
        trim:true,
        unique:[true,"email should be required"],
        required:[true,"Email is required"]
    },
     password:{
        type:String,
        trim:true,
                required:[true,"password is required"]

    },
     mobile:{
        type:String,
        trim:true,
        minlength:10,
        maxlength:10
    },
    refreshToken:{
        type:String,
    }

},{
    timestamps : true,
})

userSchema.pre('save',function(){
    this.password= bcrypt.hashSync(this.password,10)
})



userSchema.methods.comparePassword = function(password){
    return bcrypt.compareSync(password,this.password)
}

let UserModel = mongoose.model("users",userSchema)

module.exports = UserModel