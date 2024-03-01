const ProductWebsite = require("../models/ProductWebsite");
const UserInteraction = require("../models/UserInteraction");
const Product = require("../models/Product");
const Website = require("../models/Website");
const User = require("../models/User");
const recommendations = require("collaborative-filter/lib/cf_api.js");
const sequelize = require("../config/database");
const productsController = require("./productsController");

const createClicksCount = async (req, res) => {
  const { userId, pwId } = req.params;

  try {
    const existingInteraction = await UserInteraction.findOne({
      where: { userId: userId, pwId: pwId },
    });

    if (existingInteraction) {
      return res.status(400).json({ error: "User interaction already exists" });
    }

    // Create a new entry in the UserInteractions table
    await UserInteraction.create({
      UserUserId: userId,
      ProductWebsitePwId: pwId,
      clickcount: 0,
    });

    res.status(201).json({ clickcount: 0, message: "User interaction created successfully" });
  } catch (error) {
    console.error("Error creating user interaction:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

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
    const maxClickcountRows = await UserInteraction.findAll({
      attributes: [
        "pwId",
        [sequelize.fn("SUM", sequelize.col("clickcount")), "totalclickcount"],
      ],
      group: ["pwId"],
      order: [[sequelize.literal("totalclickcount"), "DESC"]],
      limit: 10, // Limit the query to retrieve only the first 10 highest pwIds
      raw: true, // Set raw to true to get plain objects instead of Sequelize models
    });

    console.log(maxClickcountRows);

    if (!maxClickcountRows || maxClickcountRows.length === 0) {
      return res
        .status(404)
        .json({ message: "No rows found in UserInteraction table" });
    }

    const pwIds = maxClickcountRows.map((row) => row.pwId);

    // Fetch all information about the products using the retrieved pwIds
    const productsInfo = await Promise.all(
      pwIds.map(async (pwId) => (await getProductInfo(pwId)).data)
    );

    res.status(200).json({ trending: productsInfo });
  } catch (error) {
    console.error("Error retrieving max clickcount rows:", error);
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

    let response;

    if (results.length === 0) {
      // Fetch the pwId of the first 3 rows of ProductWebsite table
      const firstThreePwIds = await ProductWebsite.findAll({ attributes: ["pwId"], limit: 3 });

      // Retrieve corresponding product information using getProductInfo
      const productInfoPromises = firstThreePwIds.map(async (row) => {
        const pwId = row.pwId;
        return (await getProductInfo(pwId)).data;
      });

      const productInfo = await Promise.all(productInfoPromises);

      response = { recommendations: productInfo, message: "Successfully returned recommended pwIds" };
    } else {
      if (results.length > 10) {
        results = results.slice(0, 10); // Take only the first ten elements
      }

      const formatResults = await Promise.all(results.map(async (pwId) => {
        const productInfo = (await getProductInfo(pwId)).data;
        return productInfo;
      }));
      console.log(formatResults);

      response = { recommendations: formatResults, message: "Successfully returned recommended pwIds" };
    }

    res.status(200).json(response);
  } catch (error) {
    console.error("Error generating recommendations:", error);
    throw error;
  }
};

const generateTopProducts = async (req, res) => {
  try {
    const collabId = req.params.collabId;
    const { pwId } = req.body;

    const website = await Website.findOne({ where: { collabId: collabId } });
    if (!website) {
      return res.status(404).json({ message: "Website not found for the provided collabId" });
    }

    //const websiteId = website.dataValues.website;

    const productWebsite = await ProductWebsite.findOne({
      where: { pwId: pwId },
    });
    if (!productWebsite) {
      return res.status(404).json({ message: "Product not found for the provided collabId and productId" });
    }

    //const productInfo = (await getProductInfo(productWebsite.pwId)).data;
    productWebsite.promoted = true;
    await productWebsite.save();

    res.status(200).json(productWebsite);
  } catch (error) {
    console.error("Error generating top products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const removeTopProduct = async (req, res) => {
  try {
    const collabId = req.params.collabId;
    const { pwId } = req.body;

    const website = await Website.findOne({ where: { collabId: collabId } });
    if (!website) {
      return res.status(404).json({ message: "Website not found for the provided collabId" });
    }

    //const websiteId = website.dataValues.websiteId;

    const productWebsite = await ProductWebsite.findOne({
      where: { pwId: pwId },
    });
    if (!productWebsite) {
      return res.status(404).json({ message: "Product not found for the provided collabId and productId" });
    }

    //const productInfo = (await getProductInfo(productWebsite.pwId)).data;
    productWebsite.promoted = false;
    await productWebsite.save();

    res.status(200).json(productWebsite);
  } catch (error) {
    console.error("Error removing top products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getPromoted = async (req, res) => {
  try {
    const result = await ProductWebsite.findAll({
      where:
      {
        promoted: true,
      },
    });

    if (!result || result.length === 0) {
      return res.status(200).json({ top: [] });
    }

    const pwIds = result.map((row) => row.pwId);

    const productsInfo = await Promise.all(
      pwIds.map(async (pwId) => (await getProductInfo(pwId)).data)
    );

    res.status(200).json({top: productsInfo});

  } catch (error) {
    console.error("Error getting top products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

const getProductInfo = async (pwId) => {
  try {
    const productWebsite = await ProductWebsite.findByPk(pwId, {
      include: [
        {
          model: Product,
          attributes: ["productId", "productName", "imagePath", "brand", "category", "subcategory", "model", "mpn"],
        },
        {
          model: Website,
          attributes: ["websiteId", "name", "url", "collaboration"],
        },
      ],
    });

    if (!productWebsite) {
      return { error: "Product website entry not found" };
    }

    return {
      data: {
        pwId: productWebsite.pwId,
        pwURL: productWebsite.pwURL,
        shippingTime: productWebsite.shippingTime,
        inStock: productWebsite.inStock,
        price: productWebsite.price,
        rating: productWebsite.rating,
        productId: productWebsite.Product.productId,
        productName: productWebsite.Product.productName,
        imagePath: productWebsite.Product.imagePath,
        brand: productWebsite.Product.brand,
        category: productWebsite.Product.category,
        subcategory: productWebsite.Product.subcategory,
        model: productWebsite.Product.model,
        mpn: productWebsite.mpn,
        websiteId: productWebsite.Website.websiteId,
        websiteName: productWebsite.Website.name,
        websiteURL: productWebsite.Website.url,
        websiteCollab: productWebsite.Website.collaboration
      }
    };
  } catch (error) {
    console.error("Error retrieving product website information:", error);
    return { error: "Error retrieving product website information" }; // Return an error message
  }
};

module.exports = {
  createClicksCount,
  getClicksCount,
  updateClicksCount,
  getAllClickCounts,
  getAllUserClickcount,
  generateRecommendations,
  getTrendingProducts,
  generateTopProducts,
  removeTopProduct,
  getPromoted
};
