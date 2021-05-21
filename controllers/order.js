const { Order, CartItem } = require("../models/order");

exports.createOrder = async (req, res, next) => {
  try {
    const user = req.profile;
    // Find current order of user, if does not exist, create a new one
    let order = await Order.find().and([
      { user: user._id },
      { isComplete: false },
    ]);
    const { productId, price } = req.body;
    const products = [];
    
    if (!order) {
      const cart = new CartItem({ product: productId, price, count: 1 });
      products.push(cart);
      order = new Order({
        products,
        total: price,
        user: user._id,
        isComplete: false,
      });
    } else {

      const index = order.products.findIndex(prod => prod._id === productId);
      if (index === -1) {
        const cart = new CartItem({ product, price, count: 1 });
        order.products.push(cart);
        await order.save();
      } else {
      }
    }
  } catch (ex) {
    next(ex);
  }
};
