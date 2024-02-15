const Product = require("../models/Product");
const Website = require("../models/Website");
const ProductWebsite = require("../models/ProductWebsite");
const ProductPrice = require("../models/ProductPrice");
const ProductSpec = require("../models/Spec");
const { Op, Sequelize } = require("sequelize");

// Get products by category and subcategory
const getProductByQuery = async (req, res) => {
  try {
    const keyword = req.params.keyword;

    console.log(keyword);

    const products = await Product.findAll({
      where: {
        [Op.or]:
          [{
            productName: {
              [Op.match]: Sequelize.fn('plainto_tsquery', keyword),
            }
          },
          {
            productName:
            {
              [Op.iLike]: `%${keyword}%`,
            }
          }
          ]
      },
      attributes: {
        include: [
          [
            Sequelize.literal(`(
              SELECT MIN("ProductWebsites"."price") 
              FROM "ProductWebsites" 
              WHERE "ProductWebsites"."productId" = "Product"."productId"
            )`),
            'minPrice',
          ],
        ],
      },
      include: [
        {
          model: ProductSpec,
        },
      ],
    });
    if (!products) {
      return res.status(404).json({ message: "Products not found" });
    }
    res.status(200).json({ products });
  } catch (error) {
    console.error("Error getting products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getProductsByCategoryAndSubcategory = async (req, res) => {
  try {
    const { category, subcategory } = req.params;

    console.log(category);
    console.log(subcategory);

    const products = await Product.findAll({
      where: {
        category: category,
        subcategory: subcategory
      },
      attributes: {
        include: [
          [
            Sequelize.literal(`(
              SELECT MIN("ProductWebsites"."price") 
              FROM "ProductWebsites" 
              WHERE "ProductWebsites"."productId" = "Product"."productId"
            )`),
            'minPrice',
          ],
        ],
      },
      include: [
        {
          model: ProductSpec,
        }
      ],
    });
    if (!products) {
      return res.status(404).json({ message: "Products not found" });
    }
    res.status(200).json({ products });
  } catch (error) {
    console.error("Error getting products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    console.log(category);

    const products = await Product.findAll({
      where: {
        category: category,
      },
      attributes: {
        include: [
          [
            Sequelize.literal(`(
              SELECT MIN("ProductWebsites"."price") 
              FROM "ProductWebsites" 
              WHERE "ProductWebsites"."productId" = "Product"."productId"
            )`),
            'minPrice',
          ],
        ],
      },
      include: [
        {
          model: ProductSpec,
        }
      ]

    });
    if (!products) {
      return res.status(404).json({ message: "Products not found" });
    }
    res.status(200).json({ products });
  } catch (error) {
    console.error("Error getting products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getProductDetails = async (req, res) => {
  try {
    const productId = req.params.productId;
    console.log(productId);
    // Fetch product details along with associated websites
    const productDetails = await Product.findOne({
      where: { productId: productId },
      include: [
        {
          model: ProductWebsite,
          include: [
            {
              model: Website,
              attributes: ["websiteId", "name", "url"],
            },
          ],
          attributes: ["price", "pwURL"],
        }, 
        {
          model: ProductSpec,
        },
      ],
      attributes: ['productName', 'imagePath', 'brand', 'category', 'subcategory', 'model',
        [
          Sequelize.literal(`(
            SELECT MIN("ProductWebsites"."price") 
            FROM "ProductWebsites" 
            WHERE "ProductWebsites"."productId" = "Product"."productId"
          )`),
          'minPrice',
        ],
        [
          Sequelize.literal(`(
            SELECT COUNT("ProductWebsites"."websiteId") 
            FROM "ProductWebsites" 
            WHERE "ProductWebsites"."productId" = "Product"."productId"
          )`),
          'websites',
        ],
    ]
    });

    if (!productDetails) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ productDetails });
  } catch (error) {
    console.error("Error retrieving product details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getProductWebsite = async (req, res) => {
  try {
    const productId = req.params.productId;
    const websiteId = req.params.websiteId;
    // Fetch the list of users from the database
    const productDetails = await Product.findOne({
      where: { productId: productId },
      include: [
        {
          model: ProductWebsite,
          include: [
            {
              model: Website,
              where: { websiteId: websiteId },
            },
            {
              model: ProductPrice,
              attributes: ['date', 'price'],
            }
          ]
        },
        {
          model: ProductSpec,
        },

      ],
      order: [
        [ProductWebsite, ProductPrice, 'date', 'ASC'],
      ]
    });

    if (!productDetails) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ productDetails });
  } catch (error) {
    console.error("Error retrieving wishItem:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getQuerySuggestions = async (req, res) => {
  try {
    const keyword = req.params.keyword;
    console.log(keyword);

    const products = await Product.findAll({
      where: {
        [Op.or]:
          [{
            productName: {
              [Op.match]: Sequelize.fn('plainto_tsquery', keyword),
            }
          },
          {
            productName:
            {
              [Op.iLike]: '%' + keyword + '%',
            }
          }
          ]
      },
      attributes: ['productId', 'productName'],
      limit: 3,
    });
    const result = JSON.stringify(products);
    console.log({ result });
    res.status(200).json({ products });
  } catch (error) {
    console.error("Error retrieving product details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  getProductByQuery,
  getProductsByCategory,
  getProductsByCategoryAndSubcategory,
  getProductDetails,
  getProductWebsite,
  getQuerySuggestions
};
