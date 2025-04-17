import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'product name must be provided'],
    },
    price: {
      type: Number,
      required: [true, 'product price must be provided'],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: 4.5,
    },
    company: {
      type: String,
      enum: {
        values: ['ikea', 'liddy', 'caressa', 'marcos'],
        message: '{VALUE} is not supported',
      },
      // enum: ['ikea', 'liddy', 'caressa', 'marcos'],
    },
  },
  { timestamps: true }
);
const Product = mongoose.model('Product', productSchema);
export default Product;
