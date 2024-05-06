import Executive from "../models/executive.model.js"
import jwt from 'jsonwebtoken'
import { asyncHandler } from "../utils/asyncHandler.js"
import { apiError } from "../utils/apiError.js"


export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const cookie=req?.headers?.cookie
        const tokens = cookie.split(';')
        const token = tokens[0].split('=')[1]
        
        if(!token){
            throw new apiError(401,"Unauthorized Access")
        }
    
        const decodedToken =jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)  
        const executive = await Executive.findById(decodedToken?._id).select("-password -refreshToken")
    
        if(!executive){
            throw new apiError(401,"Invalid Access Token")
        }
    
        req.executive =executive;
        next()
    } catch (error) {
        throw new apiError(401,error?.message || "Invalid accesss token")
}
})