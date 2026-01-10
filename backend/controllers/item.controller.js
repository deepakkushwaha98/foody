import Shop from "../models/shop.model.js";
import Item from "../models/item.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

export const addItem = async (req,res) =>{
    try{
        const {name , category , foodType , price} = req.body
        let image;
        if(req.file){
            image = await uploadOnCloudinary(req.file.path)
        }
        
        const shop = await Shop.findOne({owner:req.userId})
        if(!shop){
           return res.status(400).json({message:"shop not found"})
        }
        const item = await Item.create({
            name , category , foodType , price , image , shop:shop._id
        })

        shop.items.push(item._id)
        await shop.save()
        await shop.populate("owner")
        await shop.populate({
            path:"items",
            option:{sort:{updateAt:-1}}
         })

        return res.status(201).json(shop)

    }
    catch(err){
        console.error('addItem error:', err)
        return res.status(500).json({message: `addItem errr ${err}`})

    }
}


export const editItem = async(req,res)=>{
    try{
        const itemId = req.params.itemId
        const {name , category , foodType , price} = req.body
        let image;
        if(req.file){
            image = await uploadOnCloudinary(req.file.path)
        }

        const updateObj = { name, category, foodType, price }
        if (image) updateObj.image = image

        const item = await Item.findByIdAndUpdate(itemId,
            updateObj,
            { new: true, runValidators: true, context: 'query' }
        )

         if(!item){
            return res.status(400).json({message:"item not found"})
         }

         const shop = await Shop.findOne({owner:req.userId}).populate({
            path:"items",
            options:{sort:{updateAt:-1}}
         })

         return res.status(200).json(shop)

    }
    catch(err){
         console.error('editItem error:', err)
         if (err.name === 'ValidationError') {
              return res.status(400).json({ message: 'Validation error', details: err.errors })
         }
         return res.status(500).json({message: `editItem errr ${err}`})

    }

}


export const getItemByID = async(req,res) =>{
    try{
        const itemId = req.params.itemId
        const item = await Item.findById(itemId)

        if(!item){
            return res.status(401).json({message: "Item not found"})
        }
        return res.status(200).json(item);

    }
    catch(err){
        console.error('getItemByID error:', err)
        return res.status(500).json({message:`get item by id err ${err}`})  
    }
}





export const deleteItem = async(req , res)=> {
    try{
        const itemId = req.params.itemid || req.params.itemId
        const item = await Item.findByIdAndDelete(itemId)

        if(!item){
            return res.status(400).json({message: "item not found"})
        }

        const shop = await Shop.findOne({owner: req.userId})
        if(!shop){
            return res.status(400).json({message: "shop not found"})
        }

        shop.items = shop.items.filter(i => i.toString() !== item._id.toString())
        await shop.save()
        await shop.populate({
            path:"items",
            options: {sort :{updatedAt:-1}}
        })
        return  res.status(200).json(shop)

    }
    catch(err){
        return res.status(500).json({message : `delete item error ${err}`})

    }
}





export const getItemByCity = async(req , res)=>{
    try{
        const {city} = req.params
        if(!city){
            return res.status(400).json({message: "city is required"})
        }
         const shops = await Shop.find({
            city:{$regex:new RegExp(`^${city}$` ,"i")}
        }).populate('items')

         if(!shops){
            return res.status(400).json({message: "no shop found in your city"})
        }

        const shopIds = shops.map((shop)=>shop._id)

        const items = await Item.find({shop:{$in:shopIds}})
        return res.status(200).json(items)



    }
    catch(err){
         return res.status(500).json({message : ` shop item error ${err}`})


    }
}