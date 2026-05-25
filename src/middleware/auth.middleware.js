const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");

const authmiddleware = async (req, res, next) => {

    try {

        // GET TOKEN FROM COOKIE

        const token = req.cookies.accessToken;

        if (!token) {

            return res.status(401).json({
                message: "Unauthorized user"
            });
        }


        // VERIFY TOKEN

        const decode = jwt.verify(
            token,
            process.env.JWT_SECRET_ACCESS
        );


        if (!decode) {

            return res.status(401).json({
                message: "Unauthorized user"
            });
        }


        // FIND USER

        const user = await UserModel.findById(decode.userId);

        if (!user) {

            return res.status(404).json({
                message: "User not found"
            });
        }


        // ATTACH USER TO REQUEST

        req.user = user;


        // MOVE TO NEXT

        next();

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            message: "Error in middleware",
            error: error.message
        });
    }
};

module.exports = authmiddleware;