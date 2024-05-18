import React from "react";
import { useState } from 'react';

import Tab from "react-bootstrap/Tab";
import Card from "react-bootstrap/Card";
import Tabs from "react-bootstrap/Tabs";
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
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

const CircleX = <FontAwesomeIcon className="pr-3" icon="fa-duotone fa-circle-x" style={{"--fa-primary-color": "#e22828", "--fa-secondary-color": "#e22828",}} />;
const CircleCheck = <FontAwesomeIcon className="pr-3" icon="fa-duotone fa-circle-check" style={{"--fa-primary-color": "#69d510", "--fa-secondary-color": "#69d510",}} />;
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

  return (
      <Table className="w-80 ml-auto mr-auto mt-2 carousel-table b-shadow" striped hover style={{"backgroundColor": colorTable[atomData['GroupBlock']]}}>
        <thead>
          <tr>
            <th colSpan={2} style={{"backgroundColor": colorTable[atomData['GroupBlock']], "color": "white",}}>{ atomData['Name'] }</th>
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

    const [show, setShow]   = useState(false);
    const [index, setIndex] = useState(0);

    const handleShow = () => {
      setShow(true);
    }

    const handleClose = () => {
      setShow(false);
    }

    const handleSelect = (selectedIndex) => {
        setIndex(selectedIndex);
    };

    const slides = []
    atoms.forEach((atom) => {
      slides.push(AtomSlide(atom));
    })

    function jumpTo (eventKey) {
      eventKey.preventDefault();

      const query = eventKey.target[0].value;
      let n = 0;

      if (!isNaN((n = Number(query)))) {
        n = Math.floor(n);

        if (n < 1 || n > 118) {
          handleShow();
          return;
        }
        setIndex(n - 1);

        return;
      }

      const found = atoms.find((atom) => isMatch(atom));

      if (!found) {
        handleShow()
        console.log("No match for user query");
        return;
      }

      const foundIndex = found.AtomicNumber - 1;
      setIndex(foundIndex);

      function isMatch(element) {
        return element.Name.toLowerCase() === query.toLowerCase() || element.Symbol === query;
      }
    }

    return (
        <div className="landing-container mt-3">
            <div className="landing mt-0">
                <Card id="ref-default" className="mt-5 m-auto ref-card">
                  <Tabs
                  defaultActiveKey="AtomCarousel"
                  id="uncontrolled-tab-example"
                  className="mb-3 mt-1 calc-tabs dsb-tabs">
                    <Tab
                      eventKey="AtomCarousel"
                      className="calc-tab"
                      title="Atom Carousel">
                        <div className="d-flex justify-content-between align-items-baseline w-99 m-auto">
                            <p className="lead pl-2 mb-0">Atom Carousel</p>
                          <Form inline onSubmit={(e) => jumpTo(e)}>
                            <InputGroup>
                                <OverlayTrigger trigger="focus" overlay={CarouselTip} placement="bottom" delay="2000">
                                    <Form.Control type="text" placeholder="Jump-to" id="jump-to"/>
                                </OverlayTrigger>
                                <Button type="submit" className="sbar-btn hvr-grow-rotate" >
                                    <FontAwesomeIcon icon="fa-duotone fa-magnifying-glass" fontSize={"1.4rem"}/>
                                </Button>
                            </InputGroup>
                          </Form>
                        </div>

                        <Card className="bg-transparent brdr-none ml-auto mr-auto mt-2 w-95 h-100">
                          <Carousel activeIndex={index} fade interval={null} onSelect={handleSelect} className="m-auto w-100">
                            { slides }
                          </Carousel>
                        </Card>
                        <Modal                           
                          show={show}
                          onHide={handleClose}
                          backdrop="static"
                          keyboard={false}>
                          <Modal.Header closeButton className="modal-bg">
                            <Modal.Title>Query found no match</Modal.Title>
                          </Modal.Header>
                          <Modal.Body className="modal-bg w-100">
                            <p>Queries must either be an atom's name in US English, atomic number, or symbol on the periodic table</p>
                            <p>Examples:</p>
                            <div className="d-flex">
                              <Table className="w-70 m-auto">
                                <thead>
                                  <tr>
                                    <th scope="col">Query</th>
                                    <th scope="col" class="text-right">Validity</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td><em>hydrogen</em></td>
                                    <td class="text-right">{ CircleCheck }</td>
                                  </tr>
                                  <tr>
                                    <td><em>sulphur</em></td>
                                    <td class="text-right">{ CircleX }</td>
                                  </tr>
                                  <tr>
                                    <td><em>81</em></td>
                                    <td class="text-right">{ CircleCheck }</td>
                                  </tr>
                                  <tr>
                                    <td><em>128</em></td>
                                    <td class="text-right">{ CircleX }</td>
                                  </tr>
                                  <tr>
                                    <td><em>Ti</em></td>
                                    <td class="text-right">{ CircleCheck }</td>
                                  </tr>
                                  <tr>
                                    <td><em>Zz</em></td>
                                    <td class="text-right">{ CircleX }</td>
                                  </tr>
                                </tbody>
                              </Table>
                            </div>
                          </Modal.Body>
                          <Modal.Footer className="modal-bg d-flex flex-row justify-content-end align-items-start">
                            <Button
                              className="mb-2 mt-2 dp-button"
                              onClick={handleClose}>
                              Back
                            </Button>
                          </Modal.Footer>
                        </Modal>
                    </Tab>
                  </Tabs>
                </Card>
            </div>
        </div>
    );
}

export default Tabulated;