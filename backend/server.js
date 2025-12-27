import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import songRoutes from "./src/routes/songRoutes.js";
import connectDB from "./src/config/mongodb.js";
import connectCloudinary from "./src/config/cloudinary.js";
import albumRoutes from "./src/routes/albumRoutes.js";

dotenv.config();

//app config

const app=express();
const port =process.env.PORT || 4000;


//middlewares 
app.use(express.json());

//connect services
connectDB();
connectCloudinary();

//app.use(cors());

//initialising routes 
app.use("/api/song",songRoutes)
app.use("/api/albums", albumRoutes);

app.post("/test", (req, res) => {
  res.json({ message: "POST working", body: req.body });
});

app.get("/test", (req,res)=>{
  res.json({message:"API Working"});
});
app.listen(port,()=>console.log(`server started on ${port}`))
