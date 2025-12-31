import albumModel from "../models/albumModel.js";
import {v2 as Cloudinary} from "cloudinary";
import fs from "fs";

export const addAlbum=async (req,res)=>{
  try{
    const{name,desc ,bgColor}= req.body;
    if(!req.file){
      return res.status(400).json({message: "Iamge is required"});
    }

  //upload image to cloudinary
  const result=await Cloudinary.uploader.upload(req.file.path,{folder:"spotify/albums"});

  //delete local file
  fs.unlinkSync(req.file.path);

  //save album in Db
  const album =await albumModel.create({
    name,desc,bgColor,image:result.secure_url
  });
  res.status(201).json(album);

  }catch(error){
      console.log(error);
      res.status(500).json({message:error.message});
  }
};

export const listAlbum= async (req,res) => {
     try {
    const album =await albumModel.find();
    res.json(album);
  } catch (error) {
    res.status(500).json({message:error.message});
    
  }
};
export const deleteAlbum = async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Find album
    const album = await albumModel.findById(id);
    if (!album) {
      return res.status(404).json({ message: "Album not found" });
    }

    // 2️⃣ Delete album image from Cloudinary
    if (album.image) {
      const albumImgId = album.image.split("/").pop().split(".")[0];
      await Cloudinary.uploader.destroy(`spotify/albums/${albumImgId}`);
    }

    // 3️⃣ Delete album from DB
    await albumModel.findByIdAndDelete(id);

    res.json({ success: true, message: "Album deleted" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
