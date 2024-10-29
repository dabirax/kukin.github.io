import { Navbar } from "./components/Navbar/navbar";
import profile from "./assets/profile.jpeg";
import "./App.css";

function App() {
  return (
    <div className="h-screen bg-white dark:bg-black ">
      <Navbar profile={profile} />
    </div>
  );
}

export default App;
