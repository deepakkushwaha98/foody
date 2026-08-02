import User from "../models/user.model.js";
import Shop from "../models/shop.model.js";
import Order from "../models/order.model.js";
import DeliveryAssignment from "../models/deliveryAssigment.js";

export const getAllUsers = async (req,res)=>{
  const users = await User.find().select("-password");

  res.json({
    success:true,
    users
  })
}

export const getAllShops = async (req, res) => {

   const shops = await Shop.find()
   .populate("owner","fullName email mobile");

   res.json({
      success: true,
      shops
   });

};


export const getAllOrders = async (req, res) => {
  const orders = await Order.find()
    .populate("user", "fullName email mobile")
    .populate({
      path: "shopOrders.shop",
      select: "name address image owner",
      populate: { path: "owner", select: "fullName email mobile" },
    })
    .populate({
      path: "shopOrders.assignedDeliveryBoy",
      select: "fullName email mobile",
    })
    .populate({
      path: "shopOrders.shopOrderItem.item",
      select: "name image",
    });   
  res.json({
    success: true,
    orders,
  });
};



export const getDeliveryAssignments = async (req,res)=>{

   const data = await DeliveryAssignment.find()
   .populate("order")
   .populate("assignedTo","fullName mobile");

   res.json({
      success:true,
      data
   });

};