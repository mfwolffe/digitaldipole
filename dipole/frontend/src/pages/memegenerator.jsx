import React from "react";
import { useState, useEffect } from 'react';
import { NavLink as Link } from "react-router-dom";

import Tab from "react-bootstrap/Tab";
import Form from 'react-bootstrap/Form';
import Card from "react-bootstrap/Card";
import Tabs from "react-bootstrap/Tabs";
import Modal from 'react-bootstrap/Modal';
import { CardTitle } from "react-bootstrap";
import Button from "react-bootstrap/esm/Button";
import Dropdown from 'react-bootstrap/Dropdown';
import Accordion from "react-bootstrap/Accordion";
import CardBody from "react-bootstrap/esm/CardBody";
import DropdownButton from 'react-bootstrap/DropdownButton';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/bootstrap.min-dipole.css';
import '../App.css'

import data from './terms.json';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


// import MadLibAccordion from "./MadLibAccordion";

let madLibQuery = "";

// const AIChipIcon = <FontAwesomeIcon fontSize={"6rem"} icon="fa-duotone fa-microchip-ai" className="m-auto pb-3" bounce />
const AIChipIcon = <FontAwesomeIcon fontSize={"6rem"} icon="fa-duotone fa-microchip-ai" className="m-auto pb-3" shake style={{"--fa-animation-duration": "2s",}}/>
const AIBotIcon  = <FontAwesomeIcon fontSize={"7rem"} icon="fa-duotone fa-message-bot" className="m-auto" bounce />
const RadiateIcon = <FontAwesomeIcon fontSize={"5.5rem"} icon="fa-thin fa-radiation" className="m-auto" spin />

const MemeGen = () => {
    const [show, setShow] = useState(false);
    const [inputValue, setInputValue] = useState('');

    const query = inputValue;

    const handleShow  = () => setShow (true);
    const handleClose = () => setShow (false);

    const handleSubmit = () => {
        requestMeme(query);
    }

    const handleInputChange = (event) => {
        setInputValue(event.target.value)
    }

    return (
      <>
        <div className="landing-container mt-3">
          <div className="landing mt-0">
            <Card className="mt-5 m-auto meme-card" id="ref-default">
              <Tabs
                defaultActiveKey="MemeGen"
                id="uncontrolled-tab-example"
                className="mb-3 mt-1 calc-tabs"
              >
                <Tab
                  eventKey="MemeGen"
                  className="calc-tab"
                  title="Instructions"
                >
                  <Card className="bg-transparent brdr-none m-auto w-45">
                    <CardBody className="bg-transparent brdr-none m-auto w-90">
                      <Card className="w-100 m-auto b-shadow">
                        <CardTitle className="mt-4 off-white">
                          AI Meme Generator
                        </CardTitle>
                        {AIChipIcon}
                        <p className="text-center off-white mb-2">
                          Powered by{" "}
                          <a
                            href="https://imgflip.com"
                            target="_blank"
                            className="hvr-underline-from-center api"
                          >
                            <em>ImgFlip</em>
                          </a>
                        </p>
                        <Button
                          className="ml-auto mr-auto mt-2 mb-4 dp-button"
                          onClick={handleShow}
                        >
                          Start!
                        </Button>
                        <Modal
                          show={show}
                          onHide={handleClose}
                          backdrop="static"
                          keyboard={false}
                        >
                          <Modal.Header closeButton className="modal-bg">
                            <Modal.Title>Warning!</Modal.Title>
                          </Modal.Header>
                          <Modal.Body className="modal-bg">
                            <div className="d-flex">{RadiateIcon}</div>

                            <p>
                              <em>Per the imgflip API:</em>
                            </p>

                            <div className="code-warn p-1">
                              <code>
                                The AI is trained on all public user-generated
                                content, so it is NOT censored or curated in
                                anyway, and therefore may contain vulgarities or
                                other potentially unsuitable content. If this
                                doesn't fit your use case, you may want to
                                filter the output based on language.
                              </code>
                            </div>
                          </Modal.Body>
                          <Modal.Footer className="modal-bg d-flex flex-row justify-content-end align-items-start">
                            <Link to="/">
                              <Button
                                className="mb-3 dp-button"
                                onClick={handleClose}
                              >
                                Return Home
                              </Button>
                            </Link>
                            <Button
                              className="mb-3 dp-button"
                              onClick={handleClose}
                            >
                              Proceed
                            </Button>
                          </Modal.Footer>
                        </Modal>
                      </Card>
                    </CardBody>
                  </Card>
                </Tab>

                <Tab
                  eventKey="raw"
                  className="calc-tab"
                  title="Raw Input"
                  disabled
                >
                  {/* <h1>Pure Prompting!</h1> */}
                  <Card className="bg-transparent brdr-none gl-calc">
                    <CardBody className="bg-transparent brdr-none m-auto gl- w-85">
                      <Form.Floating className="m-auto">
                        <Form.Control
                          type="text"
                          placeholder=""
                          required
                          onChange={handleInputChange}
                        />
                        <label className="calc-float-label">Prompt</label>
                      </Form.Floating>
                      <Button
                        as="input"
                        type="submit"
                        value="Submit"
                        onClick={handleSubmit}
                      />{" "}
                    </CardBody>
                  </Card>
                </Tab>

                <Tab
                  eventKey="madlib"
                  className="calc-tab"
                  title="Mad Libs Input"
                  disabled
                >
                  <h1>Madlib Mode!</h1>
                  <MadLibAccordion />

                  <MadLibQueryForm />
                </Tab>
              </Tabs>

              <img id="memecanvas" src="" className="m-auto w-85"></img>
            </Card>
          </div>
        </div>
      </>
    );
}

