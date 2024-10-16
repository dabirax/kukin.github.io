import React from "react";
import { NavOptions } from "./navOptions";
import { Handles } from "./handles";
// import {toggle, setToggle} from "./App"

import toggleLogo from "./assets/logo.png";
export function Sidebar({ profile, handleNav }) {
  return (
    <aside className="sidebar bg-[#322d39] absolute w-4/5 h-screen rounded-r-3xl text-[#adadc9]">
      <button
        className="text-5xl text-red-600  text-right  w-full pr-5 pt-3
          "
        onClick={handleNav}
      >
        <i className="fas fa-times"></i>
      </button>
      <img
        src={profile}
        className=" rounded-full w-24 h-24 text-center"
        alt="User Profile"
      />
      <NavOptions />
      <Handles />
      <img src={toggleLogo} className="logo  w-16" alt="" />
    </aside>
  );
}
