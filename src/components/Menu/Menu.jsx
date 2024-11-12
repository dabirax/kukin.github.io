import { Navbar } from "../Navbar/navbar";

import BurgerRep from "../../assets/burgerRep.png";

import React from "react";

const Menu = ({ profile }) => {
  return (
    <div className="h-screen bg-white dark:bg-[#05010f] ">
      <Navbar profile={profile} />
      <div className="container">
        <img src={BurgerRep} alt="" className="bg-red-600" />
      </div>
    </div>
  );
};
export default Menu;
