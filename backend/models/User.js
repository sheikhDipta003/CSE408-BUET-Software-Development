const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
  },
  password: {
      type: String,
      required: true,
  },
  dob: {
    type: Date, 
    required: true,
  },
  wishlist: [
    {
      product: mongoose.Schema.Types.ObjectId,
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  notifications: [
    {
      title: {type: String},
      message: {type: String},
      date: {type: Date, default: Date.now},
      is_read: {type: Boolean, default: false},
    }
  ],
  price_drop: [
    {
      product: mongoose.Schema.Types.ObjectId,
      price: {type: Number}, 
      date: {type: Date, default: Date.now}
    }
  ],
  searches: [
    {
      search: {type: String},
      date: {type: Date, default: Date.now}
    }
  ], 
  //suggest change
  //1st option: keep voucher info both in user and in website, no need for expensive joins
  vouchers: [
    {
      web_id: {type: String, required: true}, 
      code: {type: String, required: true},
      description: {type: String},
      start_date: {type: Date},
      end_date: {type: Date},
      percent: {type: Number, min: 0},
      max_amount: {type: Number, min: 0},
    }
  ],
  //2nd option: keep voucher _id and website id in the user
  vouchers2: [{
    web_id: {type: String, required: true},
    voucher_id: mongoose.Schema.Types.ObjectId,
  }
  ]
}, 

{
  timestamps: true,
});

const User = mongoose.model('User', userSchema);

module.exports = User;