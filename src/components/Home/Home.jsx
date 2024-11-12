import React from "react";
import { Navbar } from "../Navbar/navbar";
import Hero from "../Content/Hero";
export function Home({ profile }) {
  return (
    <div className="h-screen bg-white dark:bg-[#05010f] ">
      <Navbar profile={profile} />
      <Hero />
    </div>
  );
}
