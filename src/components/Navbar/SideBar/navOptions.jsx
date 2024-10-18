import React from "react";
export function NavOptions({}) {
  return (
    <ul className="links flex-col capitalize text-4xl text-center font-serif font-bold gap-x-8 text-[#adadc9]">
      <li className="">
        <a href="index.html">home</a>
      </li>
      <li>
        <a href="about.html">about</a>
      </li>
      <li>
        <a href="projects.html">projects</a>
      </li>
      <li>
        <a href="contact.html">contact</a>
      </li>
    </ul>
  );
}
  