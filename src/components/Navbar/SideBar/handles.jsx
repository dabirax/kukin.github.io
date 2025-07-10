import React from "react";
export function Handles({}) {
  return (
    <ul className="social-icons flex gap-8 text-3xl justify-center text-[#1ABC9C] mt-36">
      <li className="hover:scale-110 duration-200 hover:text-[#CED4DA]">
        <a href="https://www.twitter.com " target="_blank">
          <i className="fab fa-facebook"></i>
        </a>
      </li>
      <li className="hover:scale-110 duration-200 hover:text-[#CED4DA]">
        <a href="https://www.twitter.com" target="_blank">
          <i className="fab fa-twitter"></i>
        </a>
      </li>
      <li className="hover:scale-110 duration-200 hover:text-[#CED4DA]">
        <a href="https://www.twitter.com" target="_blank">
          <i className="fab fa-instagram"></i>
        </a>
      </li>
    </ul>
  );
}
  