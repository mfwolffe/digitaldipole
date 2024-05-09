import React from "react";
import Tab from "react-bootstrap/Tab";
import Form from 'react-bootstrap/Form';
import Card from "react-bootstrap/Card";
import Tabs from "react-bootstrap/Tabs";
import Button from "react-bootstrap/esm/Button";
import Accordion from "react-bootstrap/Accordion";
import CardBody from "react-bootstrap/esm/CardBody";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/bootstrap.min-dipole.css';
import '../App.css'
import { useState, useEffect } from 'react';
import data from './terms.json';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CardTitle } from "react-bootstrap";
// import MadLibAccordion from "./MadLibAccordion";

let madLibQuery = "";

const AIChipIcon = <FontAwesomeIcon fontSize={"6rem"} icon="fa-duotone fa-microchip-ai" className="m-auto pb-3" bounce />


const MemeGen = () => {
    const [inputValue, setInputValue] = useState('');
    const query = inputValue;

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
                          <Tab eventKey="MemeGen" className="calc-tab" title="Instructions">
                            <Card className="bg-transparent brdr-none m-auto w-55">
                              <CardBody className="bg-transparent brdr-none m-auto w-90">
                                <Card className="w-100 m-auto b-shadow">
                                  <CardTitle className="mt-3 off-white">AI Meme Generator</CardTitle>
                                  { AIChipIcon }
                                  <p className="text-center off-white mb-2">
                                    Powered by <a href="https://imgflip.com" target="_blank" className="hvr-underline-from-center api"><em>ImgFlip</em></a>
                                  </p>
                                  <Button className="ml-auto mr-auto mb-3 dp-button">Start!</Button>
                                </Card>
                              </CardBody>
                            </Card>
                          </Tab>

                            <Tab eventKey="raw" className="calc-tab" title="Raw Input" disabled>
                                {/* <h1>Pure Prompting!</h1> */}
                                <Card className="bg-transparent brdr-none gl-calc">
                                    <CardBody className="bg-transparent brdr-none m-auto gl- w-85">
                                        <Form.Floating className="m-auto">
                                            <Form.Control type="text" placeholder="" required onChange={handleInputChange} />
                                            <label className="calc-float-label">Prompt</label>
                                        </Form.Floating>
                                        <Button as="input" type="submit" value="Submit" onClick={handleSubmit} />{' '}
                                    </CardBody>
                                </Card>
                            </Tab>

                            <Tab eventKey="madlib" className="calc-tab" title="Mad Libs Input" disabled>
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