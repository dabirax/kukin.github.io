import React from "react";
import { Link } from "react-router-dom";
export function NavOptions({}) {
  return (
    <ul className="links flex-col capitalize text-4xl text-center font-serif font-bold text-[#adadc9] mt-14">
      <li className="hover:scale-110 duration-200 hover:text-[#c93131]">
        <Link to="/">home</Link>
      </li>
      <li className="hover:scale-110 duration-200 hover:text-[#c93131]">
        <Link to="/menu">menu</Link>
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
  