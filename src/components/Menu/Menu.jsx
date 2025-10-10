import { Navbar } from "../Navbar/navbar";
import Button from "../Shared/Button.jsx";
import data from "../../data.jsx";

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
    accessor: "burger",
  },
  {
    id: 2,
    bgColor: "yellow-400",
    image: SaladsRep,
    title: "Salads",
    accessor: "salad",
  },
  {
    id: 3,
    bgColor: "gray-800",
    image: DessertsRep,
    title: "Desserts",
    accessor: "dessert",
  },
  {
    id: 4,
    bgColor: "gray-800",
    image: PizzasRep,
    title: "Pizzas",
    accessor: "pizza",
  },
  {
    id: 5,
    bgColor: "gray-800",
    image: DrinksRep,
    title: "Drinks",
    accessor: "drinks",
  },
];

const Menu = () => {
  return (
    <div className="container mt-8">
      <div className="grid grid-cols-1 justify-items-center sm:grid-cols-2 lg:grid-cols-3 gap-8 ">
        {/* First Col */}
        {menuCategories.map((category, index) => {
          // console.log(category.bgColor);
          const { id, title, image, bgColor, accessor } = category;

          if (category.id % 2 !== 0) {
            return (
              <div
                key={id}
                className={`py-5 
                  pl-5 bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-3xl relative h-[320px] w-72 flex flex-col items-start shadow-2xl`}
              >
                <div className="mb-4">
                  <p className="text-4xl xl:text-5xl font-bold opacity-40 mb-4">
                    {title}
                  </p>
                  <div>
                    <Link to="/menu/category" state={{ data, accessor }}>
                      <Button
                        text="Explore"
                        bgColor="bg-[#1ABC9C]/50"
                        textColor={`text-[#CED4DA] dark:text-gray-800/70 `}
                      />
                    </Link>
                  </div>
                  {/* <Outlet /> */}
                </div>
                <div className="flex justify-end w-full ">
                  <img
                    src={image}
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
                className={`py-5 pl-5 bg-gradient-to-br from-slate-800 to-slate-900	 text-white rounded-3xl relative h-[320px] w-72 flex flex-col items-end shadow-2xl`}
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
                  <div>
                    <Link to="/menu/category" state={{ data, accessor }}>
                      <Button
                        text="Explore"
                        bgColor="bg-[#1ABC9C]/50"
                        textColor={`text-[#CED4DA] dark:text-gray-800/70 `}
                      />
                    </Link>
                  </div>
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
