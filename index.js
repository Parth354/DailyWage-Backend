import { app } from "./app.js"
import connectDB from "./utils/connectdb.js"

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`Server Running At Port :${process.env.PORT}`)
    })
})
.catch((err)=>{
    console.log("MONGO db Connection Failed",err)
})
