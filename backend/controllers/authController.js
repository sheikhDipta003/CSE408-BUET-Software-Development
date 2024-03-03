const User = require("../models/User");
const PriceDrop = require("../models/PriceDrop");
const Product = require("../models/Product");
const Website = require("../models/Website");
const ProductWebsite = require("../models/ProductWebsite");
const Notification = require("../models/Notification");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ROLES_LIST = require("../config/roles");
require("dotenv").config();

const handleLogin = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res
      .status(400)
      .json({ message: "username and password are required." });

  const foundUser = await User.findOne({ where: { username: username } });
  if (!foundUser) return res.sendStatus(401); //Unauthorized
  // evaluate password
  const match = await bcrypt.compare(password, foundUser.password);
  if (match) {
    const roles = ROLES_LIST[foundUser.roles];
    // create JWTs
    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: foundUser.username,
          email: foundUser.email,
          roles: foundUser.roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" },
    );
    const refreshToken = jwt.sign(
      { email: foundUser.email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" },
    );
    // Saving refreshToken with current user
    //foundUser.refreshToken = refreshToken;
    //const result = await foundUser.save();
    const result = await User.update(
      { refreshToken: refreshToken },
      { where: { email: foundUser.email } },
    );
    console.log(result);
    //console.log(roles);

    // Creates Secure Cookie with refresh token
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
    });

    //only for testing purpose
    //res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });

    if(roles === ROLES_LIST.User){
      try {  
        const priceDrops = await PriceDrop.findAll({
          where: { userId: foundUser.userId },
          include: {
            model: ProductWebsite,
            include: [Product, Website],
          },
        });
    
        const notifications = [];
    
        for (const priceDrop of priceDrops) {
          if (priceDrop.price >= priceDrop.ProductWebsite.price) {
            const productName = priceDrop.ProductWebsite.Product.productName;
            const websiteName = priceDrop.ProductWebsite.Website.name;
    
            const message = `The price for ${productName} on ${websiteName} has dropped to or below your desired price BDT ${priceDrop.price}`;
    
            const notification = await Notification.create({
              title: "Price Drop Alert",
              message,
              isRead: false,
              UserUserId: foundUser.userId,
            });
    
            notifications.push(notification);
          }
        }
      } catch (error) {
        console.error("Error notifying users about price drop alerts:", error);
        return res.status(500).json({ message: "Internal server error" });
      }
    }

    // Send authorization roles and access token to user
    res.json({ roles, accessToken, userId: foundUser.userId });
  } else {
    res.sendStatus(401);
  }
};

module.exports = { handleLogin };
