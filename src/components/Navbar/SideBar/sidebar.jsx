import React from "react";
import { NavOptions } from "./navOptions";
import { Handles } from "./handles";

import { MdFastfood } from "react-icons/md";
import { useGlobalContext } from "../../../context";

export function Sidebar({ profile }) {
  const { closeSidebar, isSidebarOpen } = useGlobalContext(); 
  /**/
  return (
    <div
      className={`fixed z-600 ${
        isSidebarOpen ? "backdrop-blur-xs  w-screen" : ""
      }`}
    >
      <aside className=" bg-[#1E1E2F] w-[70vw] pt-5  md:w-52 h-screen rounded-r-3xl transition duration-200  ">
        <button
          className="text-5xl text-red-600  text-right  w-full pr-5 pt-3 md:hidden"
          onClick={closeSidebar}
        >
          <i className="fas fa-times"></i>
        </button>
        <img
          src={profile}
          className=" rounded-full w-24 h-24 text-center m-auto object-cover mt-8"
          alt="User Profile"
        />
        <NavOptions />
        <Handles />
        <div className="text-center flex justify-center mt-2">
          <div className="flex font-serif italic text-[#F39C12] text-2xl">
            KUKIN
            <span className="text-[#1ABC9C]">
              <MdFastfood />
            </span>
          </div>
        </div>
      </aside>
    </div>
  );
}
