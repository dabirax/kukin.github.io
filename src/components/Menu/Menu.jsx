import { Navbar } from "../Navbar/navbar";
import Button from "../Shared/Button.jsx";

import BurgerRep from "../../assets/burgerRep.png";
import SaladsRep from "../../assets/saladsRep.png";
import DessertsRep from "../../assets/dessertsRep.png";
import DrinksRep from "../../assets/drinksRep.png";
import PizzasRep from "../../assets/pizzaRep.png";

import React from "react";
import { Link, Outlet } from "react-router-dom";

const menuCategories = [
  {
    id: 1,
    bgColor: "gray-800",
    image: BurgerRep,
    title: "Burgers",
  },
  {
    id: 2,
    bgColor: "yellow-400",
    image: SaladsRep,
    title: "Salads",
  },
  {
    id: 3,
    bgColor: "gray-800",
    image: DessertsRep,
    title: "Desserts",
  },
  {
    id: 4,
    bgColor: "gray-800",
    image: PizzasRep,
    title: "Pizzas",
  },
  {
    id: 5,
    bgColor: "gray-800",
    image: DrinksRep,
    title: "Drinks",
  },
];

const Menu = () => {
  return (
    <div className="container mt-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-max">
        {/* First Col */}
        {menuCategories.map((category, index) => {
          console.log(category.bgColor);
          if (category.id % 2 !== 0) {
            return (
              <div
                key={category.id}
                className={`py-5 
                  pl-5 bg-gradient-to-br from-gray-800/90 to-gray-800/70 text-white rounded-3xl relative h-[320px] w-72 flex flex-col items-start`}
              >
                <div className="mb-4">
                  <p className="text-4xl xl:text-5xl font-bold opacity-20 mb-4">
                    {category.title}
                  </p>
                  <div>
                    <Link to="/menu/category">
                      <Button
                        text="Check out"
                        bgColor="bg-red-500"
                        textColor={`text-white dark:text-gray-800/70 `}
                      />
                    </Link>
                  </div>
                  {/* <Outlet /> */}
                </div>
                <div className="flex justify-end w-full ">
                  <img
                    src={category.image}
                    alt=""
                    className="w-[170px] p-3 object-cover"
                  />
                </div>
              </div>
            );
          } else {
            return (
              <div
                key={category.id}
                className={`py-5 pl-5 bg-gradient-to-br from-gray-800/90 to-gray-800/70  text-white rounded-3xl relative h-[320px] w-72 flex flex-col items-end`}
              >
                <div>
                  <img
                    src={category.image}
                    alt=""
                    className="w-[170px] p-3 object-cover"
                  />
                </div>
                <div className="mb-4 flex flex-col items-start w-full">
                  <p className="text-4xl xl:text-5xl font-bold opacity-40 mb-4">
                    {category.title}
                  </p>
                  <Button
                    text="Check out"
                    bgColor="bg-red-500"
                    textColor={`text-white dark:text-gray-800/70 `}
                  />
                </div>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
};
export default Menu;
