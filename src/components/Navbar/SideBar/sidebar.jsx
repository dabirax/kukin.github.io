import { UserRound } from "lucide-react";
import { NavOptions } from "./navOptions";
import { Handles } from "./handles";
import { useAuth } from "../../../auth/useAuth.js";
import { useGlobalContext } from "../../../useGlobalContext.js";

import { MdFastfood } from "react-icons/md";

export function Sidebar({ profile }) {
  const { closeSidebar, isSidebarOpen } = useGlobalContext();
  const { user, isAuthenticated, openAuth } = useAuth();

  const avatar = user?.avatarUrl || profile;
  const initial = String(user?.name || "K").charAt(0).toUpperCase();

  return (
    <div
      className={`fixed z-600 ${
        isSidebarOpen ? "backdrop-blur-xs  w-screen" : ""
      }`}
    >
      <aside className=" bg-[#1E1E2F] w-[70vw] pt-5  md:w-52 h-screen rounded-r-3xl transition duration-200 overflow-y-auto ">
        <button
          className="text-5xl text-red-600  text-right  w-full pr-5 pt-3 md:hidden"
          onClick={closeSidebar}
          aria-label="Close menu"
        >
          <i className="fas fa-times"></i>
        </button>

        {avatar ? (
          <img
            src={avatar}
            className=" rounded-full w-24 h-24 text-center m-auto object-cover mt-8"
            alt="User Profile"
          />
        ) : (
          <div className="mx-auto mt-8 flex h-24 w-24 items-center justify-center rounded-full bg-[#1ABC9C] text-4xl font-black text-white">
            {initial}
          </div>
        )}

        <div className="mt-3 px-4 text-center">
          {isAuthenticated ? (
            <>
              <p className="truncate font-bold text-[#CED4DA]">{user.name}</p>
              
            </>
          ) : (
            <button
              type="button"
              onClick={() => openAuth("login")}
              className="inline-flex items-center gap-2 rounded-full border border-[#1ABC9C]/50 px-4 py-2 text-sm font-bold text-[#1ABC9C] transition hover:bg-[#1ABC9C]/10"
            >
              <UserRound className="h-4 w-4" />
              Sign in
            </button>
          )}
        </div>

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
