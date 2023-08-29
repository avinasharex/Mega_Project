import User from "../model/user.schema.js"
import JWT from "jsonwebtoken"
import asyncHandler from "../services/async.handler.js"
import customError from '../utils/cstom.error.js'
import config from "../config/index.js"

export const isLoggedIn = asyncHandler(async(req,res,next)=>{
    let token;

    if(req.cookies.token || (req.headers.authorization && req.headers.authorization.startsWith("Bearer"))){
      token =  req.cookies.token || req.headers.authorization.split(" ")[1]
    }

    if(!token){
        throw new customError("Not authorized to access this route", 400)
    }

    try {
        const decodedJWTPayload = await  JWT.verify(token, config.JWT_SECRET)
        // _id, find user based on id, set this in req.user
        req.user = await User.findById(decodedJWTPayload._id, "name, email, role")
        next()
    } catch (e) {
        throw new customError("Not authorized to access this route", 401)
    }
})