import User from "../model/user.schema.js"
import asyncHandler from "../services/async.handler.js"
import customError from '../utils/cstom.error.js'

export const cookieOption = {
    expireIn: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
    // colud be in seperate file in utils
}

/*
@SIGNUP 
@route http://localhost:5000/api/auth/signup
@description User signup controller for creating a new user
@parameters name,email and password
@return User Object
*/

export const signup = asyncHandler(async(req,res,next)=>{
    const {name,email,password} = req.body

    if(!name || !email || !password){
        throw new customError("Please fill all the fields", 400)
    }

    const existingUser = await User.findOne({email})

    if(existingUser){
        throw new customError("User already exist", 400)
    }

    const user = await User.create({
        name,
        email,
        password
    })
    // While in schema we have already select false in password field but why we write user.password = undefined because select false only while query the data but at the first time creation of schema it send password

    const token = user.getJWTToken()
    user.password = undefined

    res.cookie("token", token, cookieOption)

    res.status(200).json({ 
        success: true,
        message: "User created successsfully",
        token,
        user
    })
})

/*
@LOGIN 
@route http://localhost:5000/api/auth/login
@description User login controller for logging a new user
@parameters email and password
@return User Object
*/

export const login = asyncHandler(async (req,res,next)=>{
    const {email,password} = req.body

    if(!email || !password){
        throw new customError("Email and password required", 400)
    }
    
    const user = await User.findOne({email}).select("+password")

    if(!user){
        throw new customError("Invalid credential", 400)
    }

    const isPasswordMatched = await user.comparePassword(password)

    if(isPasswordMatched){
       const token = user.getJWTToken()
       user.password = undefined
       res.cookie("token", token,  cookieOption)

       res.status(200).json({ 
        success: true,
        message: "User login successsfully",
        token,
        user
    })
    }
    throw new customError("Invalid credential", 400)
})

/*
@LOGOUT 
@route http://localhost:5000/api/auth/logout
@description user logout by clearing user cookies
@parameters 
@return success message
*/

export const logut = asyncHandler(async(_req,res)=>{
    res.cookie("token", null, {
        expireIn: Date(Date.now())
    })

    res.status(200).json({ 
        success: true,
        message: "User logout successsfully"
    })
})