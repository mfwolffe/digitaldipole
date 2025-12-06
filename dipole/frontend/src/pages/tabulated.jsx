import React from "react";
import { useState } from 'react';

import {
  Tabs,
  TabList,
  TabButton,
  TabPanel,
  Card,
  CardBody,
  Button,
  Input,
  InputGroup,
  InputAddon,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Table,
  Carousel,
  CarouselItem,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
} from "../components/ui";

import data from '../data/PubChemElements_all.json'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const CircleX = <FontAwesomeIcon className="pr-3" icon="fa-duotone fa-circle-x" style={{"--fa-primary-color": "#e22828", "--fa-secondary-color": "#e22828",}} />;
const CircleCheck = <FontAwesomeIcon className="pr-3" icon="fa-duotone fa-circle-check" style={{"--fa-primary-color": "#69d510", "--fa-secondary-color": "#69d510",}} />;

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
    <CarouselItem id={atomData['Name']}>
      { AtomTable(atomData) }
    </CarouselItem>
  )
}

function AtomTable(atomData) {
  function RowBuilder (atom) {
    const rows = []
    let idx = 0;
    for (const [key, val] of Object.entries(atom)) {
      rows.push((
        <tr key={idx} className={idx % 2 === 0 ? 'bg-white/10' : 'bg-white/5'}>
          <td className="text-left pl-6 py-3 text-white/90 font-medium">{ key }</td>
          <td className="text-right pr-6 py-3 text-white">{ val }</td>
        </tr>
      ))
      idx++;
    }
    return rows;
  }

  const bgColor = colorTable[atomData['GroupBlock']] || '#548687';

  return (
    <div className="max-w-md mx-auto my-4">
      <div
        className="rounded-xl overflow-hidden shadow-2xl"
        style={{ backgroundColor: bgColor }}
      >
        {/* Element header with symbol and number */}
        <div className="px-6 py-4 text-center border-b border-white/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/70 text-sm">{atomData['AtomicNumber']}</span>
            <span className="text-white/70 text-sm">{atomData['GroupBlock']}</span>
          </div>
          <div className="text-5xl font-bold text-white mb-1">{atomData['Symbol']}</div>
          <div className="text-2xl font-semibold text-white">{atomData['Name']}</div>
          <div className="text-white/80 text-sm mt-1">{atomData['AtomicMass']} u</div>
        </div>

        {/* Properties table */}
        <Table className="w-full">
          <thead>
            <tr className="bg-black/20">
              <th className="text-left pl-6 py-3 text-white font-semibold">Property</th>
              <th className="text-right pr-6 py-3 text-white font-semibold">Value</th>
            </tr>
          </thead>
          <tbody>
            { RowBuilder(atomData) }
          </tbody>
        </Table>
      </div>
    </div>
  )
}

const Tabulated = () => {
    const atoms = buildAtomJSON();

    const [show, setShow]   = useState(false);
    const [index, setIndex] = useState(0);
    const [searchValue, setSearchValue] = useState('');

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

    function jumpTo (e) {
      e.preventDefault();

      const query = searchValue;
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
        <div className="landing-container mt-6 px-4">
            <div className="landing mt-0">
                <Card className="mt-8 mx-auto max-w-4xl">
                  <Tabs
                    activeKey="AtomCarousel"
                    className="calc-tabs"
                  >
                    <TabList className="flex overflow-x-auto border-b border-gray-200 px-2 pt-2 gap-1">
                      <TabButton eventKey="AtomCarousel">Atom Carousel</TabButton>
                    </TabList>

                    <TabPanel eventKey="AtomCarousel" className="p-4">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                        <p className="text-lg font-medium text-gray-200">Atom Carousel</p>
                        <form onSubmit={jumpTo} className="flex gap-2">
                          <Popover>
                            <PopoverTrigger className="flex-1">
                              <Input
                                type="text"
                                placeholder="Jump-to"
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                className="w-32"
                              />
                            </PopoverTrigger>
                            <PopoverContent position="bottom" align="end" className="w-64">
                              <PopoverBody>
                                <p className="text-base font-medium mb-2">Jump to an element by entering:</p>
                                <ul className="list-disc list-inside space-y-1 text-sm">
                                  <li>Its atomic number</li>
                                  <li>Its name (US English)</li>
                                  <li>Or its element symbol</li>
                                </ul>
                              </PopoverBody>
                            </PopoverContent>
                          </Popover>
                          <Button type="submit" variant="ghost" className="hvr-grow-rotate">
                            <FontAwesomeIcon icon="fa-duotone fa-magnifying-glass" fontSize={"1.4rem"}/>
                          </Button>
                        </form>
                      </div>

                      <Carousel
                        activeIndex={index}
                        onSelect={handleSelect}
                        fade
                        interval={null}
                        className="w-full"
                      >
                        { slides }
                      </Carousel>
                    </TabPanel>
                  </Tabs>
                </Card>
            </div>

            {/* Error Modal */}
            <Modal
              show={show}
              onClose={handleClose}
              backdrop="static"
              keyboard={false}
            >
              <ModalHeader onClose={handleClose}>Query found no match</ModalHeader>
              <ModalBody>
                <p className="mb-4">Queries must either be an atom's name in US English, atomic number, or symbol on the periodic table</p>
                <p className="mb-2 font-medium">Examples:</p>
                <div className="overflow-x-auto">
                  <Table className="w-full max-w-sm mx-auto">
                    <thead>
                      <tr className="border-b border-surface-600">
                        <th className="text-left py-2 px-4">Query</th>
                        <th className="text-right py-2 px-4">Validity</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-surface-700">
                        <td className="py-2 px-4"><em>hydrogen</em></td>
                        <td className="text-right py-2 px-4">{ CircleCheck }</td>
                      </tr>
                      <tr className="border-b border-surface-700">
                        <td className="py-2 px-4"><em>sulphur</em></td>
                        <td className="text-right py-2 px-4">{ CircleX }</td>
                      </tr>
                      <tr className="border-b border-surface-700">
                        <td className="py-2 px-4"><em>81</em></td>
                        <td className="text-right py-2 px-4">{ CircleCheck }</td>
                      </tr>
                      <tr className="border-b border-surface-700">
                        <td className="py-2 px-4"><em>128</em></td>
                        <td className="text-right py-2 px-4">{ CircleX }</td>
                      </tr>
                      <tr className="border-b border-surface-700">
                        <td className="py-2 px-4"><em>Ti</em></td>
                        <td className="text-right py-2 px-4">{ CircleCheck }</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4"><em>Zz</em></td>
                        <td className="text-right py-2 px-4">{ CircleX }</td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button onClick={handleClose}>
                  Back
                </Button>
              </ModalFooter>
            </Modal>
        </div>
    );
}

export default Tabulated;
