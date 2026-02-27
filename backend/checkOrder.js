import connectdb from "./config/db.js";
import Order from "./models/order.model.js";
import User from "./models/user.model.js";

connectdb().then(async () => {
  // Check specific order
  if (process.argv[2]) {
    const order = await Order.findById(process.argv[2]);
    console.log("Order delivery address:", order?.deliveryAddress);
  } else {
    // Find recent orders
    const orders = await Order.find().sort({createdAt: -1}).limit(5).populate('user', 'fullName email role');
    console.log("Recent orders:");
    orders.forEach(o => console.log(`ID: ${o._id}, User: ${o.user?.fullName} (${o.user?.role}), Address: ${o.deliveryAddress?.text}`));
  }
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});