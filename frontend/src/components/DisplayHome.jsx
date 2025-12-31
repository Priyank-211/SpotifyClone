import Navbar from "./Navbar";

import AlbumItem from "./AlbumItem";
import { useContext } from "react";

import SongItem from "./SongItem";
import { PlayerContext } from "../context/PlayerContext";

const DisplayHome = () => {
  const { songsData, albumsdata } = useContext(PlayerContext);

  return (
    <>
      <Navbar />
      <div className="mb-4">
        <h1 className="my-5 font-bold text-2xl">Featured Charts</h1>
        <div className="flex overflow-auto scrollbar-hide ">
          {albumsdata.map((item, index) => (
            <AlbumItem
              key={index}
              name={item.name}
              desc={item.desc}
              id={item._id}
              image={item.image}
            />
          ))}
        </div>
        <h1 className="my-5 font-bold text-2xl">Today's biggest hits</h1>
        <div className="flex overflow-auto scrollbar-hide ">
          {songsData.map((item, index) => (
            <SongItem
              key={index}
              id={item._id}
              name={item.name}
              desc={item.desc}
              image={item.image}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default DisplayHome;
