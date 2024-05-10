import React from "react";
import { useState, useEffect } from 'react';
import { NavLink as Link } from "react-router-dom";

import Tab from "react-bootstrap/Tab";
import Form from 'react-bootstrap/Form';
import Card from "react-bootstrap/Card";
import Tabs from "react-bootstrap/Tabs";
import Modal from 'react-bootstrap/Modal';
import Button from "react-bootstrap/esm/Button";
import Accordion from "react-bootstrap/Accordion";
import CardBody from "react-bootstrap/esm/CardBody";
import { CardTitle, FormSelect } from "react-bootstrap";

// import Dropdown from 'react-bootstrap/Dropdown';
// import DropdownButton from 'react-bootstrap/DropdownButton';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/bootstrap.min-dipole.css';
import '../App.css'

import data from './terms.json';
import { saveAs } from "file-saver";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


const RadiateIcon = <FontAwesomeIcon fontSize={"5.5rem"} icon="fa-thin fa-radiation" className="m-auto" spin />
const BellAlert = <FontAwesomeIcon icon="fa-duotone fa-bell-ring" fontSize={"4rem"} className="m-auto" shake />
const Spinner = <FontAwesomeIcon icon="fa-duotone fa-loader" fontSize={"5.5rem"} className="m-auto" spinPulse />
const AIBotIcon  = <FontAwesomeIcon fontSize={"7rem"} icon="fa-duotone fa-message-bot" className="m-auto" bounce />
const SpinnerThird = <FontAwesomeIcon icon="fa-duotone fa-spinner-third" fontSize={"5.5rem"} className="m-auto" spin />
// const AIChipIcon = <FontAwesomeIcon fontSize={"6rem"} icon="fa-duotone fa-microchip-ai" className="m-auto pb-3" bounce />
const FailedRequest = <FontAwesomeIcon icon="fa-duotone fa-skull-cow" fontSize={"5.5rem"} className="m-auto" flip style={{"--fa-animation-duration": "3s",}} />
const AIChipIcon = <FontAwesomeIcon fontSize={"6rem"} icon="fa-duotone fa-microchip-ai" className="m-auto pb-3" shake style={{"--fa-animation-duration": "2s",}}/>

