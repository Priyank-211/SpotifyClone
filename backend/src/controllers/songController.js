import songModel from "../models/songModel.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

export const addSong = async (req, res) => {
  try {
    const { name, desc, album, duration } = req.body;

    if (!req.files?.image || !req.files?.file) {
      return res.status(400).json({ message: "Image and audio file are required" });
    }

    const imageFile = req.files.image[0];
    const audioFile = req.files.file[0];

    // upload image
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      folder: "spotify/songs/images",
    });

    // upload audio (IMPORTANT: resource_type video)
    const audioUpload = await cloudinary.uploader.upload(audioFile.path, {
      folder: "spotify/songs/audio",
      resource_type: "video",
    });

    // cleanup temp files
    fs.unlinkSync(imageFile.path);
    fs.unlinkSync(audioFile.path);

    // save song in DB
    const song = await songModel.create({
      name,
      desc,
      album,
      image: imageUpload.secure_url,
      file: audioUpload.secure_url,
      duration,
    });

    res.status(201).json(song);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
