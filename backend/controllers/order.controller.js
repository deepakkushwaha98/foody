import mongoose from "mongoose"
import Shop from "../models/shop.model.js"
import Order from "../models/order.model.js"
import User from "../models/user.model.js"
import Item from "../models/item.model.js"
import DeliveryAssignment from "../models/deliveryAssigment.js"
import { sendDeliveryOtpMail } from "../utils/emailService.js"
import { resolveCouponDiscount } from "../utils/coupons.js"

const buildOrderPricing = async (reqUserId, cartItems, deliveryAddress, paymentMethod, paymentMeta = {}) => {
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
        const error = new Error("cart is empty")
        error.statusCode = 400
        throw error
    }

    const outletIds = [...new Set(cartItems.map((item) => String(item?.shop?._id || item?.shop || item?.shopId || "")).filter(Boolean))]
    if (outletIds.length !== 1) {
        const error = new Error("Orders from multiple outlets are not allowed.")
        error.statusCode = 400
        throw error
    }

    const outletId = outletIds[0]
    const shop = await Shop.findById(outletId).populate("owner", "name fullName")
    if (!shop) {
        const error = new Error("shop not found")
        error.statusCode = 400
        throw error
    }

    const itemIds = [...new Set(cartItems.map((item) => String(item?.id || item?._id || item?.itemId || "")).filter(Boolean))]
    const menuItems = await Item.find({ _id: { $in: itemIds }, shop: outletId })
    const itemMap = new Map(menuItems.map((item) => [String(item._id), item]))

    const shopOrderItem = cartItems.map((cartItem) => {
        const itemId = String(cartItem?.id || cartItem?._id || cartItem?.itemId || "")
        const menuItem = itemMap.get(itemId)

        if (!menuItem) {
            const error = new Error("This item is no longer available.")
            error.statusCode = 400
            throw error
        }

        const quantity = Number(cartItem?.quantity || 0)
        if (quantity <= 0) {
            const error = new Error("Invalid item quantity")
            error.statusCode = 400
            throw error
        }

        return {
            item: menuItem._id,
            name: menuItem.name,
            image: menuItem.image,
            price: Number(menuItem.price),
            quantity,
        }
    })

    const subtotal = shopOrderItem.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0)
    const platformFee = subtotal > 0 ? 8 : 0
    const packagingCharges = subtotal > 0 ? Math.max(20, Math.round(subtotal * 0.015)) : 0
    const taxAmount = Math.round(subtotal * 0.05)
    const deliveryCharges = subtotal > 500 ? 0 : 40
    const couponResult = resolveCouponDiscount(paymentMeta.couponCode, subtotal)
    const discountAmount = couponResult.valid ? couponResult.discountAmount : 0
    const totalAmount = Math.max(0, subtotal + platformFee + packagingCharges + taxAmount + deliveryCharges - discountAmount)

    return {
        outletId,
        shop,
        shopOrder: {
            shop: shop._id,
            owner: shop.owner?._id,
            subtotal,
            shopOrderItem,
        },
        pricing: {
            subtotal,
            platformFee,
            packagingCharges,
            taxAmount,
            deliveryCharges,
            discountAmount,
            totalAmount,
        },
        deliveryAddress,
        paymentMethod,
        paymentMeta,
    }
}

