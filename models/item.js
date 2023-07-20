const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price must be greater than 0'],
  },
  number_in_stock: {
    type: Number,
    required: true,
    validate: {
      validator: Number.isInteger,
      message: 'Number in stock must be an integer',
    },
  },
});

ItemSchema.virtual('url').get(function () {
  return `/items/${this._id}`;
});

ItemSchema.virtual('price_formatted').get(function () {
  return this.price.toFixed(2);
});

module.exports = mongoose.model('Item', ItemSchema);
