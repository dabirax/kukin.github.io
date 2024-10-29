import React from "react";
export function NavOptions({}) {
  return (
    <ul className="links flex-col capitalize text-4xl text-center font-serif font-bold gap-x-8 text-[#adadc9] mt-14">
      <li className="">
        <a href="#">home</a>
      </li>
      <li>
        <a href="#">menu</a>
      </li>
      <li>
        <a href="#">articles</a>
      </li>
      <li>
        <a href="#">settings</a>
      </li>
    </ul>
  );
}
  