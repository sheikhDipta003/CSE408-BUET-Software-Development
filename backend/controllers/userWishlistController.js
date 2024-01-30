const User = require("../models/User");
const ProductWebsite = require("../models/ProductWebsite");
const Wishlist = require("../models/Wishlist");
const Product = require("../models/Product");
const Website = require("../models/Website");

const allWishlist = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Fetch the user's wishlist with associated products
    const wishlistDetails = await Wishlist.findAll({
      where: { userId: userId },
      include: [
        {
          model: ProductWebsite,
          attributes: ["price"],
          include: [
            {
              model: Product,
              attributes: ["productName"],
            },
            {
              model: Website,
              attributes: ["name"],
            },
          ],
        },
      ],
    });

    if (!wishlistDetails) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    res.status(200).json({ wishlistDetails });
  } catch (error) {
    console.error("Error retrieving wishlist:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getOneWishItem = async (req, res) => {
  try {
    const userId = req.params.userId;
    const pwId = req.params.pwId;
    // Fetch the list of users from the database
    const wishlistDetails = await Wishlist.findOne({
      where: { userId: userId, pwId: pwId },
      include: [
        {
          model: ProductWebsite,
          attributes: ["price"],
          include: [
            {
              model: Product,
              attributes: ["productName"],
            },
            {
              model: Website,
              attributes: ["name"],
            },
          ],
        },
      ],
    });

    if (!wishlistDetails) {
      return res.status(404).json({ message: "WishItem not found" });
    }

    res.status(200).json({ wishlistDetails });
  } catch (error) {
    console.error("Error retrieving wishItem:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteWishItem = async (req, res) => {
  try {
    const userId = req.user.userId;
    const wishlistId = req.params.wishlistId;

    // Check if the user has the product in their wishlist
    const userWishlist = await Wishlist.findOne({
      where: { wishlistId: wishlistId, userId: userId },
    });

    if (!userWishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    await userWishlist.destroy();

    res
      .status(200)
      .json({ message: "Product removed from wishlist successfully" });
  } catch (error) {
    console.error("Error removing product from wishlist:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { allWishlist, deleteWishItem, getOneWishItem };
