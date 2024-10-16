import React from "react";
export function NavOptions({}) {
  return (
    <ul
      className="links flex-col
    bg-red-500 capitalize"
    >
      <li className="text-center text-5xl font-serif font-bold">
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
  