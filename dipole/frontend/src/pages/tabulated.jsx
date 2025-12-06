import React from "react";
import { useState } from 'react';

import {
  Tabs,
  TabList,
  TabButton,
  TabPanel,
  Card,
  Button,
  Input,
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
import { all } from '@awesome.me/kit-a655910996/icons'
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const CircleX = <FontAwesomeIcon className="pr-3" icon="fa-duotone fa-circle-x" style={{"--fa-primary-color": "#e22828", "--fa-secondary-color": "#e22828",}} />;
const CircleCheck = <FontAwesomeIcon className="pr-3" icon="fa-duotone fa-circle-check" style={{"--fa-primary-color": "#69d510", "--fa-secondary-color": "#69d510",}} />;
library.add(...all);

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

function AtomCard({ atom }) {
  const bgColor = colorTable[atom['GroupBlock']] || '#548687';

  // Filter out some properties for cleaner display
  const displayProps = [
    ['Atomic Number', atom['AtomicNumber']],
    ['Symbol', atom['Symbol']],
    ['Atomic Mass', atom['AtomicMass'] + ' u'],
    ['Electron Configuration', atom['ElectronConfiguration']],
    ['Electronegativity', atom['Electronegativity'] || 'N/A'],
    ['Atomic Radius', atom['AtomicRadius'] ? atom['AtomicRadius'] + ' pm' : 'N/A'],
    ['Ionization Energy', atom['IonizationEnergy'] ? atom['IonizationEnergy'] + ' eV' : 'N/A'],
    ['Oxidation States', atom['OxidationStates'] || 'N/A'],
    ['Standard State', atom['StandardState']],
    ['Melting Point', atom['MeltingPoint'] ? atom['MeltingPoint'] + ' K' : 'N/A'],
    ['Boiling Point', atom['BoilingPoint'] ? atom['BoilingPoint'] + ' K' : 'N/A'],
    ['Density', atom['Density'] ? atom['Density'] + ' g/cm³' : 'N/A'],
    ['Year Discovered', atom['YearDiscovered']],
  ];

  return (
    <div style={{ maxWidth: '32rem', margin: '0 auto' }}>
      <div
        style={{
          backgroundColor: bgColor,
          borderRadius: '1rem',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }}
      >
        {/* Element header with symbol and number */}
        <div style={{
          padding: '1.5rem 2rem',
          textAlign: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.2)',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '0.75rem',
          }}>
            <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.125rem', fontWeight: 500 }}>
              {atom['AtomicNumber']}
            </span>
            <span style={{
              color: 'rgba(255,255,255,0.8)',
              fontSize: '0.875rem',
              padding: '0.25rem 0.75rem',
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: '9999px',
            }}>
              {atom['GroupBlock']}
            </span>
          </div>
          <div style={{ fontSize: '4.5rem', fontWeight: 'bold', color: 'white', marginBottom: '0.5rem' }}>
            {atom['Symbol']}
          </div>
          <div style={{ fontSize: '1.875rem', fontWeight: 600, color: 'white' }}>
            {atom['Name']}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.125rem', marginTop: '0.5rem' }}>
            {atom['AtomicMass']} u
          </div>
        </div>

        {/* Properties table */}
        <div style={{ maxHeight: '16rem', overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {displayProps.map(([key, val], idx) => (
                <tr key={idx} style={{
                  backgroundColor: idx % 2 === 0 ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.05)',
                }}>
                  <td style={{
                    textAlign: 'left',
                    paddingLeft: '1.5rem',
                    paddingTop: '0.5rem',
                    paddingBottom: '0.5rem',
                    color: 'rgba(255,255,255,0.9)',
                    fontWeight: 500,
                    fontSize: '0.875rem',
                  }}>{key}</td>
                  <td style={{
                    textAlign: 'right',
                    paddingRight: '1.5rem',
                    paddingTop: '0.5rem',
                    paddingBottom: '0.5rem',
                    color: 'white',
                    fontSize: '0.875rem',
                  }}>{val}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
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
                        interval={null}
                        className="w-full"
                      >
                        {atoms.map((atom, i) => (
                          <CarouselItem key={atom['AtomicNumber']} id={atom['Name']}>
                            <AtomCard atom={atom} />
                          </CarouselItem>
                        ))}
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
