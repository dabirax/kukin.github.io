import React from "react";
export function NavOptions({}) {
  return (
    <ul className="links flex-col capitalize text-4xl text-center font-serif font-bold text-[#adadc9] mt-14">
      <li className="hover:scale-110 duration-200 hover:text-[#c93131]">
        <a href="#">home</a>
      </li>
      <li className="hover:scale-110 duration-200 hover:text-[#c93131]">
        <a href="#">menu</a>
      </li>
      <li className="hover:scale-110 duration-200 hover:text-[#c93131]">
        <a href="#">articles</a>
      </li>
      <li className="hover:scale-110 duration-200 hover:text-[#c93131]">
        <a href="#">settings</a>
      </li>
    </ul>
  );
}
  