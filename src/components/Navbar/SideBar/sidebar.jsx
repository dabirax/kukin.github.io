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
      <aside className=" bg-[#1E1E2F] w-[70vw] pt-5  lg:w-52 h-screen rounded-r-3xl transition duration-200 flex flex-col justify-between shadow-2xl py-8 relative">
        <button   className="text-5xl text-red-600  text-right  w-full pr-5  lg:hidden absolute"
          onClick={closeSidebar}
        >
          <i className="fas fa-times"></i>
        </button>
        <div className="pt-8">
        <img  src={profile}
          className=" rounded-full w-30 h-30 text-center mx-auto object-cover "
          alt="User Profile"
        />
        </div>
        <NavOptions />

        <div>
        <Handles />
        <div className="text-center flex justify-center mt-2">
          <div className="flex font-serif italic text-[#F39C12] text-2xl">
            KUKIN
            <span className="text-[#1ABC9C]">
              <MdFastfood />
            </span>
          </div>
          </div>
          </div>
      </aside>
    </div>
  );
}
