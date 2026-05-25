const UserModel = require("../models/user.model");

const {
    generateAccessToken,
    generateRefreshToken
} = require("../utils/token");

const jwt = require("jsonwebtoken");


// REGISTER
let registerController = async (req, res) => {

    try {

        let { name, email, password, mobile } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        let existingUser = await UserModel.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                message: "User already exists"
            });
        }

        let newUser = new UserModel({
            name,
            email,
            password,
            mobile
        });

        let accessToken = generateAccessToken(newUser._id);

        let refreshToken = generateRefreshToken(newUser._id);

        newUser.refreshToken = refreshToken;

        await newUser.save();

        // cookies
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            maxAge: 15 * 60 * 1000
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 15 * 60 * 60 * 1000
        });

        return res.status(201).json({
            message: "User Created Successfully",
            user: newUser
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};


// LOGIN
let loginController = async (req, res) => {

    try {

        let { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        let isExisted = await UserModel.findOne({ email });

        if (!isExisted) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // password check
        if (password !== isExisted.password) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        let accessToken = generateAccessToken(isExisted._id);

        let refreshToken = generateRefreshToken(isExisted._id);

        isExisted.refreshToken = refreshToken;

        await isExisted.save();

        // cookies
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            maxAge: 15 * 60 * 1000
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 15 * 60 * 60 * 1000
        });

        return res.status(200).json({
            message: "User LoggedIn Successfully",
            user: isExisted
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};


// REFRESH TOKEN
let getRefreshTokenController = async (req, res) => {

    try {

        console.log("refresh route hit");

        let refreshToken = req.cookies.refreshToken;

        console.log("refreshToken:", refreshToken);

        if (!refreshToken) {
            return res.status(401).json({
                message: "Unauthorized user"
            });
        }

        let decode = jwt.verify(
            refreshToken,
            process.env.JWT_SECRET_REFRESH
        );

        console.log("decoded:", decode);

        let user = await UserModel.findById(decode.userId);

        if (!user) {
            return res.status(401).json({
                message: "Unauthorized user"
            });
        }

        if (refreshToken !== user.refreshToken) {
            return res.status(401).json({
                message: "Unauthorized user"
            });
        }

        let accessToken = generateAccessToken(user._id);

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            maxAge: 15 * 60 * 1000
        });

        return res.status(200).json({
            message: "Access token generated"
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};


module.exports = {
    registerController,
    loginController,
    getRefreshTokenController
};