import React from "react";
import { useState, useEffect } from "react";
import assets from "../assets/assets";
import axios from "axios";
import { url } from "../App";
import { toast } from "react-toastify";
const AddSong = () => {
  const [image, setimage] = useState(false);
  const [Song, setSong] = useState(false);
  const [name, setname] = useState("");
  const [desc, setdesc] = useState("");
  const [album, setalbum] = useState("");
  const [loading, setloading] = useState(false);
  const [albumData, setalbumData] = useState([]);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const res = await axios.get(`${url}/api/albums/list`);
        console.log("Albums fetched:", res.data); // debug
        setalbumData(res.data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load albums");
      }
    };

    fetchAlbums();
  }, []);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!album) {
      toast.error("Please select an album");
      setloading(false);
      return;
    }

    setloading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("desc", desc);
      formData.append("image", image);
      formData.append("file", Song);
      formData.append("album", album);
      formData.append("duration", 180);

      const response = await axios.post(`${url}/api/song/add`, formData);

      if (response.data.success) {
        toast.success("song added");
        setdesc("");
        setalbum("none");
        setimage(false);
        setSong(false);
      } else {
        toast.error("something went wrong");
      }
    } catch (error) {
      toast.error("error occured");
    }
    setloading(false);
  };
  return loading ? (
    <div className="grid place-content-center min-h-[80vh]">
      <div className="w-16 h-16 place-self-center border-4 border-gray-400 border-t-green-800 rounded-full animate-spin"></div>
    </div>
  ) : (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col items-start gap-8 text-gray-600"
    >
      <div className="flex gap-8">
        <div className="flex flex-col gap-4">
          <p>upload song</p>
          <input
            onChange={(e) => {
              setSong(e.target.files[0]);
            }}
            type="file"
            id="song"
            accept="audio/*"
            hidden
          />
          <label htmlFor="song">
            <img
              src={Song ? assets.upload_added : assets.upload_song}
              className="w-24 cursor-pointer"
              alt=""
            />
          </label>
        </div>
        <div className="flex flex-col gap-4">
          <p>Upload Image</p>
          <input
            onChange={(e) => setimage(e.target.files[0])}
            type="file"
            id="image"
            accept="image/*"
            hidden
          />
          <label htmlFor="image">
            <img
              src={image ? assets.upload_added : assets.upload_area}
              className="w-24 cursor-pointer"
              alt=""
            />
          </label>
        </div>
      </div>
      <div className="flex flex-col gap-2.5">
        <p>Song Name</p>
        <input
          onChange={(e) => setname(e.target.value)}
          value={name}
          type="text"
          className="bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-[max(40vh,250px)]"
          placeholder="Type Here"
          required
        />
      </div>
      <div className="flex flex-col gap-2.5">
        <p>Song Description</p>
        <input
          onChange={(e) => setdesc(e.target.value)}
          value={desc}
          type="text"
          className="bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-[max(40vh,250px)]"
          placeholder="Type Here"
          required
        />
      </div>
      <div className="flex flex-col gap-2.5">
        <p>Album </p>
        <select
          onChange={(e) => setalbum(e.target.value)}
          defaultValue={album}
          className="bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-[250px]"
        >
          <option value="">Select Album</option>
          {albumData.map((item) => (
            <option key={item._id} value={item._id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="text-base bg-black text-white py-2.5 px-14 cursor-pointer"
      >
        ADD
      </button>
    </form>
  );
};

export default AddSong;
