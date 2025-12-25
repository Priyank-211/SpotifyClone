import { createContext, useRef, useState, useEffect } from "react";
import { songsData } from "../assets/assets";

export const PlayerContext = createContext(null);

const PlayerContextProvider = ({ children }) => {
  const audioRef = useRef(null);
  const seekBar = useRef(null);
  const seekBg = useRef();

  const [track, setTrack] = useState(songsData[1]);
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

  const previous = async () => {
    if (!track) return;
    const currentindex = track.id;
    const prevIndex =
      currentindex === 0 ? songsData.length - 1 : currentindex - 1;

    await playWithId(prevIndex);
  };
  const next = async () => {
    if (!track) return;

    const currentIndex = track.id;
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
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export default PlayerContextProvider;
