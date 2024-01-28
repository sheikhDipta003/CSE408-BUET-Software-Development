const Product = require('../models/Product');
const ProductWebsite = require('../models/ProductWebsite');

// Get products by category and subcategory
const getProductsByCategoryAndSubcategory = async (req, res) => {
    try {
        const { category, subcategory } = req.query;

        console.log(category);
        console.log(subcategory);

        const products = await Product.findAll({
            where: { category:category, subcategory:subcategory }
        });

        res.status(200).json({ products });
    } catch (error) {
        console.error('Error getting products:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports={getProductsByCategoryAndSubcategory};
