import React from "react";
import Card from "react-bootstrap/Card"
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';

import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink as Link } from "react-router-dom"
import NavDropdown from 'react-bootstrap/NavDropdown';

import { all } from '@awesome.me/kit-a655910996/icons'
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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

const CarouselTip = (
  <Popover id="carousel-tip">
    <Popover.Body>
      <p className="lead mb-0">Jump to an element by entering:</p>
        <ul className="pb-0 mb-0">
            <li>Its atomic number</li>
            <li>Its name (US English)</li>
            <li>Or its element symbol</li>
        </ul>
    </Popover.Body>
</Popover>
)

const Tabulated = () => {

    return (
        <div className="landing-container mt-3">
            <div className="landing mt-0">
                <Card id="ref-default" className="mt-5 m-auto ">
                  <Tabs
                  defaultActiveKey="AtomCarousel"
                  id="uncontrolled-tab-example"
                  className="mb-3 mt-1 calc-tabs dsb-tabs">
                    <Tab
                      eventKey="AtomCarousel"
                      className="calc-tab"
                      title="Atom Carousel">
                        <div className="d-flex justify-content-between w-99 m-auto">
                          <p className="lead pl-2">Atom Carousel</p>
                          <Form inline>
                            <InputGroup>
                                <OverlayTrigger trigger="focus" overlay={CarouselTip} placement="bottom" delay="2000">
                                    <Form.Control type="text" placeholder="Jump-to" id="jump-to"/>
                                </OverlayTrigger>
                                <Button className="sbar-btn hvr-grow-rotate">
                                    <FontAwesomeIcon icon="fa-duotone fa-magnifying-glass" fontSize={"1.4rem"}/>
                                </Button>
                            </InputGroup>
                          </Form>
                        </div>

                    </Tab>
                  </Tabs>
                </Card>
            </div>
        </div>
    );
}

export default Tabulated;