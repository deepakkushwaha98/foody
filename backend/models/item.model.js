import mongoose from "mongoose";

const itemSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    shop:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Shop"
    },
    category:{
        type:String,
        enum:["Snakes",
            "Main Course",
            "Desserts",
            "Pizza",
            "Burgers",
            "Sandwiches",
            "South Indian",
            "North Indian",
            "Chinese",
            "Fast Food",
            "others"
        ],
        required:true
    },
    price:{
        type:Number,
        min:0,
        require:true
    },
    foodType:{
        type:String,
        enum:["veg" , "non veg"],
        required:true

    }
   
},{timestamps:true})

const Item = mongoose.model("Item" , itemSchema)

export default Item