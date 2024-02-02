const PriceDrop = require("../models/PriceDrop");
const ProductWebsite = require("../models/ProductWebsite");

// Controller function to set an alert for a price drop on a specific product
async function setPriceDropAlert(req, res) {
  try {
    const { productId, userId, websiteId } = req.params;
    const price = req.body;

    // Find the corresponding ProductWebsite entry
    const productWebsite = await ProductWebsite.findOne({
      where: { 
        productId: productId, 
        websiteId: websiteId 
      },
    });

    if (!productWebsite) {
      return res
        .status(404)
        .json({ message: "ProductWebsite entry not found" });
    }

    // Create a new PriceDrop entry
    const priceDrop = await PriceDrop.create({
      userId: userId,
      pwId: productWebsite.pwId,
      price: price,
      dateAdded: new Date(),
    });

    return res
      .status(201)
      .json({ message: "Price drop alert set successfully", priceDrop });
  } catch (error) {
    console.error("Error setting price drop alert:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// Controller function to view all price drops of a user
async function viewPriceDropAlerts(req, res) {
  try {
    const userId = req.params.userId;

    // Find all price drops associated with the user
    const priceDrops = await PriceDrop.findAll({
      where: { userId },
      include: [{ model: ProductWebsite }],
    });

    return res.status(200).json({ priceDrops });
  } catch (error) {
    console.error("Error fetching price drop alerts:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// Controller function to remove a price drop alert
async function removePriceDropAlert(req, res) {
  try {
    const { userId, productId, websiteId } = req.body;

    // Find the corresponding ProductWebsite entry
    const productWebsite = await ProductWebsite.findOne({
      where: { productId, websiteId },
    });

    if (!productWebsite) {
      return res
        .status(404)
        .json({ message: "ProductWebsite entry not found" });
    }

    // Delete the price drop entry
    await PriceDrop.destroy({
      where: { userId: userId, pwId: productWebsite.pwId },
    });

    return res
      .status(200)
      .json({ message: "Price drop alert removed successfully" });
  } catch (error) {
    console.error("Error removing price drop alert:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  setPriceDropAlert,
  viewPriceDropAlerts,
  removePriceDropAlert,
};
