import { Cart } from "./RightBar/cart";
import React from "react";
import { Theme } from "./RightBar/theme";
import { Sidebar } from "./SideBar/sidebar";
import { useEffect, useState } from "react";
import { useMediaQuery } from "usehooks-ts";

import { VscThreeBars } from "react-icons/vsc";

export function Navbar({ profile }) {
  const [toggle, setToggle] = useState(false);
  const isSm = useMediaQuery("(max-width: 767px)");
  const isMd = useMediaQuery("(min-width: 768px) and (max-width: 1023px)");
  const isLg = useMediaQuery("(min-width: 1024px)");

  const handleNav = () => {
    setToggle(!toggle);
    console.log(toggle);
  };

  return (
    <>
      <div className=" flex justify-between w-full h-16 ">
        {(toggle || isMd || isLg) && (
          <Sidebar profile={profile} handleNav={handleNav} />
        )}
        {!toggle && (
          <div>
            <div className="flex p-4">
              <button
                className="sidebar-toggle md:hidden dark:text-[#e2dddd] text-3xl"
                onClick={handleNav}
              >
                <VscThreeBars />
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-row-reverse p-4">
          <Theme />
          <Cart />
        </div>
      </div>
    </>
  );
}
