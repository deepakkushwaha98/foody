import User from "../models/user.model.js"

export const getCurrentUser = async (req,res) =>{
    try{
        const userId = req.userId
        if(!userId){
            return res.status(400).json({message: "userId is not found"})
        }

           const user = await User.findById(userId)
           if(!user){
               return res.status(400).json({message: "user is not found"})

           }

           return res.status(200).json(user)

    }
    catch(err){
        return res.status(500).json({message: "get current usr error"})

    }
}



export const updateUserLocation = async (req,res) =>{
    try{
        
        const {lat, lon} = req.body
        if(!lat || !lon){
            return res.status(400).json({message: "latitude or longitude is missing"})
        }

        const user = await User.findByIdAndUpdate(req.userId ,{
            location :{
                    type:"Point",
                    coordinates:[lon, lat]
                }
            
        }, {new: true})
        if(!user){
            return res.status(400).json({message: "userId is not found"})
        }
    
                
     return res.status(200).json({message: "user location updated successfully", user})    
    }
    catch(err){
        console.error("update user location error:", err)
        return res.status(500).json({message: "update user location error"})
    }
}
