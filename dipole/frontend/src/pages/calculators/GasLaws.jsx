import React from "react";
import { useState, useEffect } from "react";

import Tab from "react-bootstrap/Tab";
import Form from 'react-bootstrap/Form';
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
import FormSelect from "react-bootstrap/esm/FormSelect";

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

const DropOpts = (response_json) => {
  let symList = response_json['html_mapping'];
  symList = JSON.parse(symList);
  const symDrop = [];

  // [x] TODO need to map keys to html symbols / unicode
  Object.keys(symList).forEach((k => {
    symDrop.push(<option key={k} value={k} dangerouslySetInnerHTML={{ __html: symList[k] }}></option>)
  }));

  return response_json == null ? (<></>) : (
    <>
      { symDrop }
    </>
  )
}

// TODO resolve the cruft
const CalcCard = () => {
  const GLFrame = (eq, sym_solve=false, num_solve=false) => {
    return (
      <>
        <div className="d-flex flex-row justify-content-around align-items-center">
          <Card className="bg-transparent brdr-none">
            <CardBody className="bg-transparent brdr-none">
              <p>
              { eq ? `$$ ${eq['user_solution_relatex'] ?? eq['orig']} $$` ?? "Loading..." : "Loading..." }
              </p>
            </CardBody>
          </Card>
          <Card className="bg-transparent brdr-none">
            <CardBody className="bg-transparent brdr-none">
              <Form>
                <FormSelect aria-label="unknown" className="unknown-dd" onChange={(e) => setOpt(e.target.value)}>
                  <option value='' default>Select an unknown</option>
                  { eq !== null ? DropOpts(eq) : "Loading..." }
                </FormSelect>
              </Form>
            </CardBody>
          </Card>
        </div>
      </>
    )
  }

  const [opt, setOpt]             = useState('')
  const [frame, setFrame]         = useState('info');
  const [rspns_json, setRspns]    = useState(null);
  const [CalcFrame, setCalcFrame] = useState(() => GLFrame(null) );

  // TODO make POST request for symbolic solve
  useEffect(() => {

    if (opt === '')
      return;

    let ignore = false;
    setRspns(null);
    fetch(`/api/calculators/${frame}/${opt}`)
      .then(response => response.json())
      .then(data => {setRspns(data);})
      .catch(e => console.log(e));
    return () => {
      ignore = true;
    }
  }, [opt])

  
  // SEEME when switching tabs, fetch the default state with '.../true'
  // TODO persistence when returning to tab?
  useEffect(() => {
    if (frame === "info")
      return;

    let ignore = false;

    setRspns(null);
    fetch(`/api/calculators/${frame}/ini`)
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
