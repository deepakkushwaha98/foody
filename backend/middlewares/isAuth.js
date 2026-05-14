import jwt from "jsonwebtoken"


const isAuth = async (req , res , next) =>{
      try{
        const token = req.cookies.token || (req.headers.authorization ? req.headers.authorization.split(" ")[1] : null)
        if(!token){
            return res.status(401).json({message: "token not found"})
        }

        const decodeToken = jwt.verify(token , process.env.JWT_SECRET)

        if(!decodeToken){
            return res.status(401).json({message: "token not verified"})
        }
        // eslint-disable-next-line no-console
        console.log('isAuth token decoded:', decodeToken)
        req.userId = decodeToken.userId
        next()
      }
      catch(err){
        // eslint-disable-next-line no-console
        console.error('isAuth error:', err)
        return res.status(500).json({message: "isAuth error"})
      }
}

export {isAuth}