export const placeOrder = async(req , res)=>{
    try{
        const {cartItems,paymentMethod ,deliveryAddress ,couponCode } = req.body
        if(!deliveryAddress?.text || !deliveryAddress?.latitude || !deliveryAddress?.longitude){
            return res.status(400).json({message:"send complete delivery address"})
        }
        const orderData = await buildOrderPricing(req.userId, cartItems, deliveryAddress, paymentMethod, { couponCode })
        const newOrder = await Order.create({
            user:req.userId,
            paymentMethod,
            paymentStatus: "paid",
            outletId: orderData.outletId,
            deliveryAddress: orderData.deliveryAddress,
            totalAmount: orderData.pricing.totalAmount,
            subtotal: orderData.pricing.subtotal,
            platformFee: orderData.pricing.platformFee,
            packagingCharges: orderData.pricing.packagingCharges,
            taxAmount: orderData.pricing.taxAmount,
            deliveryCharges: orderData.pricing.deliveryCharges,
            discountAmount: orderData.pricing.discountAmount,
            shopOrders:[orderData.shopOrder]

        })

        await newOrder.populate("shopOrders.shopOrderItem.item", "name image price")
        await newOrder.populate("shopOrders.shop" , "name")
        await newOrder.populate("shopOrders.owner" , "name socketId")
        await newOrder.populate("user" , "name email mobile")
        
        const io  = req.app.get("io")
        if(io){
            newOrder.shopOrders.forEach(shopOrder=>{
                const ownerSocketId = shopOrder.owner.socketId
                console.log("📡 Emitting newOrder to owner:", shopOrder.owner.fullName, "Socket ID:", ownerSocketId)
                if(ownerSocketId){
                    io.to(ownerSocketId).emit("newOrder" , {
                     _id:newOrder._id,
                     paymentMethod:newOrder.paymentMethod,
                     user:newOrder.user,
                     shopOrders:shopOrder,
                    createdAt:newOrder.createdAt,
                    deliveryAddress:newOrder.deliveryAddress
     
                    })
                    console.log("newOrder emitted successfully")
                } else {
                    console.log(" Owner socket ID not found for:", shopOrder.owner.fullName)
                }
                
            })
           
       
        }






        return res.status(201).json(newOrder)


    }
    catch(err){
        return res.status(500).json({message: `place order error ${err}`})

    }


}



export const getMyOrders = async (req,res)=>{
    try{
        console.log('getMyOrders called for user:', req.userId);
        const user = await User.findById(req.userId)
        if(!user){
            return res.status(404).json({message: "User not found"})
        }
         if(user.role == "user"){
             const orders = await Order.find({user:req.userId})
        .sort({createdAt:-1})
        .populate({
            path: 'shopOrders.shop',
            select: 'name'
        })
        .populate({
            path: 'shopOrders.owner',
            select: 'name email mobile'
        })
        .populate({
            path: 'shopOrders.shopOrderItem.item',
            select: 'name image price'
        })
        .populate("shopOrders.assignedDeliveryBoy" ,"fullName mobile")

        return res.status(200).json(orders)


         }
         else if(user.role == "owner"){
             const orders = await Order.find({"shopOrders.owner":req.userId})
        .sort({createdAt:-1})
        .populate({
            path: 'shopOrders.shop',
            select: 'name'
        })
        .populate({
            path: 'user'
        })
        .populate({
            path: 'shopOrders.shopOrderItem.item',
            select: 'name image price'
        })
        const filteredOrders = orders.map((order => ({
            _id:order._id,
            paymentMethod:order.paymentMethod,
            user:order.user,
            shopOrders:order.shopOrders.find(o=>o.owner._id==req.userId),
            createdAt:order.createdAt,
            deliveryAddress:order.deliveryAddress
        })));

        return res.status(200).json(filteredOrders)


         }
       
    }
    catch(err){
        console.error('getMyOrders error:', err);
        return res.status(500).json({message: `get User order errr ${err}`})
    }
}


export const getMostOrderedItems = async (req, res) => {
    try {
        const ownerId = new mongoose.Types.ObjectId(req.userId)
        const shop = await Shop.findOne({ owner: req.userId }).populate({
            path: "items",
            select: "name image category",
        })

        const itemLookup = new Map((shop?.items || []).map((item) => [String(item._id), item]))
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

        const groupedItems = await Order.aggregate([
            {
                $match: {
                    "shopOrders.owner": ownerId,
                    createdAt: { $gte: sevenDaysAgo },
                },
            },
            { $unwind: "$shopOrders" },
            {
                $match: {
                    "shopOrders.owner": ownerId,
                },
            },
            { $unwind: "$shopOrders.shopOrderItem" },
            {
                $group: {
                    _id: "$shopOrders.shopOrderItem.item",
                    totalOrders: {
                        $sum: {
                            $ifNull: ["$shopOrders.shopOrderItem.quantity", 1],
                        },
                    },
                },
            },
            {
                $sort: {
                    totalOrders: -1,
                },
            },
            { $limit: 5 },
            {
                $lookup: {
                    from: "items",
                    localField: "_id",
                    foreignField: "_id",
                    as: "itemDetails",
                },
            },
            {
                $unwind: {
                    path: "$itemDetails",
                    preserveNullAndEmptyArrays: true,
                },
            },
        ])

        const mostOrdered = groupedItems
            .filter((item) => item._id)
            .map((item) => {
                const shopItem = itemLookup.get(String(item._id))
                return {
                    foodId: item._id,
                    image: shopItem?.image || item.itemDetails?.image || "",
                    name: shopItem?.name || item.itemDetails?.name || "Untitled item",
                    category: shopItem?.category || item.itemDetails?.category || "Uncategorized",
                    totalOrders: item.totalOrders || 0,
                }
            })

        return res.status(200).json(mostOrdered)
    } catch (err) {
        console.error("getMostOrderedItems error:", err)
        return res.status(500).json({ message: `get most ordered items error ${err.message || err}` })
    }
}


