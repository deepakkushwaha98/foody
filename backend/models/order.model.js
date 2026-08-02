import mongoose from "mongoose"

const shopOrderItemSchema =new mongoose.Schema({
   item:{
      type:mongoose.Schema.Types.ObjectId,
        ref:"Item",
        required:true
   },
   name:String,
   price:{
    type:Number
   },
   quantity:Number,

},{timestamps:true})

const shopOrderSchema = new mongoose.Schema({
    shop:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Shop"

    },
    owner:{
         type:mongoose.Schema.Types.ObjectId,
        ref:"User"

    },
    subtotal:{
        type:Number
    },
    shopOrderItem:[shopOrderItemSchema],
    status:{
        type:String,
        enum:["pending" , "preparing" , "out of delivery" , "delivered"],
        default:"pending"
    },
    assignment:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"DeliveryAssignment",
        default:null
    },
    assignedDeliveryBoy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        
    },

    deliveryOtp :{
    type :String
    },
   
    otpExpires: {
    type: Date,  
    },

    deliveredAt: {
        type: Date,
        default: null
    }


},{timestamps:true})

const orderSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    outletId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Shop",
        default:null
    },
    paymentMethod:{
        type:String,
        enum:['cod' , 'online'],
        required:true
    },
    paymentStatus:{
        type:String,
        enum:['pending','paid','failed'],
        default:'pending'
    },
    paymentId:{
        type:String,
        default:null
    },
    deliveryAddress:{
        text:String,
        latitude:Number,
        longitude:Number
    },
    totalAmount:{
        type:Number 
    },
    subtotal:{
        type:Number,
        default:0
    },
    platformFee:{
        type:Number,
        default:0
    },
    packagingCharges:{
        type:Number,
        default:0
    },
    taxAmount:{
        type:Number,
        default:0
    },
    deliveryCharges:{
        type:Number,
        default:0
    },
    discountAmount:{
        type:Number,
        default:0
    },
    shopOrders:[shopOrderSchema]

},{timestamps:true})

const Order = mongoose.model("Order" , orderSchema)
export default Order