const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: {type: String, required: true},
    brand: {type: String, required: true},
    images: [
        {
            img_path: {type: String, required: true},
            img_order: {type: Number, min: 1}
        }
    ],
    category: [
        {
            cat_type: {type: String},
        }
    ],
    subcategory: [
        {
            subcat_type: {type: String},
        }
    ],
    specifications: [
        {
            spec_type: {type: String},
            spec_val: {type: String},
        }
    ],
    //should color and dimensions be general specifications????
    //if not then delete the following: color width height
    color: {type: String},
    width: {type: Number, min: 0},
    height: {type: Number, min: 0},
});


const Product = mongoose.model('Product', productSchema);
  
module.exports = Product;