export const rateOrderItem = async (req, res) => {
    try {
        const { orderId, shopOrderId, shopOrderItemId, rating, review } = req.body
        const userId = req.userId
        const value = Number(rating)

        if (!orderId || !shopOrderId || !shopOrderItemId || !value || value < 1 || value > 5) {
            return res.status(400).json({ message: "Invalid rating request" })
        }

        const order = await Order.findById(orderId)
        if (!order || String(order.user) !== String(userId)) {
            return res.status(404).json({ message: "Order not found" })
        }

        const shopOrder = order.shopOrders.id(shopOrderId) || order.shopOrders.find((o) => String(o._id) === String(shopOrderId))
        if (!shopOrder) {
            return res.status(404).json({ message: "Shop order not found" })
        }

        if (shopOrder.status !== "delivered") {
            return res.status(400).json({ message: "You can only rate delivered orders" })
        }

        const orderItem = shopOrder.shopOrderItem.id(shopOrderItemId) || shopOrder.shopOrderItem.find((item) => String(item._id) === String(shopOrderItemId))
        if (!orderItem) {
            return res.status(404).json({ message: "Ordered item not found" })
        }

        const product = await Item.findById(orderItem.item)
        if (!product) {
            return res.status(404).json({ message: "Food item not found" })
        }

        const existingRating = orderItem.rating?.value
        const existingUser = orderItem.rating?.user && String(orderItem.rating.user) === String(userId)

        if (existingRating && !existingUser) {
            return res.status(400).json({ message: "This item has already been rated" })
        }

        if (existingRating && existingUser) {
            const previousValue = Number(orderItem.rating.value || 0)
            if (product.rating.count > 0) {
                product.rating.average = ((product.rating.average * product.rating.count - previousValue + value) / product.rating.count)
            } else {
                product.rating.average = value
                product.rating.count = 1
            }
        } else {
            const totalPoints = (product.rating.average || 0) * (product.rating.count || 0)
            product.rating.count = (product.rating.count || 0) + 1
            product.rating.average = (totalPoints + value) / product.rating.count
        }

        product.rating.average = Number(product.rating.average.toFixed(2))
        await product.save()

        orderItem.rating = {
            user: userId,
            value,
            review: review || "",
            ratedAt: new Date(),
        }

        await order.save()

        return res.status(200).json({
            itemId: String(orderItem.item),
            shopOrderId: String(shopOrder._id),
            orderItemId: String(orderItem._id),
            rating: orderItem.rating,
            averageRating: product.rating.average,
            ratingCount: product.rating.count,
        })
    } catch (err) {
        console.error("rateOrderItem error:", err)
        return res.status(500).json({ message: `rate item error ${err.message || err}` })
    }
}




