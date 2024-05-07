import React from "react";
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import Tab from "react-bootstrap/Tab";
import Form from 'react-bootstrap/Form';
import Card from "react-bootstrap/Card";
import Tabs from "react-bootstrap/Tabs";
import Button from "react-bootstrap/esm/Button";
import Accordion from "react-bootstrap/Accordion";
import CardBody from "react-bootstrap/esm/CardBody";
import InputGroup from 'react-bootstrap/InputGroup';
import FormSelect from "react-bootstrap/esm/FormSelect";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import OverlayTrigger from "react-bootstrap/OverlayTrigger";

// SEEME MathJax on Async Typesetting:
// https://docs.mathjax.org/en/latest/web/typeset.html#handling-asynchronous-typesetting


import { ThermInfo1, ThermInfo2 } from "../../components/CalcInfo";
import { StateHeat } from "../../components/CalcInfo";

import { all } from '@awesome.me/kit-a655910996/icons'
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import "../../App.css";
import "../../styles/refs.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/bootstrap.min-dipole.css";

library.add(...all)

const Spinner  = <FontAwesomeIcon icon="fa-duotone fa-spinner" size="2xl" spinPulse />
const Bouncer  = <FontAwesomeIcon icon="fa-duotone fa-seal-exclamation" className="j-self-center" fontSize={"4rem"} bounce />
const RootIco  = <FontAwesomeIcon icon="fa-duotone fa-square-root-variable" size="lg" style={{"--fa-primary-color": "#ffffff", "--fa-secondary-color": "#fc6601", "--fa-secondary-opacity": "1",}} className="pr-2 hvr-bob" />
const ThermCurv = <FontAwesomeIcon icon="fa-duotone fa-fire-flame-curved" size="lg" style={{"--fa-secondary-color": "#fc6601", "--fa-primary-color": "#ffffff", "--fa-secondary-opacity": "1",}} className="pr-2 hvr-pulse-grow" />
const FnIco     = <FontAwesomeIcon icon="fa-duotone fa-function" size="lg" style={{"--fa-primary-color": "#ffffff", "--fa-secondary-color": "#cccccc", "--fa-secondary-opacity": "1",}} className="pr-2 hvr-bob" />



