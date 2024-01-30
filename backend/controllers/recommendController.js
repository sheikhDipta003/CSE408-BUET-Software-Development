const ProductWebsite = require("../models/ProductWebsite");
const UserInteraction = require("../models/UserInteraction");
const Product = require("../models/Product");
const Website = require("../models/Website");

// Controller to get the clickcount for a specific user, product, and website
const getClicksCount = async (req, res) => {
  const { userId } = req.params;
  const { productId, websiteId } = req.body;

  try {
    // Retrieve the pwId from the ProductWebsite table corresponding to the productId and websiteId
    const productWebsite = await ProductWebsite.findOne({
      where: { productId, websiteId },
      attributes: ["pwId"],
    });

    if (!productWebsite) {
      return res
        .status(404)
        .json({ message: "ProductWebsite record not found" });
    }

    // Find the corresponding UserInteraction record using userId and pwId
    const userInteraction = await UserInteraction.findOne({
      where: { userId: userId, pwId: productWebsite.pwId },
      attributes: ["clickcount"],
    });

    if (!userInteraction) {
      return res
        .status(404)
        .json({ message: "UserInteraction record not found" });
    }

    // Return the clickcount
    res.status(200).json({ clickcount: userInteraction.clickcount });
  } catch (error) {
    console.error("Error fetching clickcount:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Controller function to get click count for all records
const getAllClickCounts = async (req, res) => {
    const { userId } = req.params;

    try {
        // Find all user interactions for the given userId
        const userInteractions = await UserInteraction.findAll({
            where: { userId },
            include: [
                {
                    model: ProductWebsite,
                    include: [
                        {
                            model: Product,
                            attributes: ['productId']
                        },
                        {
                            model: Website,
                            attributes: ['websiteId']
                        }
                    ]
                }
            ]
        });

        // Extract relevant information and format the response
        const clickcount = userInteractions.map(interaction => ({
            productId: interaction.ProductWebsite.Product.productId,
            websiteId: interaction.ProductWebsite.Website.websiteId,
            clickcount: interaction.clickcount
        }));

        // Send the response
        res.json(clickcount);
    } catch (error) {
        console.error('Error fetching click counts:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Controller to update the clickcount for a specific user, product, and website
const updateClicksCount = async (req, res) => {
  const { userId } = req.params;
  const { clickcount, productId, websiteId } = req.body;

  try {
    // Retrieve the pwId from the ProductWebsite table corresponding to the productId and websiteId
    const productWebsite = await ProductWebsite.findOne({
      where: { productId, websiteId },
      attributes: ["pwId"],
    });

    if (!productWebsite) {
      return res
        .status(404)
        .json({ message: "ProductWebsite record not found" });
    }

    // Update the clickcount in the UserInteraction record
    const [updatedCount] = await UserInteraction.update(
      { clickcount },
      { where: { userId, pwId: productWebsite.pwId } },
    );

    if (updatedCount === 0) {
      return res
        .status(404)
        .json({ message: "UserInteraction record not found" });
    }

    res.status(200).json({ message: "Clicks count updated successfully" });
  } catch (error) {
    console.error("Error updating clickcount:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getClicksCount,
  updateClicksCount,
  getAllClickCounts
};
