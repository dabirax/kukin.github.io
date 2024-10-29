import React, { useEffect, useState } from "react";

import { CgDarkMode } from "react-icons/cg";
import { MdOutlineDarkMode } from "react-icons/md";
export function Theme() {
  const [theme, setTheme] = useState(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  }, []);
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const handleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="">
      <button
        className="dark:text-[#fdfdfd]  bg-[#705e9b] dark:bg-[#201a41] p-2 text-3xl rounded-full"
        onClick={handleTheme}
      >
        <MdOutlineDarkMode />
      </button>
    </div>
  );
}
