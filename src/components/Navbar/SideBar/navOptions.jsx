import React from "react";
import { Link } from "react-router-dom";
export function NavOptions({}) {
  return (
    <ul className="links flex-col capitalize text-2xl text-center  font-bold text-[#CED4DA] mt-14">
      <li className="hover:scale-110 duration-200 hover:text-[#1ABC9C]">
        <Link to="/">home</Link>
      </li>
      <li className="hover:scale-110 duration-200 hover:text-[#1ABC9C]">
        <Link to="/menu">menu</Link>
      </li>
      <li className="hover:scale-110 duration-200 hover:text-[#1ABC9C]">
        <a href="/articles">articles</a>
      </li>
      <li className="hover:scale-110 duration-200 hover:text-[#1ABC9C]">
        <a href="/settings">settings</a>
      </li>
    </ul>
  );
}
  