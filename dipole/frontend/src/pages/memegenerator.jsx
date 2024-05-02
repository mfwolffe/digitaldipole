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

const MemeGen = () => {
    

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
                            <Tab eventKey="madlib" className="calc-tab" title="Mad Libs Input">
                                <p>Madlib Mode! UNFINISHED</p>
                            </Tab>
                            <Tab eventKey="raw" className="calc-tab" title="Raw Input">
                                <h1>Pure Prompting!</h1>
                                <Card className="bg-transparent brdr-none gl-calc">
                                    <CardBody className="bg-transparent brdr-none m-auto gl- w-85">
                                        <Form.Floating className="m-auto">
                                            <Form.Control type="text" placeholder="" required />
                                            <label className="calc-float-label">Prompt</label>
                                        </Form.Floating>
                                        <Button as="input" type="submit" value="Submit" />{' '}
                                    </CardBody>
                                </Card>
                            </Tab>
                        </Tabs>
                    </Card>
                </div>
            </div>
        </>
    );
}

export default MemeGen;