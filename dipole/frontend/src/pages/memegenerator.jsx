import React from "react";
import Tab from "react-bootstrap/Tab";
import Form from 'react-bootstrap/Form';
import Card from "react-bootstrap/Card";
import Tabs from "react-bootstrap/Tabs";
import Button from "react-bootstrap/esm/Button";
import Accordion from "react-bootstrap/Accordion";
import CardBody from "react-bootstrap/esm/CardBody";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/bootstrap.min-dipole.css';
import '../App.css'
import { useState, useEffect } from 'react';


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
            <h1>AI Meme Generator</h1>
            <div className="landing-container mt-3">
                <div className="landing mt-0">
                    <Card className="mt-5 m-auto gl-calc" id="ref-default">
                        <Tabs
                            defaultActiveKey="madlib"
                            id="uncontrolled-tab-example"
                            className="mb-3 mt-1 calc-tabs"
                        >

                            <Tab eventKey="raw" className="calc-tab" title="Raw Input">
                                <h1>Pure Prompting!</h1>
                                <Card className="bg-transparent brdr-none gl-calc">
                                    <CardBody className="bg-transparent brdr-none m-auto gl- w-85">
                                        <Form.Floating className="m-auto">
                                            <Form.Control type="text" placeholder="" required onChange={handleInputChange}/>
                                            <label className="calc-float-label">Prompt</label>
                                        </Form.Floating>
                                        <Button as="input" type="submit" value="Submit" onClick={handleSubmit} />{' '}
                                    </CardBody>
                                </Card>
                            </Tab>

                            <Tab eventKey="madlib" className="calc-tab" title="Mad Libs Input">
                                <p>Madlib Mode! UNFINISHED</p>
                            </Tab>
                        </Tabs>

                        <p id="meme">Generate a meme...</p>
                        <img id="memecanvas" src="" className="m-auto w-85"></img>
                    </Card>
                </div>
            </div>
        </>
    );
}


async function requestMeme(queryString) {
    const memeFrame = document.getElementById('meme')
    const memeCanvas = document.getElementById('memecanvas')
    memeFrame.innerText = "Making Masterpiece..."


    const response = await fetch('/api/memegen/' + queryString);
    const meme = await response.json();
    const url = meme.data.url



    memeCanvas.src = url

    memeFrame.innerText = "Magnificent Meme!"

}

export default MemeGen;