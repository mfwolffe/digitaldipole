import React from "react";
import { NavLink as Link } from "react-router-dom"
// import reactLogo from '../assets/react.svg'
// import ethylAcetate from '../assets/png/ethyl-acetate.png'
// import benzeneOxide from '../assets/png/benzene-oxide.png'
import AscorbicAcid from '../assets/png/ascorbic-acid.png'
import AcetylSalicylicAcid from '../assets/png/Aspirin.png'
import Indigo from '../assets/png/indigo.png'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/bootstrap.min-dipole.css';
import '../App.css'

const Home = () => {
    return (
        <div className="landing-container">
            <div className="landing mt-2">
                <div>
                    <h1 className="anim" id="site-title">Digital Dipole</h1>
                    <h2 id="subtitle">A Chemistry Educational Toolkit</h2>
                    <h3 className="anim" id="scaffold-prompt">Powered by:</h3>
                    <a href="https://pubchem.ncbi.nlm.nih.gov/compound/54670067" target="_blank" className="anim">
                        <img src={AscorbicAcid} className="logo" alt="Ascorbic acid (vitamin C) ball and stick model" />
                    </a>
                    <a href="https://pubchem.ncbi.nlm.nih.gov/compound/2244" target="_blank" className="anim">
                        <img src={AcetylSalicylicAcid} className="logo middle" alt="acetyl salicylic acid (aspirin) ball and stick model" />
                    </a>
                    <a href="https://pubchem.ncbi.nlm.nih.gov/compound/10215" target="_blank" className="anim">
                        <img src={Indigo} className="logo" alt="indigo ball and stick model" />
                    </a>
                </div>
                <h2 className="scaffolds" id="site-scaffolds">Vite + React + Django</h2>
                <p className="mt-5" id="use">
                    Edit <code>src/App.jsx</code> and save to test HMR
                </p>
                <div className="card-dp">
                    <p id="user-stat">
                        You are logged in as <b>{username}</b>.
                    </p>
                    {/* <button id="cont">
                        <Link to="/dash">
                            Continue to Site
                        </Link>
                    </button> */}
                </div>
                <p className="read-the-docs">
                    Visit the <a target="_blank" className="hvr-underline-from-center api" href="https://github.com/347S24/347-final-project-digitaldipole">github</a>
                </p>
                <p className="read-the-docs">
                    What's a <a target="_blank" className="hvr-underline-from-center api" href="https://www.chem.ucla.edu/~harding/IGOC/D/dipole.html">dipole</a> anyway?
                </p>
            </div>
        </div>
    );
}

export default Home;