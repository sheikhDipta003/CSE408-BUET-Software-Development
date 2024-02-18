const User = require("../models/User");
const ProductWebsite = require("../models/ProductWebsite");
const Wishlist = require("../models/Wishlist");
const Product = require("../models/Product");
const Website = require("../models/Website");

const addToWishlist = async (req, res) => {
  try {
    const { userId, pwId } = req.params;

    // Check if the user already has the product in their wishlist
    const existingWishlistItem = await Wishlist.findOne({
      where: { userId: userId, pwId: pwId },
    });

    if (existingWishlistItem) {
      return res.status(400).json({ message: "Product already in wishlist" });
    }

    // Create a new entry in the wishlist table
    const newWishlistItem = await Wishlist.create({
      UserUserId: userId,
      ProductWebsitePwId: pwId,
    });

    res.status(201).json({ message: "Product added to wishlist successfully", wishlistItem: newWishlistItem });
  } catch (error) {
    console.error("Error adding product to wishlist:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

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

    console.log(wishlistDetails.map((wishlist) => {return wishlist.ProductWebsite.price}));

    if (!wishlistDetails) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    const result = wishlistDetails.map((wishlist) => {
      return { 
        wishlistId: wishlist.wishlistId,
        dateAdded: wishlist.dateAdded,
        price: wishlist.ProductWebsite.price,
        productName: wishlist.ProductWebsite.Product.productName,
        websiteName: wishlist.ProductWebsite.Website.name
      };
    });

    res.status(200).json({ wishlistItems: result });
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
    const userId = req.params.userId;
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

module.exports = { addToWishlist, allWishlist, deleteWishItem, getOneWishItem };
