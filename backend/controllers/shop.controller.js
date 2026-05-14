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
        console.log('getMyShop called for user:', req.userId)
        const shop = await Shop.find({owner:req.userId}).populate("owner").populate({
            path:"items",
            options:{sort:{updateAt:-1}}
         })
        console.log('getMyShop result count:', Array.isArray(shop)? shop.length : 0)
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
        const cityParam = String(req.params.city || "").trim();
        if (!cityParam) {
            return res.status(400).json({ message: "city is required" });
        }

        const searchCity = cityParam.replace(/^New\s+/i, '');

        const shops = await Shop.find({
            city: { $regex: new RegExp(searchCity, "i") }
        }).populate('items');

        // If no shops found, return an empty array rather than an error.
        return res.status(200).json(shops);

    }
    catch(err){
        // eslint-disable-next-line no-console
        console.error('getShopByCity error:', err)
        return res.status(500).json({message: `get by shop city err ${err}`})
    }
}

export const getAllShops = async(req, res) => {
    try {
        const shops = await Shop.find({}).populate('items').populate('owner');
        return res.status(200).json(shops);
    } catch (err) {
        return res.status(500).json({message: `get all shops err ${err}`});
    }
}


