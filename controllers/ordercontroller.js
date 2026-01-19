import Order from "../models/Ordermodel.js";
import Menu from "../models/Menumodel.js";
import OrderItem from "../models/OrderItemmodel.js";

/**
 * Create new order (WhatsApp / Manual)
 */
export const createOrder = async (req, res) => {
  try {
    const { businessId, items } = req.body;

    if (!businessId || !items || items.length === 0) {
      return res.status(400).json({ message: "Invalid order data" });
    }

    // 1️⃣ Create empty order
    const order = await Order.create({
      businessId,
      totalAmount: 0
    });

    let totalAmount = 0;

    // 2️⃣ Loop items
    for (const item of items) {
      const menuItem = await Menu.findOne({
        _id: item.menuItemId,
        businessId
      });

      if (!menuItem) {
        return res.status(400).json({ message: "Menu item not found" });
      }

      if (!menuItem.isAvailable) {
        return res.status(400).json({ message: "Menu item unavailable" });
      }

      const itemTotal = menuItem.price * item.quantity;
      totalAmount += itemTotal;

      // 3️⃣ Create order item
      await OrderItem.create({
        orderId: order._id,
        menuItemId: menuItem._id,
        quantity: item.quantity,
        price: menuItem.price
      });
    }

    // 4️⃣ Update order total
    order.totalAmount = totalAmount;
    await order.save();

    res.status(201).json({
      message: "Order created successfully",
      orderId: order._id,
      totalAmount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
