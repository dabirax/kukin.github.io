import { CartIcon } from "./RightBar/cartIcon";
import React from "react";
import { Theme } from "./RightBar/theme";
import { Sidebar } from "./SideBar/sidebar";
import { useEffect, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { useGlobalContext } from "../../context";

import { VscThreeBars } from "react-icons/vsc";

export function Navbar({ profile }) {
  const [toggle, setToggle] = useState(false);
  const isSm = useMediaQuery("(max-width: 767px)");
  const isMd = useMediaQuery("(min-width: 768px) and (max-width: 1023px)");
  const isLg = useMediaQuery("(min-width: 1024px)");

 

  const { openCart, isSidebarOpen, openSidebar } = useGlobalContext();
  return (
    <>
      <div className=" flex justify-between w-full h-16 ">
        {(isSidebarOpen || isMd || isLg) && (
          <Sidebar profile={profile}  />
        )}
        {!isSidebarOpen && (
          <div>
            <div className="flex p-4">
              <button
                className="sidebar-toggle md:hidden dark:text-[#e2dddd] text-3xl text-[#1ABC9C] hover:scale-110"
                onClick={openSidebar}
              >
                <VscThreeBars />
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-row-reverse justify-center items-center gap-3 p-4">
          <Theme />
          <button onClick={openCart}>
            <CartIcon />
          </button>
        </div>
      </div>
    </>
  );
}
