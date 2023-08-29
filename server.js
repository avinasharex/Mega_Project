import mongoose, { mongo } from "mongoose";
import config from './config/index.js'
import app from "./app.js";

// (async ()=>{})()
(async ()=>{
    try {
        await mongoose.connect(config.MONGO_URL)
        console.log("DB connected");

        app.on('error', (err)=>{
            console.log("Error: ", err);
            throw err
        })
        const onListening =  ()=>{
            console.log(`App is listening at http://localhost:${config.PORT}`);
        }
        app.listen(config.PORT,onListening)
    } catch (e) {
        console.log(e);
        throw e
    }
})()