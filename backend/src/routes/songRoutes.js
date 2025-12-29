import express from "express";
import upload from "../middleware/multer.js";
import { addSong ,listSongs} from "../controllers/songController.js";

const router = express.Router();

router.post(
  "/add",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  addSong
);
router.get("/list", listSongs);
export default router;