export const updateOrderStatus = async (req,res)=>{
    try{
        const {orderId , shopId} = req.params
        const {status} = req.body
        const io = req.app.get("io")

        const order = await Order.findById(orderId)
        if(!order){
            return res.status(404).json({message: "order not found"})
        }

        const shopOrder = order.shopOrders.id(shopId) || order.shopOrders.find(o=>String(o.shop)===String(shopId))
       if(!shopOrder){
        return res.status(404).json({message:"no shop order Found"})

       }

       shopOrder.status = status

       // Track delivery timestamp when order is marked as delivered
       if(status === "delivered"){
         shopOrder.deliveredAt = new Date()
       }

       let deliveryBoysPayload = []
    if(status=="out of delivery"){
     if(status =="out of delivery" && !shopOrder.assignment){
          // Find and assign delivery boys
          const {longitude , latitude} = order.deliveryAddress
          console.log("Delivery address:", order.deliveryAddress)
          if (!longitude || !latitude || isNaN(longitude) || isNaN(latitude)) {
            return res.status(400).json({ message: "Invalid delivery address coordinates" })
          }
          const nearByDeliveryBoys = await User.find({
            role:"deliveryBoy",
            location: {
              $nearSphere: {
                $geometry: {
                  type: "Point",
                  coordinates: [Number(longitude), Number(latitude)]
                },
                $maxDistance: 100000
              }
            }
          })
          console.log("Nearby delivery boys found:", nearByDeliveryBoys.length, nearByDeliveryBoys.map(b => ({name: b.fullName, loc: b.location.coordinates})))

                  const nearByIds = nearByDeliveryBoys.map(d=>d._id)
                  const busyIds = await DeliveryAssignment.find({assignedTo:{$in:nearByIds} , status:{$nin:["completed" , "broadcasted"]}}).distinct("assignedTo")


                  const busyIdSet = new Set(busyIds.map(id => id.toString()));

                  const  avialableBoys = nearByDeliveryBoys.filter(d=>!busyIdSet.has(d._id.toString()));
                 const candidate = avialableBoys.map(d=>d._id)

                 if(candidate.length ==0){
                  await order.save()
                  return res.status(200).json({
                      shopOrder:shopOrder,
                      assignedDeliveryBoy: shopOrder.assignedDeliveryBoy,
                      availableBoys: [],
                      assignment: null,
                      message:"order status updated but there is no available delivery boys"
                  })
                 }

                 
                 
                   const newDeliveryAssignment = await DeliveryAssignment.create({
                   order:order._id,
                   shop:shopOrder.shop,
                   shopOrderId:shopOrder._id,
                   broadcastedTo:candidate,
                   status:"broadcasted"
                 
                  })


                   

                   shopOrder.assignment = newDeliveryAssignment._id
                   deliveryBoysPayload = avialableBoys.map(d=>({
                       id:d._id,
                       fullName:d.fullName,
                       longitude:d.location.coordinates[0],
                       latitude:d.location.coordinates[1],
                       mobile:d.mobile,
                       socketId:d.socketId
                   }))
                } else {
                    // Assignment exists, get the broadcasted boys
                    const assignment = await DeliveryAssignment.findById(shopOrder.assignment).populate('broadcastedTo', 'fullName mobile location socketId');
                    if(assignment && assignment.broadcastedTo){
                        deliveryBoysPayload = assignment.broadcastedTo.map(d=>({
                            id:d._id,
                            fullName:d.fullName,
                            longitude:d.location.coordinates[0],
                            latitude:d.location.coordinates[1],
                            mobile:d.mobile,
                            socketId:d.socketId
                        }))
                    }
                } 

                // NOTE: Model.populate requires documents + options; the previous call here was incorrect and caused runtime errors.
                // If you need to populate the newly created assignment, you can do so directly on the document.
                // e.g. await newDeliveryAssignment?.populate('order')

                if(io && deliveryBoysPayload.length > 0){
                    console.log("📡 Emitting newAssignment to", deliveryBoysPayload.length, "delivery boys")
                    deliveryBoysPayload.forEach(boy=>{
                        const boySocketId = boy.socketId
                        if(boySocketId){
                            io.to(boySocketId).emit("newAssignment" , {
                                sentTO:boy.id,
                                assignmentId:DeliveryAssignment?._id,
                                orderId:order._id,
                                shopName:shopOrder.shop?.name,
                                deliveryAddress:order.deliveryAddress,
                                items: shopOrder.shopOrderItem || [],
                                subtotal: shopOrder.subtotal || 0
                            })
                            console.log("newAssignment emitted to delivery boy:", boy.fullName, "Socket:", boySocketId)
                        } else {
                            console.log(" Delivery boy socket ID not found:", boy.fullName)
                        }
                    })
                } else {
                    console.log(" No delivery boys available or io not available, payload length:", deliveryBoysPayload?.length)
                }
       }
       
       await order.save()
       
       // Refetch the shopOrder after save to get updated assignment
       const updatedShopOrder = order.shopOrders.id(shopId) || order.shopOrders.find(o=>String(o.shop)===String(shopId))
       
       await order.populate("shopOrders.shop" ,"name ")
       await order.populate("shopOrders.assignedDeliveryBoy" ,"fullName email mobile")
       
          
       await order.populate("user", "socketId fullName email mobile")

       if(io){
        const userSocketId = order.user.socketId
        console.log("📡 Emitting update-status to user:", order.user.fullName, "Socket ID:", userSocketId)
        if(userSocketId){
          io.to(userSocketId).emit("update-status",{
          orderId:order._id,
          shopId:shopOrder.shop._id,
          status:shopOrder.status,
          userId:order.user._id,
       })
       console.log(" update-status emitted successfully")
        } else {
          console.log("User socket ID not found for:", order.user.fullName)
        }
       }















    return res.status(200).json({
        shopOrder:updatedShopOrder,
        assignedDeliveryBoy:updatedShopOrder?.assignedDeliveryBoy,
        availableBoys:deliveryBoysPayload,
        assignment:updatedShopOrder?.assignment?._id,

       })

    }
    catch(err){
        console.error('updateOrderStatus error:', err)
        return res.status(500).json({message: `get User order error ${err}`})

    }
}







