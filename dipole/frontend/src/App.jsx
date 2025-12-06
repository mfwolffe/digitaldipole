import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import Home from './pages'
import Tabulated from "./pages/tabulated";
import MemeGen from "./pages/memegenerator"
import CalcCard from "./pages/calculators/GasLaws"
import Thermo from "./pages/calculators/thermodynamics";
import Kinetics from "./pages/calculators/kinetics";
import Solutions from "./pages/calculators/solutions";
import Electrochemistry from "./pages/calculators/electrochemistry";

import NavOffCanvas from "./components/Nav";

// Note: react-bootstrap removed - now using Tailwind CSS + Headless UI
// Keeping bootstrap.min-dipole.css temporarily for custom styles that may still be in use
import './styles/bootstrap.min-dipole.css';
import './App.css'

// function App({username}) {
function App() {
  console.log("username is ", username);
  console.log(window);

  return (
    <Router>
      <NavOffCanvas />
      <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/tabulated" element={<Tabulated />} />
          <Route path="/calculators/gas-laws/:tab?" element={<CalcCard />} />
          <Route path="/calculators/thermo/:tab?" element={<Thermo />} />
          <Route path="/calculators/kinetics/:tab?" element={<Kinetics />} />
          <Route path="/calculators/solutions/:tab?" element={<Solutions />} />
          <Route path="/calculators/electrochemistry/:tab?" element={<Electrochemistry />} />
          <Route path="/memegenerator" element={<MemeGen />} />
      </Routes>
    </Router>
  );
}

export default App
