const Product = require('../models/Product');
const ProductImage = require('../models/ProductImage');
const ProductWebsite = require('../models/ProductWebsite');

// Create a new product
exports.createProduct = async (req, res) => {
    try {
        // Extract data from request body
        const { productName, brand, imagePath, category, subcategory, color, width, height, images, websites } = req.body;

        // Create the product
        const product = await Product.create({
            productName,
            brand,
            imagePath,
            category,
            subcategory,
            color,
            width,
            height
        });

        // Create product images
        await ProductImage.bulkCreate(images.map(image => ({ imageUrl: image.imageUrl, productId: product.productId })));

        // Create product websites
        await ProductWebsite.bulkCreate(websites.map(website => ({ ...website, productId: product.productId })));

        res.status(201).json({ message: 'Product created successfully', product });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get products by category and subcategory
exports.getProductsByCategoryAndSubcategory = async (req, res) => {
    try {
        const { category, subcategory } = req.query;

        console.log(category);
        console.log(subcategory);

        const products = await Product.findAll({
            where: { category, subcategory },
            include: [
                { model: ProductImage },
                { model: ProductWebsite }
            ]
        });

        res.status(200).json({ products });
    } catch (error) {
        console.error('Error getting products:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Delete a product by productId
exports.deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;

        // Delete product and associated images and websites (cascading delete)
        await Product.destroy({
            where: { productId },
            cascade: true
        });

        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
