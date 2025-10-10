import { CartIcon } from "./RightBar/cartIcon";
import { Theme } from "./RightBar/theme";
import { Sidebar } from "./SideBar/sidebar";
import { useMediaQuery } from "usehooks-ts";
import { useGlobalContext } from "../../context";
import { VscThreeBars } from "react-icons/vsc";
import { motion } from "framer-motion";

export function Navbar({ profile }) {
  const isLg = useMediaQuery("(min-width: 1024px)");
  const { openCart, isSidebarOpen, openSidebar } = useGlobalContext();

  return (
    <div className="flex justify-between w-full h-16">

      {/* Sidebar for large screens or when open */}
      {(isSidebarOpen || isLg) && <Sidebar profile={profile} />}

      {/* Sidebar toggle for small screens */}
      {!isSidebarOpen && !isLg && (
        <button
          className="p-4 text-3xl text-[#1ABC9C] dark:text-[#e2dddd] hover:scale-110 lg:hidden"
          onClick={openSidebar}
        >
          <VscThreeBars />
        </button>
      )}

      {/* Theme and CartIcon */}
      <div className="flex w-full justify-end gap-3 p-4">
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Theme />
        </motion.button>
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={openCart}>
          <CartIcon />
        </motion.button>
      </div>
    </div>
  );
}