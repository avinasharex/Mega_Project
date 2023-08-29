import mongoose from "mongoose";
import authRoles from "../utils/auth.role.js"
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
import crypto from "crypto"
import config from "../config/index.js";

const userSchema = new mongoose.Schema(
    {
    name: {
        type: String,
        required: [true, "Name is required"],
        maxLength: [50, "Name must be less than 50 character"]
    },
    email:{
        type: String,
        required: [true, "Email is required"],
        unique: true
    },
    password:{
        type: String,
        required: [true, "Password is required"],
        minLength: [8, "Name must be less than 8 character"],
        select: false
    },
    role:{
        type: String,
        enum: Object.values(authRoles),
        default: authRoles.USER
    },
    forgotPasswordToken:{
        type: String
    },
    forgotPasswordExpiry:{
        type: Date
    }
},
{timestamps: true}
);

// Challenge 1 - encrypt password

userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next()
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

// Add more features to schema

userSchema.methods = {
    // compare password
    comparePassword: async function(enterdPassword){
        return await bcrypt.compare(enterdPassword, this.password)
    },
    // Generate jwt token
    getJWTToken: function () {
        return JWT.sign(
            {
                _id: this._id, 
                role: this.role
            },config.JWT_SECRET,{
                expiresIn: config.JWT_EXPIRY
            }
        )
    },

    generateForgotTokenPassword: function(){
        const forgotToken = crypto.randomBytes(20).toString("hex")

        // Step 1 - Save to DB
        this.forgotPasswordToken = crypto
        .createHash("sha256")
        .update(forgotToken)
        .digest("hex")

        this.forgotPasswordExpiry = Date.now() + 20 * 60 * 1000
        // Step 2 - return value to user

        return forgotToken
    }
}

export default mongoose.model("User", userSchema)