export const getDeliveryBoyAssigment = async(req,res)=>{
    try{
        const deliveryBoyId = req.userId
        console.log(`deliveryBoy ${deliveryBoyId} fetching assignments`)
        const assignments = await DeliveryAssignment.find({
            broadcastedTo:deliveryBoyId,
            status:"broadcasted"
        })
        .populate('order')
        .populate('shop')

        // remove orphaned assignments before formatting
        for(const a of assignments){
            if(!a.order){
                console.warn("assignment without order, deleting", a._id)
                try{
                    await DeliveryAssignment.findByIdAndDelete(a._id)
                }catch(e){ console.error("failed to cleanup assignment", a._id, e) }
            }
        }
        const formated = assignments.map(a=>{
            if(!a.order) return null
            const shopOrder = a.order.shopOrders?.find(so=>String(so._id)===String(a.shopOrderId))
            return {
                assignmentId:a._id,
                orderId:a.order._id,
                shopName:a.shop?.name,
                deliveryAddress:a.order.deliveryAddress,
                items: shopOrder?.shopOrderItem || [],
                subtotal: shopOrder?.subtotal
            }
        }).filter(x=>x)

        return res.status(200).json(formated)

    }
    catch (err) {
        console.error("error in getDeliveryBoyAssigment", err)
        return res.status(500).json({message: `get Assignment error ${err.message || err}`})

    }
}




export  const acceptOrder = async(req,res)=>{
    try{
        const {assignmentId} = req.params
        const assignment = await DeliveryAssignment.findById(assignmentId)
        if(!assignment){
            return res.status(404).json({message:"assignment not found"})
        }
        if(assignment.status !== "broadcasted"){
            return res.status(400).json({message:"assignment not available"})
        }

        const alreadyAssigned = await DeliveryAssignment.findOne({
            assignedTo:req.userId,
            status:{$nin:["broadcasted", "completed"]}

        })

        if(alreadyAssigned){
            return res.status(400).json({message:"you have already accepted another order"})
        }

        assignment.assignedTo = req.userId
        assignment.status = "assigned"
        assignment.acceptedAt = new Date()
        await assignment.save()
        
        const order = await Order.findById(assignment.order)
        if(!order){
            return res.status(404).json({message:"order not found"})
        }
        const shopOrder = order.shopOrders.find(so=>so.id == assignment.shopOrderId)
        shopOrder.assignedDeliveryBoy = req.userId
        await order.save()
         
         return res.status(200).json({message:"order accepted successfully"})

    }
    catch(err){
        return res.status(500).json({message: `accept order error ${err}`}) 
    }
}











