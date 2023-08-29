import mongoose from "mongoose";

const productSchema  = new mongoose.Schema(
    {
    name:{
        type: String,
        required: [true, "Please provide product name"],
        trim: true,
        maxLength: [120, "Product length should not be more than 120 characters"]
    },
    price:{
        type: Number,
        required: [true, "Please provide product nprice"],
        maxLength: [5, "Product price should not be more than 5 digits"]
    },
    description:{
        type: String,
        // Use some form of editor
    },
    photos:[
        {
            secure_url: {
                type: String,
                required: true
            }
        }
    ], 
    stock:{
        type: true,
        default: 0
    },
    sold: {
        type: Number,
        default: 0
    },
    colectionId :{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Collection" /*Referance to what way we stored schema name*/
    }
},{timestamps: true}
)

export default mongoose.model("Product", productSchema)