import { Home } from "./components/Home/Home";
import { Route, Routes } from "react-router-dom";
import profile from "./assets/profile.jpeg";
import "./App.css";
import Menu from "./components/Menu/Menu";
import Articles from "./components/Articles/articles";
import Settings from "./components/Settings/settings";
import { Navbar } from "./components/Navbar/navbar";
import Category from "./components/Menu/components/Cgory";
import bgImg from "./assets/bgImg.jpg";

function App() {
  return (
    <>
      <div
        // style={{ backgroundImage: `url(${bgImg})` }}
        className="min-h-screen bg-slate-800 dark:bg-[#05010f] relative"
      >
        <Navbar profile={profile} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="menu" element={<Menu />} />

          <Route path="/menu/category" element={<Category />} />

          <Route path="articles" element={<Articles />}></Route>
          <Route path="settings" element={<Settings />}></Route>
        </Routes>
      </div>
    </>
  );
}

export default App;
