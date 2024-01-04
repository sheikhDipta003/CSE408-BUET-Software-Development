const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const webSchema = new Schema({
    name: {type: String, required: true},
    url: {type: String, required: true},
    date_added: {type: Date, default: Date.now},
    vouchers: [
        {
            description: {type: String},
            code: {type: String, required: true},
            start_date: {type: Date},
            end_date: {type: Date},
            percent: {type: Number, min: 0},
            max_amount: {type: Number, min: 0},
        }
    ],
    events: [
        {
            name: {type: String},
            venue: {type: String}, 
            date: {type: Date},
            desciption: {type: String},
        }
    ],
    //should website contain the list of products instead of separate product_website table????
});

const Wesite = mongoose.model('Website', webSchema);
  
module.exports = Website;