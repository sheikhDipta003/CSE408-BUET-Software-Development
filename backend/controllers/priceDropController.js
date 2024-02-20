const PriceDrop = require("../models/PriceDrop");
const Product = require("../models/Product");
const Website = require("../models/Website");
const ProductWebsite = require("../models/ProductWebsite");

// Controller function to set an alert for a price drop on a specific product
async function setPriceDropAlert(req, res) {
  try {

    const { userId } = req.params;
    const { productId, websiteId, price } = req.body;

    if (isNaN(parseInt(price)) || parseInt(price) <= 0) {
      return res.status(400).json({
        message: "Price must be a positive integer",
      });
    }

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

    const existingPriceDrop = await PriceDrop.findOne({
      where: {
        UserUserId: userId,
        ProductWebsitePwId: productWebsite.pwId
      },
    });

    if (existingPriceDrop) {
      return res.status(400).json({
        message: "Price drop alert already exists for this product",
      });
    }

    // Create a new PriceDrop entry
    const priceDrop = await PriceDrop.create({
      UserUserId: userId,
      ProductWebsitePwId: productWebsite.pwId,
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
      include: [
        {
          model: ProductWebsite,
          include: [
            {
              model: Product,
              attributes: ['productName', 'productId'],
            },
            {
              model: Website,
              attributes: ['name', 'websiteId'],
            },
          ],
          attributes: ['pwId', 'price'],
        },
      ],
    });

    const formatResult = priceDrops.map((pd) => ({
        pwId: pd.ProductWebsitePwId,
        productId: pd.ProductWebsite.Product.productId,
        productName: pd.ProductWebsite.Product.productName,
        websiteId: pd.ProductWebsite.Website.websiteId,
        websiteName: pd.ProductWebsite.Website.name,
        currentPrice: pd.ProductWebsite.price,
        priceDrop: pd.price,
        dateAdded: pd.dateAdded
    }));

    return res.status(200).json(formatResult);
  } catch (error) {
    console.error("Error fetching price drop alerts:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function updatePriceDrop(req, res) {
  try {
    const { userId } = req.params;
    const { productId, websiteId, newPrice } = req.body;

    // Find the corresponding ProductWebsite entry
    const productWebsite = await ProductWebsite.findOne({
      where: { productId, websiteId },
    });

    if (!productWebsite) {
      return res.status(404).json({ message: "ProductWebsite entry not found" });
    }

    // Update the price drop value
    const updatedPriceDrop = await PriceDrop.update(
      { price: newPrice },
      { 
        where: { 
          UserUserId: userId, 
          ProductWebsitePwId: productWebsite.pwId 
        } 
      }
    );

    if (updatedPriceDrop[0] === 0) {
      return res.status(404).json({ message: "PriceDrop entry not found for the given user and product website" });
    }

    return res.status(200).json({ message: "Price drop updated successfully" });
  } catch (error) {
    console.error("Error modifying price drop:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}


// Controller function to remove a price drop alert
async function removePriceDropAlert(req, res) {
  try {
    const { userId, productId, websiteId } = req.params;

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
  updatePriceDrop,
  removePriceDropAlert,
};
