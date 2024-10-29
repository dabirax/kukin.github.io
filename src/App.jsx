import { Navbar } from "./components/Navbar/navbar";
import Hero from "./components/Content/Hero";
import profile from "./assets/profile.jpeg";
import "./App.css";


function App() {
  return (
    <div className="h-screen bg-white dark:bg-[#05010f] ">
      <Navbar profile={profile} />
      <Hero/>
    </div>
  );
}

export default App;
