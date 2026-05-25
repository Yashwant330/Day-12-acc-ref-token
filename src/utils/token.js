let jwt = require('jsonwebtoken')

let generateAccessToken = (userID)=>{
    return jwt.sign({userID},process.env.JWT_SECRET_ACCESS,{
        expiresIn:'15m',
    })
}

let generateRefreshToken = (userID)=>{
    return jwt.sign({userID},process.env.JWT_SECRET_REFRESH,{
        expiresIn:'1d',
    })
}

module.exports={generateAccessToken,generateRefreshToken}