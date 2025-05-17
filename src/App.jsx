import { Home } from "./components/Home/Home";
import { Route, Routes } from "react-router-dom";
import profile from "./assets/profile.jpeg";
import "./App.css";
import Menu from "./components/Menu/Menu";
import Articles from "./components/Articles/articles";
import Settings from "./components/Settings/settings";
import { Navbar } from "./components/Navbar/navbar";
import Category from "./components/Menu/categories/Cgory";

function App() {
  return (
    <>
      <div className="h-screen bg-white dark:bg-[#05010f] relative">
        <Navbar profile={profile} />
        <Routes>
          <Route path="/" element={<Home profile={profile} />} />
          <Route path="/menu" element={<Menu profile={profile} />}>
            {/* <Route index={<Menu profile={profile} />} /> */}
            <Route path="/menu/category" element={<Category profile={profile} />} />
          </Route>

          <Route
            path="articles"
            element={<Articles profile={profile} />}
          ></Route>
          <Route
            path="settings"
            element={<Settings profile={profile} />}
          ></Route>
        </Routes>
      </div>
    </>
  );
}

export default App;
