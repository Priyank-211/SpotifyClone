import { useState } from "react";
import axios from "axios";
import assets from "../assets/assets";
import { url } from "../App";
import { toast } from "react-toastify";

const AddAlbum = () => {
  const [image, setimage] = useState(false);
  const [color, setcolor] = useState("#ffffff");
  const [name, setname] = useState("");
  const [desc, setdesc] = useState("");
  const [loading, setloading] = useState(false);

  const onSubmithandler = async (e) => {
    e.preventDefault();
    setloading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("desc", desc);
      formData.append("image", image);
      formData.append("bgColor", color);

      await axios.post(`${url}/api/albums/add`, formData);

      toast.success("Album added");
      setdesc("");
      setimage(false);
      setname("");
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
      onSubmit={onSubmithandler}
      className="flex flex-col items-start gap-8 text-gray-600"
    >
      <div className="flex flex-col gap-4">
        <p>Upload Image</p>
        <input
          id="image"
          onChange={(e) => setimage(e.target.files[0])}
          type="file"
          accept="image/*"
          hidden
        />
        <label htmlFor="image">
          <img
            className="cursor-pointer"
            src={image ? URL.createObjectURL(image) : assets.upload_area}
            alt=""
          />
        </label>
      </div>
      <div className="flex flex-col gap-2.5">
        <p>Album Name</p>
        <input
          onChange={(e) => setname(e.target.value)}
          value={name}
          className="bg-transparent outline-green-600 border-2 border-e-gray-400 p-2.5 w-[max(40vh,250px)]"
          type="text"
          placeholder="Type Here.."
        />
      </div>
      <div className="flex flex-col gap-2.5">
        <p>Album Descripton</p>
        <input
          onChange={(e) => {
            setdesc(e.target.value);
          }}
          value={desc}
          className="bg-transparent outline-green-600 border-2 border-e-gray-400 p-2.5 w-[max(40vh,250px)]"
          type="text"
          placeholder="Type Here.."
        />
      </div>
      <div className="flex flex-col gap-3">
        <p>Background Colour</p>
        <input
          onChange={(e) => setcolor(e.target.value)}
          value={color}
          type="color"
        />
      </div>
      <button
        className="text-base bg-black text-white py-2.5 px-14 cursor-pointer "
        type="submit"
      >
        ADD
      </button>
    </form>
  );
};

export default AddAlbum;
