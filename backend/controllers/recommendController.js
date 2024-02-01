const ProductWebsite = require("../models/ProductWebsite");
const UserInteraction = require("../models/UserInteraction");
const Product = require("../models/Product");
const Website = require("../models/Website");
const User = require("../models/User");
const recommendations = require("collaborative-filter/lib/cf_api.js");
const sequelize = require("../config/database");

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
              attributes: ["productId"],
            },
            {
              model: Website,
              attributes: ["websiteId"],
            },
          ],
        },
      ],
    });

    // Extract relevant information and format the response
    const clickcount = userInteractions.map((interaction) => ({
      productId: interaction.ProductWebsite.Product.productId,
      websiteId: interaction.ProductWebsite.Website.websiteId,
      clickcount: interaction.clickcount,
    }));

    // Send the response
    res.json(clickcount);
  } catch (error) {
    console.error("Error fetching click counts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// get all the records
const getAllUserClickcount = async (req, res) => {
  try {
    // Find all user interactions
    const userInteractions = await UserInteraction.findAll({
      include: [
        {
          model: ProductWebsite,
          include: [
            {
              model: Product,
              attributes: ["productId"],
            },
            {
              model: Website,
              attributes: ["websiteId"],
            },
          ],
        },
      ],
    });

    // Extract relevant information and format the response
    const clickCounts = userInteractions.map((interaction) => ({
      userId: interaction.UserUserId,
      productId: interaction.ProductWebsite.Product.productId,
      websiteId: interaction.ProductWebsite.Website.websiteId,
      clickcount: interaction.clickcount,
    }));

    // Send the response
    res.json(clickCounts);
  } catch (error) {
    console.error("Error fetching click counts:", error);
    res.status(500).json({ error: "Internal server error" });
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

const getTrendingProducts = async (req, res) => {
  try {
    const maxClickcountRow = await UserInteraction.findOne({
      attributes: [
        "pwId",
        [sequelize.fn("SUM", sequelize.col("clickcount")), "totalclickcount"],
      ],
      group: ["pwId"],
      order: [[sequelize.literal("totalclickcount"), "DESC"]],
      raw: true, // Set raw to true to get plain object instead of Sequelize model
    });

    console.log(maxClickcountRow);

    if (!maxClickcountRow) {
      return res
        .status(404)
        .json({ message: "No rows found in UserInteraction table" });
    }

    res.status(200).json({ pwId: maxClickcountRow.pwId });
  } catch (error) {
    console.error("Error retrieving max clickcount row:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Function to generate recommendations for a specific user
const generateRecommendations = async (req, res) => {
  const { userId } = req.params;

  try {
    // Find all user interactions for the given userId
    const userInteractions = await UserInteraction.findAll({
      include: [
        {
          model: ProductWebsite,
          include: [
            {
              model: Product,
              attributes: ["productId"],
            },
            {
              model: Website,
              attributes: ["websiteId"],
            },
          ],
        },
        {
          model: User,
          attributes: ["userId"],
        },
      ],
    });

    const userIdMap = {};
    const pwIdMap = {};
    let userIdCounter = 0;
    let pwIdCounter = 0;

    userInteractions.forEach((interaction) => {
      if (!(interaction.User.userId in userIdMap)) {
        userIdMap[interaction.User.userId] = userIdCounter++;
      }
      if (!(interaction.ProductWebsite.pwId in pwIdMap)) {
        pwIdMap[interaction.ProductWebsite.pwId] = pwIdCounter++;
      }
    });

    // Create matrix
    const matrix = Array.from({ length: userIdCounter }, () =>
      Array.from({ length: pwIdCounter }, () => 0),
    );

    // Populate matrix based on click counts
    userInteractions.forEach((interaction) => {
      const userIdIndex = userIdMap[interaction.User.userId];
      const pwIdIndex = pwIdMap[interaction.ProductWebsite.pwId];
      matrix[userIdIndex][pwIdIndex] = interaction.clickcount > 0 ? 1 : 0;
    });

    console.log(matrix);

    const r = recommendations.cFilter(matrix, userIdMap[userId]);

    console.log(r);

    const results = r.map((j) => {
      return parseInt(
        Object.keys(pwIdMap).find((key) => pwIdMap[key] === j),
        10,
      );
    });

    console.log(results);

    res
      .status(200)
      .json({ results, message: "Succesfully returned recommended pwIds" });
  } catch (error) {
    console.error("Error generating recommendations:", error);
    throw error;
  }
};

module.exports = {
  getClicksCount,
  updateClicksCount,
  getAllClickCounts,
  getAllUserClickcount,
  generateRecommendations,
  getTrendingProducts,
};
