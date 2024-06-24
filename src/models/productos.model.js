import mongoose from "mongoose";

const productoSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  stock: { type: Number, required: true },
  image: {
    type: String,
    required: true,
    default:
      "https://images.ctfassets.net/h8q6lxmb5akt/5qXnOINbPrHKXWa42m6NOa/421ab176b501f5bdae71290a8002545c/nba-logo_2x.png",
  },
});
const productModel = mongoose.model("Producto", productoSchema);
export default productModel;