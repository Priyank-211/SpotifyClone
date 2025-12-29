import songModel from "../models/songModel.js";
import { v2 as cloudinary } from "cloudinary";
import "../models/albumModel.js";


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

    res.status(201).json({ success: true, song });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
export const listSongs = async (req, res) => {
  try {
    const songs = await songModel
      .find()
      .populate("album", "name image"); // get album details

    res.json(songs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const deleteSong = async (req, res) => {
  try {
    const { id } = req.params;

    const song = await songModel.findById(id);
    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }

    // Delete image from cloudinary
    if (song.image) {
      const imagePublicId = song.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(
        `spotify/songs/images/${imagePublicId}`
      );
    }

    // Delete audio from cloudinary
    if (song.file) {
      const audioPublicId = song.file.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(
        `spotify/songs/audio/${audioPublicId}`,
        { resource_type: "video" }
      );
    }

    await songModel.findByIdAndDelete(id);

    res.json({ success: true, message: "Song deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