function test(Ac1, Ac2, act1 = "Info", act2 = "Calculator") {
  return (
    <>
      <Accordion defaultActiveKey="0" className="ml-auto mr-auto mb-3 calc-acc">
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            <FontAwesomeIcon icon="fa-duotone fa-circle-info" size="lg" style={{"--fa-secondary-color": "#fc6601", "--fa-primary-color": "#ffffff", "--fa-secondary-opacity": "1",}} className="pr-2 hvr-buzz" />
            {act1}
          </Accordion.Header>
          <Accordion.Body>
            <Ac1 />
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header>
            { act2 != "Calculator" ? ThermCurv : FnIco }
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

  // the checks for null are unnecessary
  return response_json == null ? (<></>) : (
    <>
      { symDrop }
    </>
  )
}

const FormGroups = (response_json) => {
  const inputs = []
  const symMap = JSON.parse(response_json['nu_html_mapping'])

  Object.keys(symMap).forEach(k => {
    const cmpnt = (
      <Form.Floating className="mt-2 float-right j-self-end">
        <Form.Control id={k} type="number" step={"0.000001"} placeholder="" name={k} className="calc-float" required/>
        <label htmlFor={k} className="calc-float-label" dangerouslySetInnerHTML={{ __html: symMap[k] }}></label>
      </Form.Floating>
    )
    inputs.push(cmpnt);
  });

  // the checks for null are unnecessary
  return response_json  == null ? (<></>) : (
    <>
      { inputs }

      <div className="mt-2 j-self-end">
        <Button type="submit">
          Solve!
        </Button>
      </div>
    </>
  )
}

// TODO resolve the cruft
const Thermo = () => {
  const GLFrame = (eq, sym_solve=false, num_solve=false) => {
    return (
      <>
        <div className="d-flex flex-row justify-content-around">
          {/* SEEME prob need to adjust height for diff calcs (calc-sub-card class below) */}
          <Card className="bg-transparent brdr-none calc-sub-card">
            <CardBody className="bg-transparent brdr-none">
              <p className="lead text-left mt-0">Instructions</p>
              <ol>
                <li className="text-left">Select your 'unknown'</li>
                <li className="text-left">Enter your 'known' values</li>
                <li className="text-left">Click 'Solve' to solve!</li>
              </ol>
            </CardBody>
          </Card>
          <Card className="bg-transparent brdr-none calc-sub-card">
            <CardBody className="bg-transparent brdr-none">

              <Form>
                <FormSelect value={opt} aria-label="unknown" className="unknown-dd mb-5 ml-auto mr-auto" onChange={(e) => setOpt(e.target.value)}>
                  <option value='' default>Select an unknown</option>
                  { eq !== null ? DropOpts(eq) : "Loading..." }
                </FormSelect>
              </Form>

              <p>
                { eq ? `$$ ${eq['user_solution_relatex'] ?? eq['orig']} $$` ?? Spinner : Spinner }
              </p>

            </CardBody>
          </Card>
          <Card className="bg-transparent brdr-none calc-sub-card">
            <CardBody className="bg-transparent brdr-none d-flex">
              <Form className="calc-submit a-self-center w-100" onSubmit={e => {
                e.preventDefault();

                console.debug("form handler target", e.target);
                const asList = [...e.target];
                const asObj = {};

                // TODO one liner grabs button too - add filter to reduce() ?
                // const asObj = asList.reduce((l, i) => ({...l, [i.name]: i.value}), {});
                asList.forEach(userIn => {
                  console.debug(userIn.name)
                  console.debug(userIn.value)
                  userIn.name != "" && (asObj[`${userIn.name}`] = `${userIn.value}`); 
                });

                console.debug(asList);
                console.debug(asObj);
                const objList = Object.entries(asObj).map(([k, v]) => ({ name: k, val: v }));

                const data = {
                  name: frame,
                  unknown: opt,
                  listVars: objList
                }

                console.debug(objList)

                fetch("/api/calculators/solve", {
                  method: "POST",
                  body: JSON.stringify(data),
                  headers: {
                    "Content-type": "application/json; charset=UTF-8"
                  },
                }).then(response => response.json()).then(data => {
                  console.log(data);
                  setRspns(data);
                });
              }}>
                
                { eq ? eq['user_solution_relatex'] ? FormGroups(eq) : Bouncer : Bouncer }
              
              </Form>

            </CardBody>
          </Card>
        </div>
      </>
    )
  }

  const [opt, setOpt]             = useState('')
  const [frame, setFrame]         = useState('info');
  const [usrNums, setUsrNums]     = useState({});
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

    // const navigate = useNavigate ();
    // navigate("/calculators");
    // navigate("/calculators/thermo/entropy");


    // SEEME uncomment for api
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
    console.log("event", event);
    // const navigate = useNavigate ();

    // navigate(`calculators/thermo/${event}`);

    setFrame(event);
  }

  useEffect(() => {
    if(typeof window?.MathJax !== "undefined"){
      window.MathJax.typesetClear()
      window.MathJax.typeset()
    }
  }, [CalcFrame])


  // TODO 
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
              {/* {test(GenInfo1, GenInfo2, "Gas Laws", "Ideal Gases")} */}
              {test(ThermInfo1, ThermInfo2, "Thermodynamics", "Laws of Thermodynamics")}
            </Tab>
            <Tab eventKey="enthalpy" className="calc-tab" title="Enthalpy Calculator">
              {test(StateHeat, CalcFrame)}
            </Tab>
            <Tab eventKey="entropy" className="calc-tab" title="Entropy Calculator">
              {/* {test(AmontonInfo, CalcFrame)} */}
              TODO fill out
              {frame == "entropy" && (
                <Navigate to={`/calculators/thermo/entropy`}/>
              )}
            </Tab>
            <Tab eventKey="gibbsFE" className="calc-tab" title="Gibbs Free Energy Calculator">
              {/* {test(BoyleInfo, CalcFrame)} */}
              TODO fill out

            </Tab>
            {/* <Tab eventKey="chrls" className="calc-tab" title="">
              {test(CharlesInfo, CalcFrame)}
            </Tab>
            <Tab
              eventKey="cmbnd"
              className="calc-tab"
              title="Combined Gas Law"
            >
              {test(CombinedInfo, CalcFrame)}
            </Tab>
            <Tab eventKey="ideal" className="calc-tab" title="Ideal Gas Law">
              {test(IdealInfo, CalcFrame)}
            </Tab> */}
          </Tabs>
        </Card>
      </div>
    </div>
    </>
  );
};

export default Thermo;