function MadLibQueryForm() {
    return (
        <Card className="w-100">
            <Card.Body>
                <Card.Text>
                    <Button active><p id="madlibprompt">Add Words!</p></Button>
                </Card.Text>
                <Button variant="primary" onClick={()=>requestMeme(madLibQuery)}>Generate!</Button>
            </Card.Body>
        </Card>
    );
}


async function requestMeme(queryString) {
    queryString = JSON.stringify(queryString)
    const memeFrame = document.getElementById('meme')
    const memeCanvas = document.getElementById('memecanvas')

    if (queryString.length === 0) {
        queryString = "digital dipole"
    }

    memeFrame.innerText = "Making Masterpiece..."

    const response = await fetch('/api/memegen/' + queryString);
    const meme = await response.json();
    console.log(meme)
    const url = meme.data.url
    memeCanvas.src = url

    memeFrame.innerText = "Magnificent Meme!"

}



function MadLibAccordion() {
    return (
        <Accordion defaultActiveKey="0" className="w-90 ml-auto mr-auto mb-4">
            <Accordion.Item eventKey="0">
                <Accordion.Header>Subject</Accordion.Header>
                <DropdownComponent category={"subject"} />
            </Accordion.Item>
            <Accordion.Item eventKey="1">
                <Accordion.Header>Verb</Accordion.Header>
                <DropdownComponent category={"verb"} />
            </Accordion.Item>
            <Accordion.Item eventKey="2">
                <Accordion.Header>Object</Accordion.Header>
                <DropdownComponent category={"object"} />
            </Accordion.Item>
            <Accordion.Item eventKey="3">
                <Accordion.Header>Preposition</Accordion.Header>
                <DropdownComponent category={"preposition"} />
            </Accordion.Item>
            <Accordion.Item eventKey="4">
                <Accordion.Header>Phrase</Accordion.Header>
                <DropdownComponent category={"phrase"} />
            </Accordion.Item>
        </Accordion>
    );
}



const DropdownComponent = ({ category }) => {
    const [dropdownItems, setDropdownItems] = useState([]);
    category = JSON.stringify(category);

    useEffect(() => {
        let items;
        switch (category) {
            case JSON.stringify("subject"):
                items = data.terms.subject.map((term, index) => (
                    <Dropdown.Item key={index} eventKey={term} onClick={() => appendMadLibQuery(term)}>{term}</Dropdown.Item>
                ));
                break;
            case JSON.stringify("verb"):
                items = data.terms.verb.map((term, index) => (
                    <Dropdown.Item key={index} eventKey={term} onClick={() => appendMadLibQuery(term)}>{term}</Dropdown.Item>
                ));
                break;
            case JSON.stringify("object"):
                items = data.terms.object.map((term, index) => (
                    <Dropdown.Item key={index} eventKey={term} onClick={() => appendMadLibQuery(term)}>{term}</Dropdown.Item>
                ));
                break;
            case JSON.stringify("preposition"):
                items = data.terms.preposition.map((term, index) => (
                    <Dropdown.Item key={index} eventKey={term} onClick={() => appendMadLibQuery(term)}>{term}</Dropdown.Item>
                ));
                break;
            case JSON.stringify("phrase"):
                items = data.terms.phrase.map((term, index) => (
                    <Dropdown.Item key={index} eventKey={term} onClick={() => appendMadLibQuery(term)}>{term}</Dropdown.Item>
                ));
                break;
            default:
                console.log(category, "is being default")
                items = data.terms.object.map((term, index) => (
                    <Dropdown.Item key={index} eventKey={term}>{term}</Dropdown.Item>
                ));
                break;

        }

        setDropdownItems(items);
    }, []);

    return (
        <Accordion.Body>
            <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                    <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Select a term&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    {dropdownItems}
                </Dropdown.Menu>
            </Dropdown>
        </Accordion.Body>
    );
};

function appendMadLibQuery(input) {
    input = JSON.stringify(input);
    madLibQuery += input + " ";

    madLibQuery = madLibQuery.replace(/['"]+/g, '')

    console.log(madLibQuery)

    const madlibprompt = document.getElementById('madlibprompt')

    madlibprompt.innerText = madLibQuery

}

export default MemeGen;