const MemeGen = () => {

    const [lock, setLock]     = useState(true);
    const [show, setShow]     = useState(false);
    const [shown, setShown]   = useState(false);
    
    const [imgurl, setImgUrl] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [respModal, setRespModal] = useState(false);
    const [activeTab, setActiveTab] = useState("MemeGen");

    const [verb, setVerb] = useState('');
    const [prep, setPrep] = useState('');
    const [object, setObject] = useState('');
    const [phrase, setPhrase] = useState('');
    const [active, setActive] = useState('0');
    const [subject, setSubject] = useState('');


    useEffect (() => {
      const mlStr = `${subject} ${verb} ${object} ${prep} ${phrase}`;
      setInputValue(mlStr);
      console.log("Post setter: ", inputValue);
    }, [subject, verb, object, phrase, prep])

    const downloadImage = () => {
      const dlDate = new Date();
      const timeStr = dlDate.toUTCString();
      saveAs(imgurl, `meme-${timeStr}.jpg`);
    }

    const MemeLoading = (
      <>
        <p className="lead text-center mb-1">Your prompt:</p>
        <p className="text-center">{inputValue}</p>
        <div className="w-100 d-flex">{SpinnerThird}</div>
      </>
    )

    const BadRequest = (
      <>
        <p className="lead text-center mb-2">Bad Request!</p>
        <div className="w-100 d-flex">{ FailedRequest }</div>
        <p className="lead text-center mt-2">Either the AI could not build a meme, or the request timed out!</p>
      </>
    )

    const handleShow  = () => {
      !shown && setShow (true);
      shown && setActiveTab("madlib");
    };

    const handleClose = () => {
      setShown (true);
      setShow (false);
      setActiveTab("madlib");
    };

    const handleRespShow  = () => setRespModal (true);
    const handleRespClose = () => setRespModal (false);

    const handleSubmit = () => {
        requestMeme(inputValue);
        handleRespShow();
        setImgUrl('');
    }

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
        setImgUrl('');
    }

    async function requestMeme(queryString) {
      console.log(queryString);

      if (queryString.length === 0) {
          queryString = "digital dipole"
      }
  
      const response = await fetch('/api/memegen/' + queryString);
      const meme = await response.json();

      if (meme.success == false)
          setImgUrl("badurl");

      setImgUrl (meme.data.url);
    }

    const DownloadIcon = <FontAwesomeIcon icon="fa-duotone fa-download" size="xl" className="hvr-bounce-in mt-2 float-right as-btn" onClick={downloadImage} />

    // TODO less rudimentary approach to unlock
    useEffect(() => {
      if (show) {
        setLock(false);
      };
    }, [show])

    const tabSwitch = (eventKey) => {
      console.log(eventKey);
      setActiveTab(eventKey);
    }

    const loadWords = (word_class) => {
      const word_list = data.terms[word_class];
      const optList = [];
      
      word_list.forEach((word) => {
        optList.push(
          <option key={word} value={word}>{ word }</option>
        )
      })

      return (
        <>
          { optList }
        </>
      )
    }

    function MLAccordion() {
      return (
        <Accordion defaultActiveKey={active} className="w-55 ml-auto mr-auto mb-4 mt-5 shadow-lg">
          <Accordion.Item eventKey="0">
            <Accordion.Header>Subject</Accordion.Header>
            <Accordion.Body className="d-flex justify-content-center align-items-center">
              <Form>
                <FormSelect value={subject} aria-label="subject" className="madlib-dd mb-2 mt-2 ml-auto mr-auto w-35" onChange={(e) => {
                  setActive('0')
                  setSubject(e.target.value)
                  }}>
                    <option value='' default>Select a subject</option>
                    { loadWords("subject") }
                </FormSelect>
              </Form>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="1">
            <Accordion.Header>Verb</Accordion.Header>
              <Accordion.Body className="d-flex justify-content-center align-items-center">
              <Form>
                <FormSelect value={verb} aria-label="verb" className="madlib-dd mb-2 mt-2 ml-auto mr-auto w-35" onChange={(e) => {
                  setActive('1')
                  setVerb(e.target.value)
                  }}>
                    <option value='' default>Select a verb</option>
                    { loadWords("verb") }
                </FormSelect>
              </Form>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="2">
            <Accordion.Header>Object</Accordion.Header>
              <Accordion.Body className="d-flex justify-content-center align-items-center">
              <Form>
                <FormSelect value={object} aria-label="object" className="madlib-dd mb-2 mt-2 ml-auto mr-auto w-35" onChange={(e) => {
                  setActive('2')
                  setObject(e.target.value)
                  }}>
                    <option value='' default>Select an object</option>
                    { loadWords("object") }
                </FormSelect>
              </Form>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="3">
            <Accordion.Header>Preposition</Accordion.Header>
              <Accordion.Body className="d-flex justify-content-center align-items-center">
              <Form>
                <FormSelect value={prep} aria-label="preposition" className="madlib-dd mb-2 mt-2 ml-auto mr-auto w-35" onChange={(e) => {
                  setActive('3')
                  setPrep(e.target.value)
                  }}>
                    <option value='' default>Select a preposition</option>
                    { loadWords("preposition") }
                </FormSelect>
              </Form>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="4">
            <Accordion.Header>Phrase</Accordion.Header>
              <Accordion.Body className="d-flex justify-content-center align-items-center">
              <Form>
                <FormSelect value={phrase} aria-label="phrase" className="madlib-dd mb-2 mt-2 ml-auto mr-auto w-35" onChange={(e) => {
                  setActive('4')
                  setPhrase(e.target.value)
                  }}>
                    <option value='' default>Select a phrase</option>
                    { loadWords("phrase") }
                </FormSelect>
              </Form>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      );
    }

    return (
      <>
        <div className="landing-container mt-3">
          <div className="landing mt-0">
            <Card className="mt-5 m-auto meme-card" id="ref-default">
              <Tabs
                defaultActiveKey="MemeGen"
                id="uncontrolled-tab-example"
                className="mb-3 mt-1 calc-tabs dsb-tabs"
                activeKey={activeTab}
                onSelect={(e) => tabSwitch(e)}
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
                          Powered by GPT-4 and{" "}
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
                  title="Natural Language"
                  disabled={lock}
                >
                  <Card className="bg-transparent brdr-none w-100">
                    <CardBody className="bg-transparent brdr-none m-auto w-85">
                      <div className="d-flex justify-content-around">
                        <div className="w-55">
                          <p className="text-left lead mt-1 mb-0">
                            Instructions
                          </p>
                          <ol>
                            <li className="text-left">
                              Enter a brief prompt to feed to the AI (
                              <em>128 characters max</em>)
                            </li>
                            <li className="text-left">Hit Generate!</li>
                            <li className="text-left">
                              Wait for your meme to be served (
                              <em>can sometimes take longer than one minute</em>)
                            </li>
                            <li className="text-left">Profit!</li>
                          </ol>
                        </div>
                        <div className="w-40">
                          <p className="lead text-center"><em>Note</em></p>
                          { BellAlert }
                          <p className="text-center lead smallish">Natural language input tends to go way off topic and dives into absurdity far more often than the madlib version!</p>
                        </div>
                      </div>
                      <Form.Floating className="m-auto">
                        <Form.Control
                          type="text"
                          maxLength={128}
                          placeholder=""
                          required
                          onChange={handleInputChange}
                          className="no-brd-rd"
                          id="nat-lang"
                        />
                        <label className="calc-float-label">Prompt</label>
                      </Form.Floating>
                      <Button
                        as="input"
                        type="submit"
                        value="Generate!"
                        onClick={handleSubmit}
                        className="mt-3 dp-button"
                      />{" "}
                    </CardBody>
                  </Card>
                </Tab>
                <Tab
                  eventKey="madlib"
                  className="calc-tab"
                  title="Mad Libs Input"
                  disabled={lock}
                >
                  <MLAccordion />

                  <div className="w-100">
                    <p className="lead text-center mb-0 text-underline">Your Prompt:</p>
                    {<p className="lead text-center mt-1">{inputValue == "" ? "Choose some words!" : inputValue}</p>}

                    <Button
                      as="input"
                      type="submit"
                      value="Generate!"
                      onClick={handleSubmit}
                      className="mt-3 dp-button"
                    />
                  </div>
                </Tab>
              </Tabs>

              <Modal
                show={respModal}
                onHide={handleRespClose}
                backdrop="static"
                keyboard={false}
              >
                <Modal.Header closeButton className="modal-bg">
                  <Modal.Title>Did Someone Order a Meme?</Modal.Title>
                </Modal.Header>
                <Modal.Body className="modal-bg w-100">
                  <div className="m-auto w-100">
                    {imgurl != "" ? imgurl == "badurl" ? BadRequest : (
                      <>
                        {" "}
                        <img
                          id="memecanvas"
                          src={imgurl}
                          className="m-auto w-100"
                        ></img>{" "}
                        {DownloadIcon}{" "}
                      </>
                    ) : (
                      MemeLoading
                    )}
                  </div>
                </Modal.Body>
                <Modal.Footer className="modal-bg d-flex flex-row justify-content-end align-items-start">
                  <Button
                    className="mb-2 mt-2 dp-button"
                    onClick={handleRespClose}
                  >
                    Back
                  </Button>
                </Modal.Footer>
              </Modal>
            </Card>
          </div>
        </div>
      </>
    );
}

export default MemeGen;