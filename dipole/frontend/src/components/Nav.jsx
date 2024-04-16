import React from "react";
import { useState } from 'react';

import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import NavItem from "react-bootstrap/esm/NavItem";
import { NavLink as Link } from "react-router-dom";
import { all } from '@awesome.me/kit-a655910996/icons';
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { UserDrop, SearchBar, OffCDropRef, OffCDropCalc } from "./NavComponents";

import '../App.css'
import '../styles/hover.css'
import '../styles/bootstrap.min-dipole.css';
import 'bootstrap/dist/css/bootstrap.min.css';
// TODO get FA hover animations up and running ?
// import 'https://cdn.jsdelivr.net/npm/font-awesome-animation@1.1.1/css/font-awesome-animation.min.css';

library.add(...all)

const NavOffCanvas = () => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const toggleShow = () => setShow((s) => !s);

    const scrollBackdrop = {
        name: 'test',
        scroll: true,
        backdrop: true,
    }

    return (
        <>
            <Navbar className="offC-nav w-85 m-auto p-0 justify-content-between">
                {/* <Container className="ml-0 mr-0" id="navContainer"> */}
                <Button className="sbar-btn" onClick={toggleShow}>
                    {/* <FontAwesomeIcon icon="fa-duotone fa-sidebar" size="2xl" className="sbar-ico" /> */}
                    <FontAwesomeIcon icon="fa-duotone fa-webhook" size="2xl" className="sbar-ico hvr-wobble-horizontal" />
                </Button>

                <SearchBar />

                <UserDrop />

                <Offcanvas show={show} onHide={handleClose} {...scrollBackdrop} className="offC">
                    <Offcanvas.Header className="pb-0" closeButton>
                        <Offcanvas.Title>Dashboard</Offcanvas.Title>
                    </Offcanvas.Header>
                    <hr className="mt-0 w-75" />
                    <Offcanvas.Body className="pt-1">
                        {/* [x] TODO vertical alignment of icon and text 
                          * it was the 90° rotation causing the issue surprisingly
                          */}
                        <NavItem>
                            <FontAwesomeIcon icon="fa-duotone fa-atom" size="xl" style={{ "--fa-primary-color": "#578be5", "--fa-secondary-color": "#143671", "width": "1.4rem" }} className="pr-2 pb-0" />
                            <Link to="/" className="ml-0 hvr-underline-from-left">
                                Home
                            </Link>
                        </NavItem>

                        {/* OFF CANVAS DROPDOWNS */}
                        {/* TODO test drop w/ collapse since that should provide smooth animation */}
                        <OffCDropRef />
                        <OffCDropCalc />

                        {/* Link to the AI meme gen */}
                        <NavItem>
                            <FontAwesomeIcon icon="fa-duotone fa-robot" size="xl" style={{ "--fa-primary-color": "#143671", "--fa-secondary-color": "#143671", "width": "1.4rem" }} className="pr-2 pb-0" />
                            <Link to="/memegenerator" className="ml-0 hvr-underline-from-left">
                                AI Meme Generator
                            </Link>
                        </NavItem>

                    </Offcanvas.Body>
                </Offcanvas>
            </Navbar>
            <hr className="mt-0 w-85 m-auto" />
        </>
    );
}

export default NavOffCanvas;
