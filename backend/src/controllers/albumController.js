import albumModel from "../models/albumModel.js";
import {v2 as Cloudinary} from "cloudinary";
import fs from "fs";

export const addAlbum=async (req,res)=>{
  try{
    const{name,desc ,bgColor}= req.body;
    if(!req.file){
      return res.status(400).json({messsage: "Iamge is required"});
    }

  //upload image to cloudinary
  const result=await Cloudinary.uploader.upload(req.file.path,{folder:"spotify/albums"});

  //delete local file
  fs.unlinkSync(req.file.path);

  //ave album in Db
  const album =await albumModel.create({
    name,desc,bgColor,image:result.secure_url
  });
  res.status(201).json(album);

  }catch(error){
      console.log(error);
      res.status(500).json({message:error.message});
  }
};