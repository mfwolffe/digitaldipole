import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Home from './pages'
import Dash from './pages/dash'
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/bootstrap.min-dipole.css';
import './App.css'

// function App({username}) {
function App() {
  console.log("username is ", username);
  console.log(window);

  return (
    <Router>
        <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/dash" element={<Dash />} />
        </Routes>
    </Router>
);}

export default App
