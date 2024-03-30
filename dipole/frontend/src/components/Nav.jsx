import React from "react";
import { useState } from 'react';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';

import Navbar from 'react-bootstrap/Navbar';
import NavItem from "react-bootstrap/esm/NavItem";
import { NavLink as Link } from "react-router-dom";
import NavDropdown from 'react-bootstrap/NavDropdown';

import Popover from 'react-bootstrap/Popover';
import Offcanvas from 'react-bootstrap/Offcanvas';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';

import { all } from '@awesome.me/kit-a655910996/icons'
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// the FA ico's with additional customization don't play well with SVG so png instead
import userIcon from '../assets/png/user-astronaut-light.png';
import userPost from '../assets/png/light-user-astronaut-pen.png';
import userGear from '../assets/png/light-user-astronaut-gear.png';
import userLock from '../assets/png/light-user-astronaut-lock.png';
import userShield from '../assets/png/light-user-astronaut-shield.png';


import '../App.css'
import '../styles/hover.css'
import '../styles/bootstrap.min-dipole.css';
import 'bootstrap/dist/css/bootstrap.min.css';
// TODO get FA hover animations up and running ?
// import 'https://cdn.jsdelivr.net/npm/font-awesome-animation@1.1.1/css/font-awesome-animation.min.css';

library.add(...all)

// TODO see documentation:
// https://react-bootstrap.netlify.app/docs/components/overlays#popovers
// to implement close on click outside + more granular styling across 
// bs prefixed classes
const searchTip = (
    <Popover id="search-tip">
        <Popover.Header as="h3"><FontAwesomeIcon icon="fa-duotone fa-circle-info" size="lg" style={{"--fa-primary-color": "#78c9f2", "--fa-secondary-color": "#6d1aea",}} className="pr-2" />
            Not sure what to search?
        </Popover.Header>
        <Popover.Body>
            <ul className="pb-0 mb-0">
                <li>Try the name of an element or molecule, like <strong><em>antimony</em></strong> or <strong><em>ammonia</em></strong>.</li>
                <li>or a class of calculators or references, like <strong><em>entropy calculator</em></strong> or <strong><em>acid/base ionization constant table</em></strong>.</li>
            </ul>
        </Popover.Body>
    </Popover>
);

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

    const refIcon = (
        <>
            <FontAwesomeIcon icon="fa-duotone fa-book-bookmark" size="xl" style={{ "--fa-secondary-color": "#578be5", "--fa-primary-color": "#143671", "width": "1.4rem" }} className="pr-2" />
            References
        </>
    )

    const icoStyle = {
        fontSize: "1.7rem"
    };

    return (
        <>
            <Navbar className="offC-nav w-85 m-auto p-0 justify-content-between">
                {/* <Container className="ml-0 mr-0" id="navContainer"> */}
                <Button className="sbar-btn" onClick={toggleShow}>
                    {/* <FontAwesomeIcon icon="fa-duotone fa-sidebar" size="2xl" className="sbar-ico" /> */}
                    <FontAwesomeIcon icon="fa-duotone fa-webhook" size="2xl" className="sbar-ico hvr-wobble-horizontal" />
                </Button>

                {/* TOCONSIDER search bar on right? left? or find way to get button inside like placeholder? */}
                <Form inline>
                    <InputGroup>
                        <OverlayTrigger trigger="focus" placement="bottom" overlay={searchTip} delay="2000">
                            <Form.Control type="text" placeholder="Search" id="hdr-search"/>
                        </OverlayTrigger>
                        <Button className="sbar-btn hvr-grow-rotate">
                            <FontAwesomeIcon icon="fa-duotone fa-magnifying-glass" style={icoStyle} />
                        </Button>
                    </InputGroup>
                </Form>

                <NavDropdown title={usrIcon} id="basic-nav-dropdown" drop="down" className="usr-drp">
                    <NavDropdown.Header>
                        <img src={userIcon} width="24px" className="pr-2" /> <b>{username}</b>
                    </NavDropdown.Header>
                    <NavDropdown.Item className="hvr-underline-from-left">
                        {/* [x] TODO see image element - native svg support? */}
                                {/*  yeah it's possible but probably want to 
                                  * try setting frame of ref / origin in inkscape
                                  * or illustrator 
                                  */}
                        <img src={userPost} width="24px" className="pr-2" />
                        Posts
                    </NavDropdown.Item>
                    <NavDropdown.Item className="hvr-underline-from-left">
                        <img src={userGear} width="24px" className="pr-2" />
                        Settings
                    </NavDropdown.Item>
                    <NavDropdown.Item className="hvr-underline-from-left">
                        <img src={userShield} width="24px" className="pr-2" />
                        Privacy
                    </NavDropdown.Item>
                    <NavDropdown.Item className="hvr-underline-from-left">
                        <img src={userLock} width="24px" className="pr-2" />
                        Signout
                    </NavDropdown.Item>
                </NavDropdown>
                <Offcanvas show={show} onHide={handleClose} {...scrollBackdrop} className="offC">
                    <Offcanvas.Header className="pb-0" closeButton>
                        <Offcanvas.Title>Dashboard</Offcanvas.Title>
                    </Offcanvas.Header>
                    <hr className="mt-0 w-75" />
                    <Offcanvas.Body className="pt-1">
                        {/* TODO vertical alignment of icon and text */}
                        <NavItem>
                            <FontAwesomeIcon icon="fa-duotone fa-atom" size="xl" style={{ "--fa-primary-color": "#578be5", "--fa-secondary-color": "#143671", "width": "1.4rem" }} className="pr-2 pb-0" />
                            <Link to="/" className="ml-0 hvr-underline-from-left">
                                Home
                            </Link>
                        </NavItem>
                        <NavItem>
                            <NavDropdown title={refIcon} id="nav-ref" className="pl-0">
                                <ul>
                                    <li>
                                        <NavDropdown.Item eventKey="ref-1" className="text-wrap pl-0 hvr-underline-from-left">
                                            <Link to="/tabulated" className="pl-0 ml-0">
                                                Tabulated Data
                                            </Link>
                                        </NavDropdown.Item>
                                    </li>
                                    <li>
                                        <NavDropdown.Item eventKey="ref-2" className="text-wrap pl-0 hvr-underline-from-left">
                                            Periodic Tables
                                        </NavDropdown.Item>
                                    </li>
                                    <li>
                                        <NavDropdown.Item eventKey="ref-3" className="text-wrap pl-0 hvr-underline-from-left">
                                            Conversion Factors And Fundamental Constants
                                        </NavDropdown.Item>
                                    </li>
                                    <li>
                                        <NavDropdown.Item eventKey="ref-4" className="text-wrap pl-0 hvr-underline-from-left">
                                            Common Equations
                                        </NavDropdown.Item>
                                    </li>
                                </ul>
                            </NavDropdown>
                        </NavItem>
                    </Offcanvas.Body>
                </Offcanvas>
                {/* TODO test drop w/ collapse since that should provide smooth animation */}
            </Navbar>
            <hr className="mt-0 w-85 m-auto" />
        </>
    );
}

export default NavOffCanvas;
