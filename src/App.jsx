import { Home } from "./components/Home/Home";
import { Route, Routes } from "react-router-dom";
import profile from "./assets/profile.jpeg";
import "./App.css";
import Menu from "./components/Menu/Menu";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home profile={profile} />}></Route>
      <Route path="menu" element={<Menu profile={profile}/>}></Route>
    </Routes>
  );
}

export default App;
