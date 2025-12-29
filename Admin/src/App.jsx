import { useState } from "react";
import "./App.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Routes, Route } from "react-router-dom";
import AddAlbum from "./pages/AddAlbum.jsx";
import ListAlbum from "./pages/ListAlbum.jsx";
import AddSong from "./pages/AddSong.jsx";
import ListSong from "./pages/ListSong.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Navbar from "./components/Navbar.jsx";

function App() {
  return (
    <div className="flex items-start min-h-screen">
      <ToastContainer />
      <Sidebar />
      <div className="flex-1 h-screen overflow-y-scroll bg-[#f3fff7]">
        <Navbar />
        <div className="pt-8 pl-5 sm:pt-12 sm-pl-12">
          <Routes>
            <Route path="/add-album" element={<AddAlbum />} />
            <Route path="/list-album" element={<ListAlbum />} />
            <Route path="/add-song" element={<AddSong />} />
            <Route path="/list-song" element={<ListSong />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
