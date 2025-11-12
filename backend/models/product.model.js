import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String },
  precio: { type: Number, required: true },
  imagen: { type: String },
  categoria: { type: String, enum: ['burger', 'hotdog'], required: true },
  disponible: { type: Boolean, default: true }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
export default Product;