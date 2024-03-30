import React from "react";
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
// import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink as Link } from "react-router-dom"
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { all } from '@awesome.me/kit-a655910996/icons'
import { library } from "@fortawesome/fontawesome-svg-core";

// the FA ico's with additional customization don't play well with SVG so png instead
import userIcon from '../assets/png/user-astronaut-light.png'
import userPost from '../assets/png/light-user-astronaut-pen.png'
import userGear from '../assets/png/light-user-astronaut-gear.png'
import userLock from '../assets/png/light-user-astronaut-lock.png'
import userShield from '../assets/png/light-user-astronaut-shield.png'

// TODO get FA hover animations up and running ?
// import 'https://cdn.jsdelivr.net/npm/font-awesome-animation@1.1.1/css/font-awesome-animation.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/bootstrap.min-dipole.css';
import '../App.css'
import '../styles/hover.css'

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

    const refIcon = (
        <>
            <FontAwesomeIcon icon="fa-duotone fa-book-bookmark" size="xl" style={{"--fa-secondary-color": "#578be5", "--fa-primary-color": "#143671", "width": "1.4rem" }} className="pr-2" />
            <a className="ml-0">References</a>
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
                    {/* <FontAwesomeIcon icon={faSidebar} /> */}
                    {/* <FontAwesomeIcon icon="fa-duotone fa-sidebar" size="2xl" className="sbar-ico" /> */}
                    {/* <FontAwesomeIcon icon="fa-duotone fa-webhook" size="2xl" className="sbar-ico hvr-rotate-forward" /> */}
                    {/* <FontAwesomeIcon icon="fa-duotone fa-webhook" size="2xl" className="sbar-ico hvr-forward" /> */}
                    <FontAwesomeIcon icon="fa-duotone fa-webhook" size="2xl" className="sbar-ico hvr-wobble-horizontal" />
                </Button>

                {/* TOCONSIDER search bar on right? left? or find way to get button inside like placeholder? */}
                <Form inline>
                    <InputGroup>
                        <Form.Control type="text" placeholder="Search" />
                        {/* <Button className="sbar-btn hvr-bounce-in"> */}
                        {/* <Button className="sbar-btn hvr-pulse-grow"> */}
                        {/* <Button className="sbar-btn hvr-pulse"> */}
                        <Button className="sbar-btn hvr-grow-rotate">
                            {/* <Button className="sbar-btn hvr-bob"> */}
                            {/* <Button className="sbar-btn hvr-hang"> */}
                            {/* <Button className="sbar-btn hvr-wobble-top"> */}
                            {/* <Button className="sbar-btn hvr-wobble-skew"> */}
                            {/* <Button className="sbar-btn hvr-buzz-out"> */}
                            {/* <Button className="sbar-btn hvr-forward"> */}
                            {/* <Button className="sbar-btn"> */}
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
                        {/* yeah it's possible but probably want to 
                                  * try setting frame of ref / origin in inkscape
                                  * or illustrator */}
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
                    <Offcanvas.Body>
                        <FontAwesomeIcon icon="fa-duotone fa-atom" rotation={90} size="xl" style={{"--fa-primary-color": "#578be5", "--fa-secondary-color": "#143671", "width": "1.4rem"}} className="pr-2" />
                        <Link to="/" className="ml-0 hvr-underline-from-left">
                            Home
                        </Link>
                        <NavDropdown title={refIcon} id="nav-ref">
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
