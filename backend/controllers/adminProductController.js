const Product = require('../models/Product');
const ProductWebsite = require('../models/ProductWebsite');

// Create a new product
//should be in admin
const createProduct = async (req, res) => {
    try {
        // Extract data from request body
        const { productName, brand, imagePath, category, subcategory, color, width, height, websites } = req.body;

        // Create the product
        const product = await Product.create({
            productName:productName,
            brand:brand,
            imagePath:imagePath,
            category:category,
            subcategory:subcategory,
            color:color,
            width:width,
            height:height
        });

        // Create product images
        //await ProductImage.bulkCreate(images.map(image => ({ imageUrl: image.imageUrl, productId: product.productId })));

        // Create product websites
        await ProductWebsite.bulkCreate(websites.map(website => ({ ...website, productId: product.productId })));

        res.status(201).json({ message: 'Product created successfully', product });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


// Delete a product by productId
//should be in admin 
const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params.productId;

        // Delete product and associated images and websites (cascading delete)
        await Product.destroy({
            where: { productId:productId },
            cascade: true
        });

        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports={createProduct, deleteProduct};