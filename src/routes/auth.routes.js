let express = require('express');

const {
    registerController,
    loginController,
    getRefreshTokenController
} = require('../Controllers/auth.controller');

console.log(registerController);
console.log(loginController);
console.log(getRefreshTokenController);

let router = express.Router();

router.get('/getRefreshToken', getRefreshTokenController);

router.post('/register', registerController);

router.post('/login', loginController);

module.exports = router;