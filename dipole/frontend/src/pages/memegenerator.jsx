import React from "react";
import { useState, useEffect } from 'react';
import { NavLink as Link } from "react-router-dom";

import {
  Tabs,
  TabList,
  TabButton,
  TabPanel,
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionBody,
  Card,
  CardBody,
  Button,
  Select,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "../components/ui";

import '../App.css'

import data from './terms.json';
import { saveAs } from "file-saver";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


const RadiateIcon = <FontAwesomeIcon fontSize={"5.5rem"} icon="fa-thin fa-radiation" className="m-auto" spin />
const BellAlert = <FontAwesomeIcon icon="fa-duotone fa-bell-ring" fontSize={"4rem"} className="m-auto" shake />
const SpinnerThird = <FontAwesomeIcon icon="fa-duotone fa-spinner-third" fontSize={"5.5rem"} className="m-auto" spin />
const AIBotIcon  = <FontAwesomeIcon fontSize={"7rem"} icon="fa-duotone fa-message-bot" className="m-auto" bounce />
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
        <p className="text-lg text-center mb-1">Your prompt:</p>
        <p className="text-center">{inputValue}</p>
        <div className="w-full flex justify-center">{SpinnerThird}</div>
      </>
    )

    const BadRequest = (
      <>
        <p className="text-lg text-center mb-2">Meme Generation Failed!</p>
        <div className="w-full flex justify-center">{ FailedRequest }</div>
        <p className="text-lg text-center mt-2">
          {errorMsg || "Either the AI could not build a meme, or the request timed out!"}
        </p>
        {errorMsg && (
          <p className="text-sm text-center mt-2 text-gray-400">
            Check the browser console for more details.
          </p>
        )}
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

    const [errorMsg, setErrorMsg] = useState('');

    async function requestMeme(queryString) {
      console.log('[MemeGen Frontend] Requesting:', queryString);
      setErrorMsg('');

      if (queryString.length === 0) {
          queryString = "digital dipole"
      }

      try {
        const response = await fetch('/api/memegen/' + encodeURIComponent(queryString));

        if (!response.ok) {
          console.error('[MemeGen Frontend] HTTP error:', response.status);
          setErrorMsg(`Server error: ${response.status}`);
          setImgUrl("badurl");
          return;
        }

        const meme = await response.json();
        console.log('[MemeGen Frontend] Response:', meme);

        if (meme.success === false) {
          console.error('[MemeGen Frontend] API error:', meme.error_message);
          setErrorMsg(meme.error_message || 'Unknown error');
          setImgUrl("badurl");
          return;
        }

        if (meme.data && meme.data.url) {
          setImgUrl(meme.data.url);
        } else {
          console.error('[MemeGen Frontend] No URL in response:', meme);
          setErrorMsg('No meme URL in response');
          setImgUrl("badurl");
        }
      } catch (err) {
        console.error('[MemeGen Frontend] Fetch error:', err);
        setErrorMsg(`Request failed: ${err.message}`);
        setImgUrl("badurl");
      }
    }

    const DownloadIcon = <FontAwesomeIcon icon="fa-duotone fa-download" size="xl" className="hvr-bounce-in mt-2 float-right cursor-pointer" onClick={downloadImage} />

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
        <Accordion defaultActiveKey={active} className="max-w-lg mx-auto mb-4 mt-5 shadow-lg">
          <AccordionItem eventKey="0">
            <AccordionHeader>Subject</AccordionHeader>
            <AccordionBody className="flex justify-center items-center">
              <Select
                value={subject}
                aria-label="subject"
                className="max-w-xs my-2 mx-auto"
                onChange={(e) => {
                  setActive('0')
                  setSubject(e.target.value)
                }}
              >
                <option value='' default>Select a subject</option>
                { loadWords("subject") }
              </Select>
            </AccordionBody>
          </AccordionItem>
          <AccordionItem eventKey="1">
            <AccordionHeader>Verb</AccordionHeader>
            <AccordionBody className="flex justify-center items-center">
              <Select
                value={verb}
                aria-label="verb"
                className="max-w-xs my-2 mx-auto"
                onChange={(e) => {
                  setActive('1')
                  setVerb(e.target.value)
                }}
              >
                <option value='' default>Select a verb</option>
                { loadWords("verb") }
              </Select>
            </AccordionBody>
          </AccordionItem>
          <AccordionItem eventKey="2">
            <AccordionHeader>Object</AccordionHeader>
            <AccordionBody className="flex justify-center items-center">
              <Select
                value={object}
                aria-label="object"
                className="max-w-xs my-2 mx-auto"
                onChange={(e) => {
                  setActive('2')
                  setObject(e.target.value)
                }}
              >
                <option value='' default>Select an object</option>
                { loadWords("object") }
              </Select>
            </AccordionBody>
          </AccordionItem>
          <AccordionItem eventKey="3">
            <AccordionHeader>Preposition</AccordionHeader>
            <AccordionBody className="flex justify-center items-center">
              <Select
                value={prep}
                aria-label="preposition"
                className="max-w-xs my-2 mx-auto"
                onChange={(e) => {
                  setActive('3')
                  setPrep(e.target.value)
                }}
              >
                <option value='' default>Select a preposition</option>
                { loadWords("preposition") }
              </Select>
            </AccordionBody>
          </AccordionItem>
          <AccordionItem eventKey="4">
            <AccordionHeader>Phrase</AccordionHeader>
            <AccordionBody className="flex justify-center items-center">
              <Select
                value={phrase}
                aria-label="phrase"
                className="max-w-xs my-2 mx-auto"
                onChange={(e) => {
                  setActive('4')
                  setPhrase(e.target.value)
                }}
              >
                <option value='' default>Select a phrase</option>
                { loadWords("phrase") }
              </Select>
            </AccordionBody>
          </AccordionItem>
        </Accordion>
      );
    }

    return (
      <>
        <div className="landing-container mt-6 px-4">
          <div className="landing mt-0">
            <Card className="mt-8 mx-auto max-w-4xl">
              <Tabs
                activeKey={activeTab}
                onSelect={tabSwitch}
                className="calc-tabs"
              >
                <TabList className="flex overflow-x-auto border-b border-gray-200 px-2 pt-2 gap-1">
                  <TabButton eventKey="MemeGen">Instructions</TabButton>
                  <TabButton eventKey="raw" disabled={lock}>Natural Language</TabButton>
                  <TabButton eventKey="madlib" disabled={lock}>Mad Libs Input</TabButton>
                </TabList>

                <TabPanel eventKey="MemeGen" className="p-4">
                  <div className="max-w-md mx-auto">
                    <Card className="shadow-xl bg-surface-800 text-white">
                      <CardBody className="text-center">
                        <h3 className="text-xl font-semibold mt-2 text-gray-200">
                          AI Meme Generator
                        </h3>
                        {AIChipIcon}
                        <p className="text-center text-gray-300 mb-2">
                          Powered by GPT-4 and{" "}
                          <a
                            href="https://imgflip.com"
                            target="_blank"
                            className="text-primary-400 hover:text-primary-300 hvr-underline-from-center"
                          >
                            <em>ImgFlip</em>
                          </a>
                        </p>
                        <Button
                          className="mx-auto mt-2 mb-4"
                          onClick={handleShow}
                        >
                          Start!
                        </Button>
                      </CardBody>
                    </Card>
                  </div>
                </TabPanel>

                <TabPanel eventKey="raw" className="p-4">
                  <div className="max-w-3xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-around gap-6">
                      <div className="flex-1">
                        <p className="text-left text-lg font-medium mb-2">
                          Instructions
                        </p>
                        <ol className="list-decimal list-inside space-y-2 text-left text-gray-300">
                          <li>
                            Enter a brief prompt to feed to the AI (
                            <em>128 characters max</em>)
                          </li>
                          <li>Hit Generate!</li>
                          <li>
                            Wait for your meme to be served (
                            <em>can sometimes take longer than one minute</em>)
                          </li>
                          <li>Profit!</li>
                        </ol>
                      </div>
                      <div className="flex-1 text-center">
                        <p className="text-lg font-medium"><em>Note</em></p>
                        <div className="flex justify-center my-2">{ BellAlert }</div>
                        <p className="text-sm text-gray-300">Natural language input tends to go way off topic and dives into absurdity far more often than the madlib version!</p>
                      </div>
                    </div>
                    <div className="mt-6">
                      <label htmlFor="nat-lang" className="block text-sm font-medium text-gray-400 mb-1">Prompt</label>
                      <input
                        type="text"
                        maxLength={128}
                        placeholder="Enter your meme prompt..."
                        required
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-surface-700 border border-surface-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        id="nat-lang"
                      />
                    </div>
                    <div className="mt-4 text-center">
                      <Button onClick={handleSubmit}>
                        Generate!
                      </Button>
                    </div>
                  </div>
                </TabPanel>

                <TabPanel eventKey="madlib" className="p-4">
                  <MLAccordion />

                  <div className="text-center">
                    <p className="text-lg font-medium mb-1 underline">Your Prompt:</p>
                    <p className="text-lg mt-1">{inputValue.trim() === "" ? "Choose some words!" : inputValue}</p>

                    <Button
                      onClick={handleSubmit}
                      className="mt-4"
                    >
                      Generate!
                    </Button>
                  </div>
                </TabPanel>
              </Tabs>
            </Card>
          </div>
        </div>

        {/* Warning Modal */}
        <Modal
          show={show}
          onClose={handleClose}
          backdrop="static"
          keyboard={false}
        >
          <ModalHeader onClose={handleClose}>Warning!</ModalHeader>
          <ModalBody>
            <div className="flex justify-center mb-4">{RadiateIcon}</div>

            <p className="italic mb-2">Per the imgflip API:</p>

            <div className="bg-surface-900 rounded-lg p-3 border border-surface-600">
              <code className="text-sm text-gray-300">
                The AI is trained on all public user-generated
                content, so it is NOT censored or curated in
                anyway, and therefore may contain vulgarities or
                other potentially unsuitable content. If this
                doesn't fit your use case, you may want to
                filter the output based on language.
              </code>
            </div>
          </ModalBody>
          <ModalFooter>
            <Link to="/">
              <Button
                variant="outline-secondary"
                onClick={handleClose}
              >
                Return Home
              </Button>
            </Link>
            <Button onClick={handleClose}>
              Proceed
            </Button>
          </ModalFooter>
        </Modal>

        {/* Response Modal */}
        <Modal
          show={respModal}
          onClose={handleRespClose}
          backdrop="static"
          keyboard={false}
          size="lg"
        >
          <ModalHeader onClose={handleRespClose}>Did Someone Order a Meme?</ModalHeader>
          <ModalBody>
            <div className="mx-auto w-full">
              {imgurl !== "" ? imgurl === "badurl" ? BadRequest : (
                <>
                  <img
                    id="memecanvas"
                    src={imgurl}
                    className="mx-auto w-full rounded-lg"
                    alt="Generated meme"
                  />
                  <div className="text-right mt-2">
                    {DownloadIcon}
                  </div>
                </>
              ) : (
                MemeLoading
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleRespClose}>
              Back
            </Button>
          </ModalFooter>
        </Modal>
      </>
    );
}

export default MemeGen;
