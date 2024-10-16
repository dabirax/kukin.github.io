import { Sidebar } from './sidebar';
import profile from "./assets/profile.jpeg";
import "./App.css";
import { useState } from "react";

function App() {
  const [toggle, setToggle] = useState(false);
  const handleNav = () => {

    setToggle(!toggle);
  };

  return (
    <>
      {toggle && <Sidebar profile={profile} handleNav ={handleNav}/>}
      {!toggle && (
        <button className="sidebar-toggle" onClick={handleNav}>
          <i className="fas fa-bars"></i>
        </button>
      )}
    </>
  );
}

export default App;
