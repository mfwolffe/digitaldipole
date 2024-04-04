import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import Home from './pages'
import Tabulated from "./pages/tabulated";
import CalcCard from "./pages/calculators/GasLaws"

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
      </Routes>
    </Router>
  );
}

export default App
