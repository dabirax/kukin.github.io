import React, { useEffect, useState } from "react";

import { CgDarkMode } from "react-icons/cg";
import { MdOutlineDarkMode } from "react-icons/md";
export function Theme() {
  const [theme, setTheme] = useState(() => {
    // Initialize theme from localStorage or OS preference
    if (typeof window !== "undefined") {
      if (localStorage.theme) {
        return localStorage.theme;
      } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return "dark";
      } else {
        return "light";
      }
    }
    return "light";
  });
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [theme]);

  const handleTheme = () => {
    setTheme((theme) => (theme === "dark" ? "light" : "dark"));
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
