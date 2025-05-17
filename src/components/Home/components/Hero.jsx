import React from "react";
import { MdFastfood } from "react-icons/md";

const Hero = () => {
  return (
    <div className="bg-inherit p-6">
      <div className=" text-2xl dark:text-white flex gap-2">
        Welcome to
        <div className="flex font-serif italic text-[#110a27] dark:text-[#705e9b]">
          KUKIN
          <span className="text-red-500">
            <MdFastfood />
          </span>
        </div>
      </div>
    </div>
  );
};
export default Hero;
