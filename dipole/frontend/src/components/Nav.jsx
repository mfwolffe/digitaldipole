import React from "react";
import { useState } from 'react';
import { NavLink as Link } from "react-router-dom";

import { Offcanvas } from './ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { UserDrop, SearchBar, OffCDropRef, OffCDropCalc } from "./NavComponents";

import '../App.css'
import '../styles/hover.css'

const NavOffCanvas = () => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const toggleShow = () => setShow((s) => !s);

    return (
        <>
            <div className="w-[85%] mx-auto py-3 grid grid-cols-[auto_1fr_auto] items-center gap-4">
                {/* Left: Atom icon */}
                <button
                    type="button"
                    onClick={toggleShow}
                    className="p-1 bg-transparent hover:opacity-80 transition-opacity"
                    style={{ border: 'none', outline: 'none', background: 'transparent' }}
                >
                    <FontAwesomeIcon
                        icon="fa-duotone fa-atom"
                        size="2xl"
                        className="hvr-rotate"
                        style={{
                            "--fa-primary-color": "#ff4400",
                            "--fa-secondary-color": "coral",
                            "--fa-secondary-opacity": "1",
                            "--fa-primary-opacity": "1"
                        }}
                    />
                </button>

                {/* Center: Search bar - centered in middle column */}
                <div className="flex justify-center">
                    <SearchBar />
                </div>

                {/* Right: User dropdown */}
                <UserDrop />
            </div>

            <Offcanvas
                show={show}
                onClose={handleClose}
                placement="start"
                title="Dashboard"
                backdrop={true}
            >
                <nav className="space-y-1">
                    {/* Home link */}
                    <div className="flex items-center gap-3 py-3 px-2 rounded-lg hover:bg-gray-100 transition-colors">
                        <FontAwesomeIcon
                            icon="fa-duotone fa-atom"
                            size="xl"
                            style={{
                                "--fa-primary-color": "#578be5",
                                "--fa-secondary-color": "#143671",
                            }}
                            className="w-6"
                        />
                        <Link
                            to="/"
                            onClick={handleClose}
                            className="text-gray-900 font-medium hover:text-primary-600"
                        >
                            Home
                        </Link>
                    </div>

                    {/* OFF CANVAS DROPDOWNS */}
                    <OffCDropRef onNavigate={handleClose} />
                    <OffCDropCalc onNavigate={handleClose} />

                    {/* Equation Balancer */}
                    <div className="flex items-center gap-3 py-3 px-2 rounded-lg hover:bg-gray-100 transition-colors">
                        <FontAwesomeIcon
                            icon="fa-duotone fa-scale-balanced"
                            size="xl"
                            style={{
                                "--fa-primary-color": "#14b8a6",
                                "--fa-secondary-color": "#5eead4",
                            }}
                            className="w-6"
                        />
                        <Link
                            to="/balancer"
                            onClick={handleClose}
                            className="text-gray-900 font-medium hover:text-primary-600"
                        >
                            Equation Balancer
                        </Link>
                    </div>

                    {/* Unit Converter */}
                    <div className="flex items-center gap-3 py-3 px-2 rounded-lg hover:bg-gray-100 transition-colors">
                        <FontAwesomeIcon
                            icon="fa-duotone fa-ruler-triangle"
                            size="xl"
                            style={{
                                "--fa-primary-color": "#10b981",
                                "--fa-secondary-color": "#34d399",
                            }}
                            className="w-6"
                        />
                        <Link
                            to="/converter"
                            onClick={handleClose}
                            className="text-gray-900 font-medium hover:text-primary-600"
                        >
                            Unit Converter
                        </Link>
                    </div>

                    {/* AI Meme Generator */}
                    <div className="flex items-center gap-3 py-3 px-2 rounded-lg hover:bg-gray-100 transition-colors">
                        <FontAwesomeIcon
                            icon="fa-duotone fa-robot"
                            size="xl"
                            style={{
                                "--fa-primary-color": "#6366f1",
                                "--fa-secondary-color": "#818cf8",
                            }}
                            className="w-6"
                        />
                        <Link
                            to="/memegenerator"
                            onClick={handleClose}
                            className="text-gray-900 font-medium hover:text-primary-600"
                        >
                            AI Meme Generator
                        </Link>
                    </div>
                </nav>
            </Offcanvas>

            <hr className="mt-0 w-[85%] mx-auto border-gray-300" />
        </>
    );
}

export default NavOffCanvas;
