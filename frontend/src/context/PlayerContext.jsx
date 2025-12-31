import { createContext, useRef, useState, useEffect } from "react";
import axios from "axios";

export const PlayerContext = createContext(null);

const PlayerContextProvider = ({ children }) => {
  const audioRef = useRef(null);
  const seekBar = useRef(null);
  const seekBg = useRef();

  const url = "http://localhost:4000";

  const [songsData, setsongsData] = useState([]);
  const [albumsdata, setalbumsdata] = useState([]);

  const [track, setTrack] = useState(null);
  const [playerStatus, setPlayerStatus] = useState(false);
  const [time, settime] = useState({
    currentTime: { minute: 0, second: 0 },
    totalTime: { minute: 0, second: 0 },
  });

  // 🔥 THIS is where play MUST happen
  const playWithId = async (id) => {
    const song = songsData[id];
    const audio = audioRef.current;

    if (!song || !audio) return;

    try {
      audio.pause(); // stop current
      audio.src = song.file; // set new src
      audio.load(); // load it
      setTrack(song);
      await audio.play(); // USER CLICK → allowed

      setPlayerStatus(true);
    } catch (err) {
      console.log("Play failed:", err);
    }
  };
  const getIndexById = (id) => {
    return songsData.findIndex((song) => song._id === id);
  };

  const previous = async () => {
    const currentindex = getIndexById(track._id);
    if (currentindex === -1) return;

    const prevIndex =
      currentindex === 0 ? songsData.length - 1 : currentindex - 1;

    await playWithId(prevIndex);
  };
  const next = async () => {
    if (!track) return;

    const currentIndex = getIndexById(track._id);
    if (currentIndex === -1) return;
    const nextIndex =
      currentIndex === songsData.length - 1 ? 0 : currentIndex + 1;

    await playWithId(nextIndex);
  };

  const pause = () => {
    audioRef.current?.pause();
    setPlayerStatus(false);
  };
  const play = async () => {
    const audio = audioRef.current;
    if (!audio || !track) return;

    try {
      // ensure src exists (important after pause)
      if (!audio.src) {
        audio.src = track.file;
        audio.load();
      }

      await audio.play();
      setPlayerStatus(true);
    } catch (err) {
      console.log("Play blocked:", err);
    }
  };
  const seekSong = async (e) => {
    audioRef.current.currentTime =
      (e.nativeEvent.offsetX / seekBg.current.offsetWidth) *
      audioRef.current.duration;
  };
  const getSongs = async () => {
    try {
      const res = await axios.get(`${url}/api/song/list`);
      setsongsData(res.data);
      setTrack(res.data[0]);
    } catch (error) {}
  };
  const getalbums = async () => {
    try {
      const response = await axios.get(`${url}/api/albums/list`);
      setalbumsdata(response.data);
    } catch (error) {}
  };
  // progress bar + time
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const update = () => {
      const progress = (audio.currentTime / audio.duration) * 100 || 0;

      if (seekBar.current) {
        seekBar.current.style.width = progress + "%";
      }

      settime({
        currentTime: {
          minute: Math.floor(audio.currentTime / 60),
          second: Math.floor(audio.currentTime % 60),
        },
        totalTime: {
          minute: Math.floor(audio.duration / 60 || 0),
          second: Math.floor(audio.duration % 60 || 0),
        },
      });
    };

    audio.addEventListener("timeupdate", update);
    return () => audio.removeEventListener("timeupdate", update);
  }, []);

  useEffect(() => {
    getSongs();
    getalbums();
  }, []);

  return (
    <PlayerContext.Provider
      value={{
        audioRef,
        seekBar,
        seekBg,
        track,
        playerStatus,
        time,
        playWithId,
        pause,
        play,
        previous,
        next,
        seekSong,
        songsData,
        albumsdata,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export default PlayerContextProvider;
