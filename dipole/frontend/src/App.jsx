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

import NavOffCanvas from "./components/Nav";

import 'bootstrap/dist/css/bootstrap.min.css';
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
          <Route path="/calculators/GasLaws" element={<CalcCard />} />
          <Route path="/calculators/thermo" element={<Thermo />} />
          <Route path="/memegenerator" element={<MemeGen />} />
      </Routes>
    </Router>
  );
}

export default App
