import React from "react";
import { useState } from 'react';

import Nav from 'react-bootstrap/Nav';
import Card from "react-bootstrap/Card";
import Popover from 'react-bootstrap/Popover';
import Accordion from 'react-bootstrap/Accordion';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';

import '../App.css'
import '../styles/refs.css'
import '../styles/bootstrap.min-dipole.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export function CalcCard () {
    return (
        <div className="landing-container mt-3">
            <div className="landing mt-0">
                <Card id="ref-default" className="mt-5">
                    <Card.Header>
                        <Nav variant="tabs" defaultActiveKey="#first" className="ref-default-tab">
                            <Nav.Item className="nav-item no-b-border">
                                <Nav.Link href="#first">Avogadro's Law</Nav.Link>
                            </Nav.Item>
                            <Nav.Item className="nav-item no-b-border">
                                <Nav.Link href="#third">Boyle's Law</Nav.Link>
                            </Nav.Item>
                            <Nav.Item className="nav-item no-b-border">
                                <Nav.Link href="#second">Charles' Law</Nav.Link>
                            </Nav.Item>
                            <Nav.Item className="nav-item no-b-border">
                                <Nav.Link href="#second">Gay-Lussac's Law</Nav.Link>
                            </Nav.Item>
                            <Nav.Item className="nav-item no-b-border">
                                <Nav.Link href="#second">Combined Gas Law</Nav.Link>
                            </Nav.Item>
                            <Nav.Item className="nav-item no-b-border">
                                <Nav.Link href="#second">Ideal Gas Law</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Card.Header>
                    <Card.Body>
                        <Card.Title>Gas Laws (Ideal)</Card.Title>
                        <Card.Text>
                            Pick a calculator from the tabs above
                        </Card.Text>
                    </Card.Body>
                </Card>
            </div>
        </div>
    );
}
