import React from "react";
import { useState, useEffect } from 'react';

import Nav from 'react-bootstrap/Nav';
import Card from "react-bootstrap/Card";
import Popover from 'react-bootstrap/Popover';
import Accordion from 'react-bootstrap/Accordion';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';

import '../../App.css';
import '../../styles/refs.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/bootstrap.min-dipole.css';

const GenInfo = (
    <>
        <Accordion defaultActiveKey="0" className="w-85 mb-2">
            <Accordion.Item eventKey="0">
                <Accordion.Header>Gas Laws</Accordion.Header>
                <Accordion.Body>
                    <p class="text-left">
                        Gas Laws are models which describe the relationships between pressure, volume, temperature,
                        and amount of gas for a given sample of gas. The first such law was formulated in the late 17th century
                        by English scientist Robert Boyle. These discoveries were corroborated, and understood further as
                        kinetic molecular theory was formulating.
                    </p>
                    <p class="text-left">
                        By the end of the 19th century, four other laws describing relationships between gas properties were formulated.
                        They were Boyle's Law, Avogadro's Law, Charles' Law, and Gay-Lussac's Law. These laws however make the assumption
                        the gases being modeled are <em>ideal</em>.
                    </p>
                </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
                <Accordion.Header><em>Ideal Gases</em></Accordion.Header>
                <Accordion.Body>
                    <p class="text-left">
                        Ideal gases, in contrast to <em>real gases</em>, are theoretical constructs, yet are nonetheless useful in
                        describing gas behavior at the macroscopic level. Many real gases behave similarly to ideal gases if they are 
                        held in fairly standard conditions of temperature and pressure. An ideal gas is formally defined as one in which 
                        the following conditions hold:
                    </p>
                    
                    <dl class="text-left">
                        <dt>All collisions are perfectly elastic</dt>
                        <dd></dd>

                        <dt>Molecules are not subject to standard intermolecular forces</dt>
                        <dd></dd>

                        <dt>Molecules themselves have negligible volume</dt>
                        <dd></dd>

                        <dt>The motion of particles is nondeterministic and adheres to Newton's Laws</dt>
                        <dd></dd>
                    </dl>
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    </>
)

// [x] TOASK async???
// natülich
const CalcCard = () => {
    const [thing, setThing] = useState("");

    useEffect(() => {
        const getYellow = async () => {
            fetch("/api/yellow")
                .then(response => response.json())
                .then(data => {
                    console.log(data)
                    setThing(data);
            }).catch(error => console.log(error));
        }
        getYellow();
    }, []);

    return (
        <div className="landing-container mt-3">
            <div className="landing mt-0">
                <Card id="ref-default" className="mt-5 m-auto gl-calc">
                    <Card.Header>
                        <Nav variant="tabs" defaultActiveKey="#first" className="ref-default-tab">
                            <Nav.Item className="nav-item no-b-border">
                                <Nav.Link href="#first">Info</Nav.Link>
                            </Nav.Item>
                            <Nav.Item className="nav-item no-b-border">
                                <Nav.Link href="#second">Avogadro's Law</Nav.Link>
                            </Nav.Item>
                            <Nav.Item className="nav-item no-b-border">
                                <Nav.Link href="#third">Boyle's Law</Nav.Link>
                            </Nav.Item>
                            <Nav.Item className="nav-item no-b-border">
                                <Nav.Link href="#fourth">Charles' Law</Nav.Link>
                            </Nav.Item>
                            <Nav.Item className="nav-item no-b-border">
                                <Nav.Link href="#fifth">Gay-Lussac's Law</Nav.Link>
                            </Nav.Item>
                            <Nav.Item className="nav-item no-b-border">
                                <Nav.Link href="#sixth">Combined Gas Law</Nav.Link>
                            </Nav.Item>
                            <Nav.Item className="nav-item no-b-border">
                                <Nav.Link href="#seventh">Ideal Gas Law</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Card.Header>
                    <Card.Body>
                        <Card.Title>(Ideal) Gas Laws</Card.Title>
                        {/* <Card.Text>
                            { thing }
                        </Card.Text> */}

                        <div className="d-flex justify-content-center">
                            { GenInfo }
                        </div>
                    </Card.Body>
                </Card>
            </div>
        </div>
    );
}


export default CalcCard;