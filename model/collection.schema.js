import mongoose from "mongoose";

const collectionSchema = new mongoose.Schema(
    {
    name:{
        type: String,
        required: [true, "Please provide a category"],
        trim: true,
        maxLength: [20, "Collection length should mot be more than 20 characters"]
    }
},{timestamps: true}
)

export default mongoose.model("Collection", collectionSchema)