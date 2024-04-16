import React from "react";
import { useState, useEffect } from "react";

import Tab from "react-bootstrap/Tab";
import Card from "react-bootstrap/Card";
import Tabs from "react-bootstrap/Tabs";
import Accordion from "react-bootstrap/Accordion";
import CardBody from "react-bootstrap/esm/CardBody";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";

// SEEME MathJax on Async Typesetting:
// https://docs.mathjax.org/en/latest/web/typeset.html#handling-asynchronous-typesetting

import {
  AvoInfo,
  AmontonInfo,
  BoyleInfo,
  CharlesInfo,
  CombinedInfo,
  IdealInfo,
} from "../../components/CalcInfo";
import { GenInfo1, GenInfo2 } from "../../components/CalcInfo";

import { all } from '@awesome.me/kit-a655910996/icons'
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import "../../App.css";
import "../../styles/refs.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/bootstrap.min-dipole.css";

library.add(...all)

function test(Ac1, Ac2, act1 = "Info", act2 = "Calculator") {
  return (
    <>
      <Accordion defaultActiveKey="0" className="ml-auto mr-auto mb-3 calc-acc">
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            <FontAwesomeIcon icon="fa-duotone fa-circle-info" size="lg" style={{"--fa-secondary-color": "#51D4FF", "--fa-primary-color": "#533856",}} className="pr-2" />
            {act1}
          </Accordion.Header>
          <Accordion.Body>
            <Ac1 />
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header>
            {act2}
          </Accordion.Header>
          <Accordion.Body>
            { act1 !== "Info" ? <Ac2 /> : Ac2 }
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </>
  );
}

const GLFrame = (response_json) => {
  return (
    <>
      <div className="d-flex flex-row justify-content-around align-items-center">
        <Card className="bg-transparent">
          <CardBody>
            <p>
            { response_json ? `$$ ${response_json['orig']} $$` ?? "Loading..." : "Loading..." }
            </p>
          </CardBody>
        </Card>
        <Card className="bg-transparent">
          <CardBody>
            this is a card. inputs go here
          </CardBody>
        </Card>
      </div>
    </>
  )
}

// TODO resolve the cruft (eg look at the ternary above this lol)
//      not sure if overcomplicating useState/Effect
const CalcCard = () => {
  const [frame, setFrame]         = useState('info');
  const [rspns_json, setRspns]    = useState(null);
  const [CalcFrame, setCalcFrame] = useState(() => GLFrame(null) );
  
  // SEEME when switching tabs, fetch the default state with '.../true'
  // TODO persistence when returning to tab?
  useEffect(() => {
    if (frame === "info")
      return;

    let ignore = false;

    setRspns(null);
    fetch(`/api/calculators/${frame}/true`)
      .then(response => response.json())
      .then(data => {setRspns(data);})
      .catch(e => console.log(e));
    return () => {
      ignore = true;
    }
  }, [frame])

  useEffect(() => {
    setCalcFrame(GLFrame(rspns_json));
  }, [rspns_json])

  function handleClick(event) {
    console.log("event", event)
    setFrame(event);
  }

  useEffect(() => {
    if(typeof window?.MathJax !== "undefined"){
      window.MathJax.typesetClear()
      window.MathJax.typeset()
    }
  }, [CalcFrame])

  return (
    <>
    <div className="landing-container mt-3">
      <div className="landing mt-0">
        <Card className="mt-5 m-auto gl-calc" id="ref-default">
          <Tabs
            onSelect={(e) => handleClick(e)}
            defaultActiveKey="info"
            id="uncontrolled-tab-example"
            className="mb-3 mt-1 calc-tabs"
          >
            <Tab eventKey="info" className="calc-tab" title="Info">
              {test(GenInfo1, GenInfo2, "Gas Laws", "Ideal Gases")}
            </Tab>
            <Tab eventKey="avgdr" className="calc-tab" title="Avogadro's Law">
              {test(AvoInfo, CalcFrame)}
            </Tab>
            <Tab eventKey="amntn" className="calc-tab" title="Amonton's Law">
              {test(AmontonInfo, AmontonInfo)}
            </Tab>
            <Tab eventKey="boyle" className="calc-tab" title="Boyle's Law">
              {test(BoyleInfo, BoyleInfo)}
            </Tab>
            <Tab eventKey="chrls" className="calc-tab" title="Charles' Law">
              {test(CharlesInfo, CharlesInfo)}
            </Tab>
            <Tab
              eventKey="cmbnd"
              className="calc-tab"
              title="Combined Gas Law"
            >
              {test(CombinedInfo, CombinedInfo)}
            </Tab>
            <Tab eventKey="ideal" className="calc-tab" title="Ideal Gas Law">
              {test(IdealInfo, IdealInfo)}
            </Tab>
          </Tabs>
        </Card>
      </div>
    </div>
    </>
  );
};

export default CalcCard;
