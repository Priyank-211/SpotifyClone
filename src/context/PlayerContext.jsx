import { createContext, useRef, useState } from "react";
import { songsData } from "../assets/assets";

export const PlayerContext = createContext();

const PlayerContextProvider = (props) => {
  const audioRef = useRef();
  const seeekBg = useRef();
  const seeekBar = useRef();

  const [track, settrack] = useState(songsData[0]);
  const [playerStatus, setplayerStatus] = useState(false);
  const [time, settime] = useState({
    currentTime: {
      second: 0,
      minute: 0,
    },
    totalTime: {
      second: 0,
      minute: 0,
    },
  });

  const play = () => {
    audioRef.current.play();
    setplayerStatus(true);
  };

  const pause = () => {
    audioRef.current.pause();
    setplayerStatus(false);
  };

  const contextValue = {
    audioRef,
    seeekBg,
    seeekBar,
    track,
    settrack,
    playerStatus,
    setplayerStatus,
    time,
    settime,
    play,
    pause,
  };
  return (
    <PlayerContext.Provider value={contextValue}>
      {props.children}
    </PlayerContext.Provider>
  );
};
export default PlayerContextProvider;
