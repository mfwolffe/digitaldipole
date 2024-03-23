import React from "react";
import { NavLink as Link } from "react-router-dom"
import reactLogo from '../assets/react.svg'
import ethylAcetate from '../assets/ethyl-acetate.svg'
import benzeneOxide from '../assets/benzene-oxide.svg'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/bootstrap.min-dipole.css';
import '../App.css'

const Home = () => {
    return (
        <>
            <div>
                <h1>Digital Dipole</h1>
                <h2 id="subtitle">A Chemistry Educational Toolkit</h2>
                <h3>Powered by:</h3>
                <a href="https://vitejs.dev" target="_blank">
                    <img src={benzeneOxide} className="logo" alt="Vite logo" />
                </a>
                <a href="https://react.dev" target="_blank">
                    <img src={reactLogo} className="logo react" alt="React logo" />
                </a>
                <a href="https://www.djangoproject.com/" target="_blank">
                    <img src={ethylAcetate} className="logo" alt="Django logo" />
                </a>
            </div>
            <h2 id="scaffolds">Vite + React + Django</h2>
            <p className="mt-5" id="use">
                Edit <code>src/App.jsx</code> and save to test HMR
            </p>
            <div className="card-dp">
                <p id="user-stat">
                    You are logged in as <b>{username}</b>.
                </p>

                <button id="cont">
                    <Link to="/dash">
                        Continue to Site
                    </Link>
                </button>

            </div>
            <p className="read-the-docs">
                Click on the React logo or spinning molecules to learn more.
            </p>
            <p className="read-the-docs">
                (first is Vite, second React, third Django)
            </p>
        </>
    );
}

export default Home;