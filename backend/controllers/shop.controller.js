import Shop from "../models/shop.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";


export const createEditShop = async (req,res) =>{
    try{
        const {name , city , state , address} = req.body
        let image ;
        if(req.file){
            image = await uploadOnCloudinary(req.file.path)
        }
        console.log(req.file);
        
        let shop = await Shop.findOne({owner:req.userId})
        if(!shop){
             shop = await Shop.create({
            name , city , state , address, image , owner:req.userId
        })
        

        }
        else{
                shop = await Shop.findByIdAndUpdate(shop._id,{
                name , city , state , address, image , owner:req.userId

                },{new:true}
                    )
        }
        await shop.populate("owner items")
        return res.status(201).json(shop)


    }catch(err){
        return res.status(500).json({message: `create show err ${err}`})

    }

}


export const getMyShop = async(req, res) =>{
    try{
        const shop = await Shop.find({owner:req.userId}).populate("owner").populate({
            path:"items",
            options:{sort:{updateAt:-1}}
         })
        // ensure we always send a JSON response; convert null/undefined to []
        if(!shop || (Array.isArray(shop) && shop.length === 0)){
            return res.status(200).json([])
        }
        return res.status(200).json(shop)

    }
    catch(err){    
        return res.status(500).json({message:`get my shop err ${err}`})

    }
}



export const getShopByCity = async(req , res)=>{
    try{
        const {city} = req.params

        const shops = await Shop.find({
            city:{$regex:new RegExp(`^${city}$` ,"i")}
        }).populate('items')

        if(!shops){
            return res.status(400).json({message: "no shop found in your city"})
        }

        return res.status(200).json(shops)

    }
    catch(err){

        return res.status(500).json({message: `get by shop city err ${err}`})

    }
}


