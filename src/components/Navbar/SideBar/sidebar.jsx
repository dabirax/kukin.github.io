import React from "react";
import { NavOptions } from "./navOptions";
import { Handles } from "./handles";

import { MdFastfood } from "react-icons/md";
import toggleLogo from "../../../assets/logo.svg";

export function Sidebar({ profile, handleNav }) {
  return (
    <aside className="sidebar bg-[#322d39] absolute w-[96vw] md:w-52 lg:w-72 h-screen rounded-r-3xl transition duration-200">
      <button
        className="text-5xl text-red-600  text-right  w-full pr-5 pt-3 md:hidden
          "
        onClick={handleNav}
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
        <div className="flex font-serif italic text-[#110a27] text-2xl">
          KUKIN
          <span className="text-red-500">
            <MdFastfood />
          </span>
        </div>
      </div>
    </aside>
  );
}
