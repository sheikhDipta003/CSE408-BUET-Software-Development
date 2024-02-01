const Product = require("../models/Product");
const Website = require("../models/Website");
const ProductWebsite = require("../models/ProductWebsite");
const ProductPrice = require("../models/ProductPrice");
const { Op, Sequelize } = require("sequelize");

// Get products by category and subcategory
const getProductByQuery = async (req, res) => {
  try{
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const keyword = req.query.keyword || '';
    const orderQ = req.query.order || 'ASC';
    const order = orderQ.toUpperCase();
    const offset = (page-1)*limit;

    console.log(keyword);

    const products = await Product.findAll({
      where: {
        name: {
          //[Op.substring] : keyword,
          [Op.match]: Sequelize.fn('plainto_tsquery', keyword),
        }
      },
      include: [
        {
          model: ProductWebsite,
          //attributes :[],
          include: [
            {
              model: ProductPrice,
              attributes: [[Sequelize.fn('MIN', Sequelize.col('price')), 'minPrice']],
            }
          ]
        }
      ],
      group: ['Product.productId'],
      order: [[Sequelize.literal('"ProductWebsite.ProductPrice.minPrice"'), order]],
      offset: offset,
      limit: limit,
    });
    res.status(200).json({ products });
  }catch(error){
    console.error("Error getting products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getProductsByCategoryAndSubcategory = async (req, res) => {
  try {
    const { category, subcategory } = req.params;
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const orderQ = req.query.order || 'ASC';
    const order = orderQ.toUpperCase();
    const offset = (page-1)*limit;

    console.log(category);
    console.log(subcategory);

    const products = await Product.findAll({
      where: { 
        category: category, 
        subcategory: subcategory 
      },
      include: [
        {
          model: ProductWebsite,
          //attributes :[],
          include: [
            {
              model: ProductPrice,
              attributes: [[Sequelize.fn('MIN', Sequelize.col('price')), 'minPrice']],
            }
          ]
        }
      ],
      group: ['Product.productId'],
      order: [[Sequelize.literal('"ProductWebsite.ProductPrice.minPrice"'), order]],
      offset: offset,
      limit: limit,
    });

    res.status(200).json({ products });
  } catch (error) {
    console.error("Error getting products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const orderQ = req.query.order || 'ASC';
    const order = orderQ.toUpperCase();
    const offset = (page-1)*limit;

    console.log(category);

    const products = await Product.findAll({
      where: { 
        category: category, 
      },
      include: [
        {
          model: ProductWebsite,
          //attributes :[],
          include: [
            {
              model: ProductPrice,
              attributes: [[Sequelize.fn('MIN', Sequelize.col('price')), 'minPrice']],
            }
          ]
        }
      ],
      group: ['Product.productId'],
      order: [[Sequelize.literal('"ProductWebsite.ProductPrice.minPrice"'), order]],
      offset: offset,
      limit: limit,
    });

    res.status(200).json({ products });
  } catch (error) {
    console.error("Error getting products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getProductDetails = async (req, res) => {
  try {
    const productId = req.params.productId;

    // Fetch product details along with associated websites
    const productDetails = await Product.findOne({
      where: { productId: productId },
      include: [
        {
          model: ProductWebsite,
          include: [
            {
              model: Website,
              attributes: ["name", "url"],
            },
          ],
          attributes: ["shippingTime", "price", "stock"],
        },
      ],
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
    const product = await ProductWebsite.findOne({
      where: { productId: productId, websiteId: websiteId },
      include: [
        {
          model: Product,
          attributes: [
            "productName",
            "brand",
            "category",
            "subcategory",
            "imagePath",
          ],
        },
        {
          model: Website,
          attributes: ["name", "imagePath", "url"],
        },
      ],
      attributes: ["shippingTime", "price", "stock", "rating"],
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ product });
  } catch (error) {
    console.error("Error retrieving wishItem:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getProductByQuery,
  getProductsByCategory,
  getProductsByCategoryAndSubcategory,
  getProductDetails,
  getProductWebsite,
};
