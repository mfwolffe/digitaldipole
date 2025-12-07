import { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { UnitPreferencesProvider } from "./contexts/UnitPreferencesContext";

// Lazy load pages for code splitting
const Home = lazy(() => import('./pages'));
const Tabulated = lazy(() => import("./pages/tabulated"));
const MemeGen = lazy(() => import("./pages/memegenerator"));
const CalcCard = lazy(() => import("./pages/calculators/GasLaws"));
const Thermo = lazy(() => import("./pages/calculators/thermodynamics"));
const Kinetics = lazy(() => import("./pages/calculators/kinetics"));
const Solutions = lazy(() => import("./pages/calculators/solutions"));
const Electrochemistry = lazy(() => import("./pages/calculators/electrochemistry"));
const Balancer = lazy(() => import("./pages/balancer"));
const Account = lazy(() => import("./pages/account"));
const Favorites = lazy(() => import("./pages/favorites"));
const Converter = lazy(() => import("./pages/converter"));

import NavOffCanvas from "./components/Nav";

// Loading fallback component
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>
  );
}

// Custom CSS variables and styles (migrated from legacy Bootstrap)
import './styles/custom-variables.css';
import './App.css'

function App() {
  return (
    <AuthProvider>
      <UnitPreferencesProvider>
        <Router>
          <NavOffCanvas />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route exact path="/" element={<Home />} />
              <Route path="/tabulated" element={<Tabulated />} />
              <Route path="/calculators/gas-laws/:tab?" element={<CalcCard />} />
              <Route path="/calculators/thermo/:tab?" element={<Thermo />} />
              <Route path="/calculators/kinetics/:tab?" element={<Kinetics />} />
              <Route path="/calculators/solutions/:tab?" element={<Solutions />} />
              <Route path="/calculators/electrochemistry/:tab?" element={<Electrochemistry />} />
              <Route path="/balancer" element={<Balancer />} />
              <Route path="/memegenerator" element={<MemeGen />} />
              <Route path="/account" element={<Account />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/converter" element={<Converter />} />
            </Routes>
          </Suspense>
        </Router>
      </UnitPreferencesProvider>
    </AuthProvider>
  );
}

export default App
