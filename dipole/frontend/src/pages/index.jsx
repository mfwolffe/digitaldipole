import React from "react";
import { NavLink as Link } from "react-router-dom"
import AscorbicAcid from '../assets/png/ascorbic-acid.png'
import AcetylSalicylicAcid from '../assets/png/Aspirin.png'
import Indigo from '../assets/png/indigo.png'
import '../App.css'

const Home = () => {
    return (
        <div className="landing-container">
            <div className="landing mt-2">
                <div>
                    <h1 className="anim text-5xl font-light tracking-tight text-primary-400" id="site-title">Digital Dipole</h1>
                    <h2 className="text-xl text-gray-300 mt-2" id="subtitle">A Chemistry Educational Toolkit</h2>
                    <h3 className="anim text-lg text-gray-400 mt-6" id="scaffold-prompt">Powered by:</h3>
                    <div className="flex justify-center items-center gap-4 mt-4">
                        <a href="https://pubchem.ncbi.nlm.nih.gov/compound/54670067" target="_blank" className="anim">
                            <img src={AscorbicAcid} loading="lazy" className="logo w-24 h-24 object-contain hover:scale-110 transition-transform" alt="Ascorbic acid (vitamin C) ball and stick model" />
                        </a>
                        <a href="https://pubchem.ncbi.nlm.nih.gov/compound/2244" target="_blank" className="anim">
                            <img src={AcetylSalicylicAcid} loading="lazy" className="logo middle w-28 h-28 object-contain hover:scale-110 transition-transform" alt="acetyl salicylic acid (aspirin) ball and stick model" />
                        </a>
                        <a href="https://pubchem.ncbi.nlm.nih.gov/compound/10215" target="_blank" className="anim">
                            <img src={Indigo} loading="lazy" className="logo w-24 h-24 object-contain hover:scale-110 transition-transform" alt="indigo ball and stick model" />
                        </a>
                    </div>
                </div>
                <h2 className="scaffolds text-lg text-accent-400 mt-6" id="site-scaffolds">Vite + React + Django</h2>
                <p className="mt-8 text-gray-400" id="use">
                    Edit <code className="bg-surface-800 px-2 py-0.5 rounded text-sm">src/App.jsx</code> and save to test HMR
                </p>
                <div className="card-dp mt-4 p-4 rounded-lg bg-surface-800/50">
                    <p className="text-gray-300" id="user-stat">
                        You are logged in as <strong className="text-primary-400">{typeof username !== 'undefined' ? username : 'Guest'}</strong>.
                    </p>
                </div>
                <p className="read-the-docs mt-8 text-sm text-gray-500">
                    Visit the <a target="_blank" className="text-primary-400 hover:text-primary-300 hvr-underline-from-center" href="https://github.com/347S24/347-final-project-digitaldipole">github</a>
                </p>
                <p className="read-the-docs mt-2 text-sm text-gray-500">
                    What's a <a target="_blank" className="text-primary-400 hover:text-primary-300 hvr-underline-from-center" href="https://www.chem.ucla.edu/~harding/IGOC/D/dipole.html">dipole</a> anyway?
                </p>
            </div>
        </div>
    );
}

export default Home;
