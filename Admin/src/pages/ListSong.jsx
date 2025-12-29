import React, { useEffect, useState } from "react";
import axios from "axios";
import { url } from "../App";
import { toast } from "react-toastify";

const ListSong = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const res = await axios.get(`${url}/api/song/list`);
        setSongs(res.data);
        setLoading(false);
      } catch (error) {
        toast.error("Failed to load songs");
        setLoading(false);
      }
    };

    fetchSongs();
  }, []);

  if (loading) {
    return (
      <div className="grid place-content-center min-h-[80vh]">
        <div className="w-16 h-16 border-4 border-gray-400 border-t-green-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold mb-4">All Songs List</h2>

      <div className="border border-gray-300 rounded-md overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-[80px_1fr_1fr_120px_80px] bg-gray-100 p-3 text-sm font-medium">
          <p>Image</p>
          <p>Name</p>
          <p>Album</p>
          <p>Duration</p>
          <p className="text-center">Action</p>
        </div>

        {/* Table Rows */}
        {songs.map((song) => (
          <div
            key={song._id}
            className="grid grid-cols-[80px_1fr_1fr_120px_80px] items-center p-3 border-t text-sm"
          >
            {/* Image */}
            <img
              src={song.image}
              alt=""
              className="w-12 h-12 object-cover rounded"
            />

            {/* Name */}
            <p>{song.name}</p>

            {/* Album */}
            <p className="text-gray-600">{song.album?.name || "—"}</p>

            {/* Duration */}
            <p>
              {Math.floor(song.duration / 60)}:
              {(song.duration % 60).toString().padStart(2, "0")}
            </p>

            {/* Action */}
            <button className="text-red-500 text-center hover:underline">
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListSong;
