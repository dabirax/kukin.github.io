import React from "react";
import { Theme } from "./RightBar/theme";
import { Sidebar } from "./SideBar/sidebar";
import { useEffect, useState } from "react";


export function Navbar({ profile }) {
  const [toggle, setToggle] = useState(false);

  const handleNav = () => {
    setToggle(!toggle);
  };

  return (
    <>
      {toggle && <Sidebar profile={profile} handleNav={handleNav} />}
      {!toggle && (
        <div>
          <button className="sidebar-toggle" onClick={handleNav}>
            <i className="fas fa-bars"></i>
          </button>
          <Theme />
        </div>
      )}
    </>
  );
}
