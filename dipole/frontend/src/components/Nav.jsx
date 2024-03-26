import React from "react";
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
// import Container from 'react-bootstrap/Container';
// import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink as Link} from "react-router-dom"
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { all } from '@awesome.me/kit-a655910996/icons'
import { library } from "@fortawesome/fontawesome-svg-core";

import userIcon from    '../assets/png/user-astronaut-light.png'
import userPost from    '../assets/png/light-user-astronaut-pen.png'
import userGear from    '../assets/png/light-user-astronaut-gear.png'
import userLock from    '../assets/png/light-user-astronaut-lock.png'
import userShield from  '../assets/png/light-user-astronaut-shield.png'

// TODO get FA hover animations up and running ?
// import 'https://cdn.jsdelivr.net/npm/font-awesome-animation@1.1.1/css/font-awesome-animation.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/bootstrap.min-dipole.css';
import '../App.css'

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

    const usrIcon = <FontAwesomeIcon icon="fa-duotone fa-user-astronaut" size="2xl" className="usr-ico usr-coral" />;
    const usrPost = <FontAwesomeIcon icon="fa-kit fak-light-user-astronaut-pen" size="md" />;
    const usrSetting = <FontAwesomeIcon icon="fa-kit fak-light-user-astronaut-gear" size="md" />;

    return (
        <>
            <Navbar className="offC-nav w-85 m-auto p-0 justify-content-between">
                {/* <Container className="ml-0 mr-0" id="navContainer"> */}
                <Button className="sbar-btn" onClick={toggleShow}>
                    {/* <FontAwesomeIcon icon={faSidebar} /> */}
                    {/* <FontAwesomeIcon icon="fa-duotone fa-sidebar" size="2xl" className="sbar-ico" /> */}
                    <FontAwesomeIcon icon="fa-duotone fa-webhook" size="2xl" className="sbar-ico" />
                </Button>
                <NavDropdown title={usrIcon} id="basic-nav-dropdown" drop="down" className="usr-drp">
                    <NavDropdown.Header>
                        <img src={userIcon} width="24px" className="pr-2" /> <b>{ username }</b>
                    </NavDropdown.Header>
                    <NavDropdown.Item>
                        {/* TODO see image element - native svg support? */}
                        <img src={userPost} width="24px" className="pr-2" />
                        Posts
                    </NavDropdown.Item>
                    <NavDropdown.Item>
                        <img src={userGear} width="24px" className="pr-2" />
                        Settings
                    </NavDropdown.Item>
                    <NavDropdown.Item>
                        <img src={userShield} width="24px" className="pr-2" />
                        Privacy
                    </NavDropdown.Item>
                    <NavDropdown.Item>
                        <img src={userLock} width="24px" className="pr-2" />
                        Signout
                    </NavDropdown.Item>
                </NavDropdown>
                <Offcanvas show={show} onHide={handleClose} {...scrollBackdrop} className="offC">
                    <Offcanvas.Header className="pb-0" closeButton>
                        <Offcanvas.Title>Dashboard</Offcanvas.Title>
                    </Offcanvas.Header>
                    <hr className="mt-0 w-75" />
                    <Offcanvas.Body>
                        <NavDropdown title="References" id="nav-ref">
                            <ul>
                                <li>
                                    <NavDropdown.Item eventKey="ref-1" className="text-wrap">
                                        <Link to="/tabulated" className="pl-0 ml-0">
                                            Tabulated Data
                                        </Link>
                                    </NavDropdown.Item>
                                </li>
                                <li>
                                    <NavDropdown.Item eventKey="ref-2" className="text-wrap">
                                        Periodic Tables
                                    </NavDropdown.Item>
                                </li>
                                <li>
                                    <NavDropdown.Item eventKey="ref-3" className="text-wrap">
                                        Conversion Factors And Fundamental Constants
                                    </NavDropdown.Item>
                                </li>
                                <li>
                                    <NavDropdown.Item eventKey="ref-4" className="text-wrap">
                                        Common Equations
                                    </NavDropdown.Item>
                                </li>
                            </ul>
                        </NavDropdown>
                    </Offcanvas.Body>
                </Offcanvas>
                {/* <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand> */}

                {/* TODO test drop w/ collapse since that should provide smooth animation */}
                {/* <Navbar.Toggle aria-controls="basic-navbar-nav" /> */}
                {/* <Navbar.Collapse id="basic-navbar-nav"> */}
                {/* </Navbar.Collapse> */}
                {/* </Container> */}
            </Navbar>
            <hr className="mt-0 w-85 m-auto" />
        </>
    );
}

export default NavOffCanvas;
