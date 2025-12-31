import React, { useEffect, useState } from "react";
import { url } from "../App";
import { toast } from "react-toastify";
import axios from "axios";

const ListAlbum = () => {
  const [data, setdata] = useState([]);
  const fetchalbums = async () => {
    try {
      const res = await axios.get(`${url}/api/albums/list`);

      setdata(res.data);
    } catch (error) {
      toast.error("Error Ocuured");
    }
  };
  const removeAlbum = async (id) => {
    try {
      const response = await axios.delete(`${url}/api/albums/delete/${id}`);
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchalbums();
      }
    } catch {
      toast.error("Error occured");
    }
  };
  useEffect(() => {
    fetchalbums();
  }, []);
  return (
    <div>
      <p>Album List</p>
      <br />
      <div className="sm:grid hidden grid-cols-[0.5fr_1fr_2fr_1fr_0.5fr] items-center gap-2.5 p-3 border border-gray-300 text-sm mr-5 bg-gray-100">
        <b>Image</b>
        <b>Name</b>
        <b>Description</b>
        <b>Album Color</b>
        <b>Action</b>
      </div>
      {data.map((item, index) => {
        return (
          <div
            key={index}
            className="grid geid-cols-[1fr_1fr_1fr] sm:grid-cols-[0.5fr_1fr_2fr_1fr_0.5fr] items-center gap-2.5 p-3 border border-gray-300 text-sm mr-5"
          >
            <img className="w-12" src={item.image} alt="image" />
            <p>{item.name}</p>
            <p>{item.desc}</p>
            <input type="color" value={item.bgColor} />
            <p
              onClick={() => {
                removeAlbum(item._id);
              }}
              className="cursor-pointer"
            >
              X
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default ListAlbum;
