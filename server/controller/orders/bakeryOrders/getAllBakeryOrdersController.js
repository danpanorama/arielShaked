const mysql = require("../../../models/bakery");

const getAllBakeryOrdersController = async (req, res) => {
  try {

    const [orderRows] = await mysql.getAllBakeryOrders();
  
    if (orderRows.length === 0){
       return res.status(404).json({ message: "לא נמצאו הזמנות" });
    }
    
    const ordersWithItems = await Promise.all(orderRows.map(async (order) => {
      const [items] = await mysql.getBakeryOrderItemsByOrderId(order.id);
      return { ...order, items };
    }));

    res.json(ordersWithItems);
  } catch (err) {
    console.error("שגיאה בשליפת ההזמנות:", err);
    res.status(500).json({ message: "שגיאה בשרת" });
  }
};

module.exports.getAllBakeryOrdersController = getAllBakeryOrdersController;
