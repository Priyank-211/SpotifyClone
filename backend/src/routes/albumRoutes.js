import express from "express";
import upload from "../middleware/multer.js";
import { addAlbum ,listAlbum} from "../controllers/albumController.js";

const router = express.Router();

router.post(
  "/add",
  upload.single("image"), // 👈 MULTER FIRST
  addAlbum                // 👈 CONTROLLER
);
router.get("/list", listAlbum);

export default router;
