import React from "react";
import { useState } from 'react';

import Tab from "react-bootstrap/Tab";
import Card from "react-bootstrap/Card";
import Tabs from "react-bootstrap/Tabs";
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Popover from 'react-bootstrap/Popover';
import Carousel from 'react-bootstrap/Carousel';
import InputGroup from 'react-bootstrap/InputGroup';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';

// import Nav from 'react-bootstrap/Nav';
// import Navbar from 'react-bootstrap/Navbar';
// import { NavLink as Link } from "react-router-dom"
// import NavDropdown from 'react-bootstrap/NavDropdown';

import data from '../data/PubChemElements_all.json'
import { all } from '@awesome.me/kit-a655910996/icons'
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

library.add(...all);

import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/bootstrap.min-dipole.css';
import '../App.css'
import '../styles/refs.css'

const colorTable = {
  "Nonmetal"              : "#F6BE9A",
  "Noble gas"             : "#FCAA67",
  "Alkali metal"          : "#B0413E",
  "Alkaline earth metal"  : "#30638E",
  "Metalloid"             : "#4DAA57",
  "Halogen"               : "#A39594",
  "Transition metal"      : "#548687",
  "Post-transition metal" : "#B5DDA4",
  "Lanthanide"            : "#B4C5E4",
  "Actinide"              : "#94ECBE"
}

function buildAtomJSON() {
  const atomData = [];
  data["Table"]["Row"].forEach(cell => {
    const atom = {};
    cell.Cell.forEach((property, index) => {
        atom[data["Table"]["Columns"]["Column"][index]] = property;
    })
    atomData.push(atom);
  });

  return atomData;
}

function AtomSlide(atomData) {
  return (
    <Carousel.Item id={atomData['Name']}>
          { AtomTable(atomData) }
    </Carousel.Item>
  )
}

function AtomTable(atomData) {
  const tableStyle = {"background-color": colorTable[atomData['GroupBlock']]}

  function RowBuilder (atom) {
    const rows = []
    for (const [key, val] of Object.entries(atom)) {
      rows.push((
        <tr>
          <td className="text-left pl-2">{ key }</td>
          <td className="text-center pr-2">{ val }</td>
        </tr>
      ))
    }
    return rows;
  }

  // TODO maybe just have the table header be the color for the PT group
  return (
      <Table className="w-80 ml-auto mr-auto mt-2 carousel-table b-shadow" striped hover style={{"backgroundColor": colorTable[atomData['GroupBlock']]}}>
        <thead>
          <tr>
            <th colSpan={2}>{ atomData['Name'] }</th>
          </tr>
          <tr>
            <th className="text-left pl-4">Property</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          { RowBuilder(atomData) }
        </tbody>
      </Table>
  )
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
    const atoms = buildAtomJSON();
    const [index, setIndex] = useState(0);

    const handleSelect = (selectedIndex) => {
        setIndex(selectedIndex);
    };

    console.log(data);

    const slides = []

    atoms.forEach((atom) => {
      slides.push(AtomSlide(atom));
    })

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

                        <Card className="bg-transparent brdr-none ml-auto mr-auto mt-2 w-80 h-100">
                          <Carousel activeIndex={index} fade interval={null} onSelect={handleSelect} className="m-auto w-100">
                            { slides }
                          </Carousel>
                        </Card>

                    </Tab>
                  </Tabs>
                </Card>
            </div>
        </div>
    );
}

export default Tabulated;