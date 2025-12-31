import React, { useContext, useEffect, useRef } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import DisplayHome from "./DisplayHome";
import DisplayItem from "./DisplayItem";
import { PlayerContext } from "../context/PlayerContext";

const Display = () => {
  const { albumsdata } = useContext(PlayerContext);

  const displayRef = useRef();
  const location = useLocation();
  const isAlbum = location.pathname.includes("album");
  const albumId = isAlbum ? location.pathname.split("/").pop() : "";

  const album = albumsdata.find((x) => x._id === albumId);
  const bgColor = album?.bgColor || "#121212";

  useEffect(() => {
    if (isAlbum && album) {
      displayRef.current.style.background = `linear-gradient(${bgColor}, #121212)`;
    } else {
      displayRef.current.style.background = "#121212";
    }
  }, [isAlbum, album, bgColor]);

  return (
    <div
      ref={displayRef}
      className="w-full m-2 px-6 pt-4 rounded text-white overflow-auto lg:w-[75%]"
    >
      <Routes>
        <Route path="/" element={<DisplayHome />} />
        <Route path="/album/:id" element={<DisplayItem album={album} />} />
      </Routes>
    </div>
  );
};

export default Display;
