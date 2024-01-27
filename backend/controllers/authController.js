const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ROLES_LIST = require('../config/roles');
require('dotenv').config();

const handleLogin = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ 'message': 'username and password are required.' });

    const foundUser = await User.findOne({where: {username: username} });
    if (!foundUser) return res.sendStatus(401); //Unauthorized 
    // evaluate password 
    const match = await bcrypt.compare(password, foundUser.password);
    if (match) {
        const roles = ROLES_LIST[foundUser.roles];
        // create JWTs
        const roles = ROLES_LIST[foundUser.roles];
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "username": foundUser.username,
                    "email": foundUser.email,
                    "roles": foundUser.roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '15m' }
        );
        const refreshToken = jwt.sign(
            { "email": foundUser.email },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );
        // Saving refreshToken with current user
        //foundUser.refreshToken = refreshToken;
        //const result = await foundUser.save();
        const result = await User.update({refreshToken: refreshToken}, 
                            {where: {email: foundUser.email}});
        console.log(result);
        //console.log(roles);

        // Creates Secure Cookie with refresh token
        res.cookie('jwt', refreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });

        //only for testing purpose
        //res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });

        // Send authorization roles and access token to user
        res.json({roles, accessToken});

    } else {
        res.sendStatus(401);
    }
}

module.exports = { handleLogin };