import mongoose, { mongo } from "mongoose";
import productStatus from "../utils/product.status";

const orderSchema = new mongoose.Schema(
    {
    products:{
        type: [
            {
                productId:{
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true
                },
                count:{
                    type: true
                }
            }
        ],
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    address:{
        type: String,
        required: true
    },
    phoneNumber:{
        type: Number,
        required: true
    },
    amount:{
        type: Number,
        required: true
    },
    coupon:{
        type: String
    },
    transactionId:{
        type: String
    },
    status:{
        type: String,
        enum: Object.values(productStatus),
        default: productStatus.ORDERD
    }
    // payementMode: UPI, credit card, wallet and COD
},{timestamps: true}
)

export default mongoose.model("Order", orderSchema)