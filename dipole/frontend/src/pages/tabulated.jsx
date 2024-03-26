import React from "react";
import Card from "react-bootstrap/Card"
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink as Link } from "react-router-dom"
import NavDropdown from 'react-bootstrap/NavDropdown';

import { useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
// import ExampleCarouselImage from 'components/ExampleCarouselImage';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/bootstrap.min-dipole.css';
import '../App.css'
import '../styles/refs.css'

function ControlledCarousel() {
    const [index, setIndex] = useState(0);

    const handleSelect = (selectedIndex) => {
        setIndex(selectedIndex);
    };

    return (
        <Carousel activeIndex={index} onSelect={handleSelect}>
            <Carousel.Item>
                <Card>

                </Card>
                <Carousel.Caption>
                    <h3>First slide label</h3>
                    <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
                <Carousel.Caption>
                    <h3>Second slide label</h3>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
                <Carousel.Caption>
                    <h3>Third slide label</h3>
                    <p>
                        Praesent commodo cursus magna, vel scelerisque nisl consectetur.
                    </p>
                </Carousel.Caption>
            </Carousel.Item>
        </Carousel>
    );
}


const Tabulated = () => {

    return (
        <div className="landing-container mt-3">
            <div className="landing mt-0">
                <h1>References</h1>
                <h3>Tabulated Data</h3>
                <Card id="ref-default" className="mt-5">
                    <Card.Header>
                        <Nav variant="tabs" defaultActiveKey="#first" className="ref-default-tab">
                            <Nav.Item className="nav-item no-b-border">
                                <Nav.Link href="#first">Atom Carousel</Nav.Link>
                            </Nav.Item>
                            <Nav.Item className="nav-item no-b-border">
                                <Nav.Link href="#second">Filter and Sort</Nav.Link>
                            </Nav.Item>
                            <Nav.Item className="nav-item no-b-border">
                                <Nav.Link href="#third">
                                    Disabled
                                </Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Card.Header>
                    <Card.Body>
                        <Card.Title>Pick a Tab Above</Card.Title>
                        <Card.Text>
                            As you can see, there's nothing here
                        </Card.Text>
                    </Card.Body>
                </Card>
            </div>
        </div>
    );
}

export default Tabulated;