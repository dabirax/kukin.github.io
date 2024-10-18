import React, { useEffect, useState } from "react";
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
    <div className="h-screen bg-white dark:bg-black flex justify-center items-center">
      <button
        className="dark:text-[#fdfdfd] bg-green-200 dark:bg-blue-800 p-4 rounded-3xl capitalize"
        onClick={handleTheme}
      >
        dark mode
      </button>
    </div>
  );
}
