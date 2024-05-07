import React from "react";

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import { useState } from 'react';
import Collapse from 'react-bootstrap/Collapse';

import NavItem from "react-bootstrap/esm/NavItem";
import { NavLink as Link } from "react-router-dom";
import NavDropdown from 'react-bootstrap/NavDropdown';

import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';

import { all } from '@awesome.me/kit-a655910996/icons'
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// the FA ico's with additional customization don't play well with SVG so png instead
import userIcon from '../assets/png/user-astronaut-light.png';
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

const usrIcon = <FontAwesomeIcon icon="fa-duotone fa-user-astronaut" size="2xl" className="usr-ico usr-coral" />;

const icoStyle = {
    fontSize: "1.7rem"
};

// TODO: give the two components below better names
const refIcon = (
    <>
        <FontAwesomeIcon icon="fa-duotone fa-book-bookmark" size="xl" style={{ "--fa-secondary-color": "#578be5", "--fa-primary-color": "#143671", "width": "1.4rem" }} className="pr-2" />
        <span class=".text-white" className=".text-white hvr-underline-from-left">References</span>
    </>
);

const calcIcon = (
    <>
        <FontAwesomeIcon icon="fa-duotone fa-calculator" size="xl" style={{ "--fa-secondary-color": "#578be5", "--fa-primary-color": "#143671", "width": "1.4rem" }} className="pr-2" />
        <span className="hvr-underline-from-left">Calculators</span>
    </>
)

// TODO see documentation:
// https://react-bootstrap.netlify.app/docs/components/overlays#popovers
// to implement close on click outside + more granular styling across 
// bs prefixed classes
const SearchTip = (
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

export function SearchBar () {
    return (
        <Form inline>
            <InputGroup>
                <OverlayTrigger trigger="focus" placement="bottom" overlay={SearchTip} delay="2000">
                    <Form.Control type="text" placeholder="Search" id="hdr-search"/>
                </OverlayTrigger>
                <Button className="sbar-btn hvr-grow-rotate">
                    <FontAwesomeIcon icon="fa-duotone fa-magnifying-glass" style={icoStyle} />
                </Button>
            </InputGroup>
        </Form>
    );
}

export function UserDrop () {
    return (
        <NavDropdown title={usrIcon} id="basic-nav-dropdown" drop="down" className="usr-drp">
            <NavDropdown.Header>
                <img src={userIcon} width="24px" className="pr-2" /> <b>{username}</b>
            </NavDropdown.Header>
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
    );
}

export function OffCDropRef () {

    const [open, setOpen] = useState(false);

    return (
        <NavItem>
            <Button onClick={() => setOpen(!open)} aria-controls="dropdown" aria-expanded={open} id="nav-ref"  className="pl-0" variant="link">
                {refIcon}
            </Button>
            <Collapse in={open}>
                <div id="dropdown">
                    <ul>
                        <li>
                            <div eventKey="ref-1" className="text-wrap pl-0 hvr-underline-from-left">
                                <Link to="/tabulated" className="pl-0 ml-0">
                                    Tabulated Data
                                </Link>
                            </div>
                        </li>
                        <li>
                            <div eventKey="ref-2" className="text-wrap pl-0 hvr-underline-from-left">
                                Periodic Tables
                            </div>
                        </li>
                        <li>
                            <div eventKey="ref-3" className="text-wrap pl-0 hvr-underline-from-left">
                                Conversion Factors And Fundamental Constants
                            </div>
                        </li>
                        <li>
                            <div eventKey="ref-4" className="text-wrap pl-0 hvr-underline-from-left">
                                Common Equations
                            </div>
                        </li>
                    </ul>
                </div>
            </Collapse>

            {/*old version of the side bar dropdowns. replaced so that all items move down when buttons are pressed */}
            {/* <NavDropdown title={refIcon} id="nav-ref" className="pl-0">
                <ul>
                    <li>
                        <NavDropdown.Item eventKey="ref-1" className="text-wrap pl-0">
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
    </NavDropdown> */}
        </NavItem>
    );
}

export function OffCDropCalc () {

    const [open, setOpen] = useState(false);

    return (
        <NavItem>

            <Button onClick={() => setOpen(!open)} aria-controls="dropdown" aria-expanded={open} id="nav-ref" className="pl-0 pb-2" variant = "link">
                {calcIcon}
            </Button>
            <Collapse in={open}>
                <div id="dropdown">
                <ul>
                    <li>
                        <div  eventKey="ref-1" className="text-wrap pl-0 hvr-underline-from-left">
                            <Link to="/calculators/GasLaws" className="pl-0 ml-0">
                                Gas Laws (Ideal)
                            </Link>
                        </div>
                    </li>
                    <li>
                        <div eventKey="ref-2" className="text-wrap pl-0 hvr-underline-from-left">
                            <Link to="/calculators/thermo" className="pl-0 ml-0">
                                Thermodynamics
                            </Link>
                        </div>
                    </li>
                    <li>
                        <div eventKey="ref-3" className="text-wrap pl-0 hvr-underline-from-left">
                            Unit Conversions
                        </div>
                    </li>
                    <li>
                        <div eventKey="ref-4" className="text-wrap pl-0 hvr-underline-from-left">
                            Solutions & Titrations
                        </div>
                        
                    </li>
                </ul>
                </div>
            </Collapse>

            {/*old version of the side bar dropdowns. replaced so that all items move down when buttons are pressed */}
            {/*<NavDropdown title={calcIcon} id="nav-ref" className="pl-0 pb-2">
                <ul>
                    <li>
                        <NavDropdown.Item eventKey="ref-1" className="text-wrap pl-0">
                            <Link to="/calculators/GasLaws" className="pl-0 ml-0">
                                Gas Laws (Ideal)
                            </Link>
                        </NavDropdown.Item>
                    </li>
                    <li>
                        <NavDropdown.Item eventKey="ref-2" className="text-wrap pl-0 hvr-underline-from-left">
                            <Link to="/calculators/thermo" className="pl-0 ml-0">
                              Thermodynamics
                            </Link>
                        </NavDropdown.Item>
                    </li>
                    <li>
                        <NavDropdown.Item eventKey="ref-3" className="text-wrap pl-0 hvr-underline-from-left">
                            Unit Conversions
                        </NavDropdown.Item>
                    </li>
                    <li>
                        <NavDropdown.Item eventKey="ref-4" className="text-wrap pl-0 hvr-underline-from-left">
                            Solutions & Titrations
                        </NavDropdown.Item>
                    </li>
                </ul>
        </NavDropdown> */}
        </NavItem>
    );



}