export const getCurrentOrder = async(req,res)=>{
    try{
        const assignment = await DeliveryAssignment.findOne({
            assignedTo:req.userId , 
            status:"assigned"})

        .populate("shop" ,"name")
        .populate("assignedTo" ,"fullName email mobile location") 
        .populate({
            path: "order",
            populate: [{path:"user", select:"fullName email mobile"},{path:"shopOrders.shop", select:"name"}],
         })
        

        if(!assignment){
            return res.status(404).json({message:"no current assignment"})
        }
        if(!assignment.order){
            return res.status(404).json({message:"order not found for this assignment"})
        }

        const shopOrder = assignment.order.shopOrders.find(so=>String(so._id)===String(assignment.shopOrderId))
        if(!shopOrder){
            return res.status(404).json({message:"shop order not found for this assignment"})
        }

        let deliveryBoyLocation = {lat:null, lon:null}
        // ensure coordinates array has two numbers
        if(Array.isArray(assignment.assignedTo.location?.coordinates) && assignment.assignedTo.location.coordinates.length === 2){
           deliveryBoyLocation.lat = assignment.assignedTo.location.coordinates[1]
           deliveryBoyLocation.lon = assignment.assignedTo.location.coordinates[0]
        }
       
        let customerLocation = {lat:null, lon:null}
        if(assignment.order.deliveryAddress){
            
           customerLocation.lat = assignment.order.deliveryAddress.latitude
           customerLocation.lon = assignment.order.deliveryAddress.longitude


        }

        return res.status(200).json({
            _id:assignment.order._id,
            user:assignment.order.user,
            shopOrder:shopOrder,
            deliveryAddress:assignment.order.deliveryAddress,
            deliveryBoyLocation:deliveryBoyLocation,
            customerLocation:customerLocation
        })




    }
    catch(err){
        return res.status(500).json({message: `get current order error ${err}`})
    }
}
















export const getOrderById = async(req,res)=>{
    try{
        const {orderId} = req.params
        const order = await Order.findById(orderId)
        .populate("user")
        .populate({
            path:"shopOrders.shop",
            model:"Shop"
        })
        .populate({
            path:"shopOrders.shopOrderItem.item",
            model:"Item"
        })
        .populate({
            path:"shopOrders.assignedDeliveryBoy",
            model:"User",
            select: "fullName email mobile location"
        })

        if(!order){
            return res.status(404).json({message:"order not found"})
        }
        

        return res.status(200).json({order})
    }
    catch(err){
        return res.status(500).json({message: `get order by id error ${err}`})
    }
}



export const sendDeliveryOtp = async(req,res)=>{
    try{
        const {orderId , shopOrderId} = req.body
        const order = await Order.findById(orderId)
        .populate("user")
        const shopOrder = order.shopOrders.id(shopOrderId) 
        if(!shopOrder || !order){
            return res.status(404).json({message:"shop order not found"})
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString()
        shopOrder.deliveryOtp = otp
        shopOrder.otpExpires = (Date.now() + 5*60*1000) // 5 mins expiry

        await order.save()

        await sendDeliveryOtpMail(order.user, otp)
        
        return res.status(200).json({message:`OTP sent to successfuly to ${order.user.fullName}`})




    }    catch(err){
        return res.status(500).json({message: `send delivery otp error ${err}`})
    }
}




export const verifyDeliveryOtp = async(req,res)=>{
    try{
        const {orderId , shopOrderId , otp} = req.body
        const order = await Order.findById(orderId)
          .populate("user", "fullName email mobile socketId")
          .populate("shopOrders.shop", "name")

        const shopOrder = order.shopOrders.id(shopOrderId)
        if(!shopOrder || !order){
            return res.status(404).json({message:"shop order not found"})
        }
        if(shopOrder.deliveryOtp !== otp || !shopOrder.otpExpires || shopOrder.otpExpires < Date.now()){
            return res.status(400).json({message:"invalid otp"})
        }
        
        shopOrder.status = "delivered"
        shopOrder.deliveredAt = new Date()
        await order.save()

        
        // Notify user and delivery boy in real-time
        const io = req.app.get("io")
        if(io){
          const userSocketId = order.user?.socketId
          if(userSocketId){
            io.to(userSocketId).emit("update-status", {
              orderId: order._id,
              shopId: shopOrder.shop._id,
              status: shopOrder.status,
              userId: order.user._id,
            })
          }

          if(shopOrder.assignedDeliveryBoy){
            const deliveryBoy = await User.findById(shopOrder.assignedDeliveryBoy)
            if(deliveryBoy?.socketId){
              io.to(deliveryBoy.socketId).emit("update-status", {
                orderId: order._id,
                shopId: shopOrder.shop._id,
                status: shopOrder.status,
                userId: order.user._id,
              })
            }
          }
        }

        await DeliveryAssignment.deleteOne({
            shopOrderId:shopOrder._id,
            order:order._id,
            assignedTo:shopOrder.assignedDeliveryBoy
       })
        return res.status(200).json({message:"order delivered successfully"})  
    }
    catch(err){
        return res.status(500).json({message: `verify delivery otp error ${err}`})
    }
}





