import Collection from "../model/collection.schema.js"
import asyncHandler from "../services/async.handler.js";
import customError from "../utils/cstom.error.j"


/*
@CREATE_COLLECTION
@REQUEST_TYPE POST 
@route http://localhost:5000/api/collection
@description create collection
@parameters name
@return collection object
*/

export const createCollection = asyncHandler(async(req,res)=>{
    const {name} = req.body 

    if(!name){
        throw new customError("Collection name is required",400)
    }

    const collection = await Collection.create({
        name
    })

    res.status(200).json({
        success: true,
        message: "Collection created successfully",
        collection
    })
})

export const updateCollection = asyncHandler(async(req,res)=>{
    // Existing value to be updates
    const {id: collectionId} = req.params
    // new value to get updated
    const {name} = req.body
    if(!name){
        throw new customError("Collection name is required",400)
    }

    const updatedCollection = await Collection.findByIdAndUpdate(collectionId,
        {
            name
        },{
            new: true,
            runValidators: true
        })
        if(!updatedCollection){
            throw new customError("Collection not found",400)
        }

        
    res.status(200).json({
        success: true,
        message: "Collection updated successfully",
        updatedCollection
    })
})

export const deleteCollection = asyncHandler(async(req,res)=>{
    const {id} = req.params

    const collection = await Collection.findByIdAndDelete(id)
    if(!collection){
        throw new customError("Collection not found",400)  
    }
    collection.remove()
    res.status(200).json({
        success: true,
        message: "Collection deleted successfully"
    })
})

export const getAllCollection = asyncHandler(async(req,res)=>{
    const collections = await Collection.find()
    if(!collections){
        throw new customError("Collection not found",400)  
    }
    res.status(200).json({
        success: true,
        collections
    })
})