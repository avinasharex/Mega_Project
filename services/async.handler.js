const asyncHandler = (fn)=> async (req,req,next)=>{
    try {
      await fn(req,res,next)
    } catch (e) {
        res.status(e.code || 500).json({
            success: false,
            message: e.message
        })
    }
}

export default asyncHandler