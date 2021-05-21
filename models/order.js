const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.SchemaTypes.ObjectId, ref: "Product" },
    price: Number,
    count: Number,
  },
  { timestamps: true }
);

const CartItem = mongoose.model("CartItem", cartItemSchema);

const orderSchema = new mongoose.Schema(
  {
    products: [cartItemSchema],
    total: { type: Number },
    user: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
    isComplete: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

module.exports.Order = Order;
module.exports.CartItem = CartItem;
