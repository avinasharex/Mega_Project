import User from "../model/user.schema.js"
import asyncHandler from "../services/async.handler.js"
import customError from '../utils/cstom.error.js'
import mailHelper from "../utils/mail.helper.js"
import crypto from "crypto"

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

/*
@FORGOT_PASSWORD 
@route http://localhost:5000/api/auth/password/forgot
@description User will submit we will generate token
@parameters email
@return success message - email send
*/

export const forgotPassword = asyncHandler(async(req,res)=>{
    const {email} = req.body

    const user = await User.findOne({email})

    if(!user){
        throw new customError("Invalid credential", 404)
    }

    const resetToken =  user.generateForgotTokenPassword()

    await user.save({validateBeforeSave: false})

    const resetUrl = `${req.protocol}://${req.get("host")}/api/auth/password/forgot/reset/${resetToken}`

    const text = `Your password reset url is \n\n${resetUrl}\n\n`

    try {
      await mailHelper({
        email: user.email,
        subject: "Password reset email for website",
        text: text
      })  
      res.status(200).json({
        success: true,
        message: `Email send to ${user.email}`
      })
    } catch (e) {
        // rollback - clear fields and save
        user.forgotPasswordToken = undefined
        user.forgotPasswordExpiry = undefined

        await user.save({validateBeforeSave: false})
        throw new customError(e.message, 500)
    }
})

/*
@RESET_PASSWORD 
@route http://localhost:5000/api/auth/password/reset/:resetPasswordToken
@description User will be reset password based on url token
@parameters token from url, password and confirmPassword
@return User object
*/

export const restPassword = asyncHandler(async(req,res)=>{
    const {token: resetToken} = req.params
    const {password, confirmPasswod} = req.body
    
    const resetPassword = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest("hex")

    const user = await User.findOne({
        forgotPasswordToken: resetPassword,
        forgotPasswordExpiry: {$gt: Date.now()}
    })

    if(!user){
        throw new customError("Password token is invalid or expired", 400)
    }

    if(password !== confirmPasswod){
        throw new customError("Password does not match", 400)
    }

    user.password = password
    user.forgotPasswordToken = undefined
    user.forgotPasswordExpiry = undefined

    await user.save()

    // create a token and send as response

    const token = user.getJWTToken()
    user.password = undefined

     res.cookie("token", token, cookieOption)

     res.status(200).json({
        success: true,
        user
     })
})

// TODO: create controller for change password


/*
@GET_PROFILE
@REQUEST_TYPE GET 
@route http://localhost:5000/api/auth/profile
@description check for token and populate req.user
@parameters
@return User object
*/

export const getProfile = asyncHandler(async(req,res)=>{
    const {user} = req.user

    if(!user){
        throw new customError("User not founds")
    }

    res.status(200).json({
        success: true,]
        user
    })
})