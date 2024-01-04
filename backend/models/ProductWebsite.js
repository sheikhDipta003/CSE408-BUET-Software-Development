const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const prwebSchema = new Schema({
    //store the _id created in product and website schema as a string
    product_id: {type: String, required: true},
    website_id: {type: String, required: true}, 
    shipping_time: {type: Number, min: 0},
    is_free: {type: Boolean},
    price: {type: Number, min: 0},
    stock: {type: Number, min: 0},
    price_record: [
        {
            date: {type: Date},
            price: {type: Number, min: 0},
        }
    ], 
    rating: {type: Number, min: 0},
    reviews:[
        {
            text: {type: String},
        }
    ]
});


const PrWeb = mongoose.model('PrWeb', prwebSchema);
  
module.exports = PrWeb;