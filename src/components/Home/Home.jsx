import React from "react";
import { Navbar } from "../Navbar/navbar";
import Hero from "./components/Hero";
import Section from "./components/Section";

export function Home({ profile }) {
  return (
    <div className="container">
      <Hero />
      <Section />
    </div>
  );
}
