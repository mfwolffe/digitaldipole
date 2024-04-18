import React from "react";
import { NavLink as Link } from "react-router-dom"
import reactLogo from '../assets/react.svg'
import ethylAcetate from '../assets/png/ethyl-acetate.png'
import benzeneOxide from '../assets/png/benzene-oxide.png'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/bootstrap.min-dipole.css';
import '../App.css'

const MemeGen = () => {
    return (
        <div className="landing-container">
            <div className="landing mt-2">
                <div>
                    <h1 className="anim">AI Meme Generator</h1>
                </div>
            </div>
        </div>
    );
}

export default MemeGen;