import React, { useState, useMemo } from "react";

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
  ElementTable,
  GROUP_COLORS,
  getGradientColor,
} from "../components/ui";

import data from '../data/PubChemElements_all.json'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import '../App.css'
import '../styles/refs.css'

// Icons
const CircleX = <FontAwesomeIcon className="pr-3" icon="fa-duotone fa-circle-x" style={{"--fa-primary-color": "#e22828", "--fa-secondary-color": "#e22828",}} />;
const CircleCheck = <FontAwesomeIcon className="pr-3" icon="fa-duotone fa-circle-check" style={{"--fa-primary-color": "#69d510", "--fa-secondary-color": "#69d510",}} />;

/**
 * Build atom array from PubChem JSON structure
 */
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

/**
 * AtomCard - Display card for carousel
 */
function AtomCard({ atom }) {
  const bgColor = GROUP_COLORS[atom['GroupBlock']] || '#548687';

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

        <div style={{ maxHeight: '22rem', overflowY: 'auto' }}>
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

/**
 * Electronegativity Tab Content
 */
function ElectronegativityTab({ atoms }) {
  const columns = [
    { key: 'AtomicNumber', label: '#', unit: null },
    { key: 'Symbol', label: 'Symbol' },
    { key: 'Name', label: 'Name' },
    {
      key: 'Electronegativity',
      label: 'Electronegativity',
      unit: 'Pauling',
      render: (val, item) => {
        if (!val || val === '') return <span className="text-gray-400">—</span>;
        const numVal = parseFloat(val);
        const bgColor = getGradientColor(numVal, 0.7, 4.0, '#fef3c7', '#dc2626');
        return (
          <span
            className="px-2 py-1 rounded font-medium"
            style={{ backgroundColor: bgColor }}
          >
            {val}
          </span>
        );
      }
    },
    { key: 'GroupBlock', label: 'Group' },
  ];

  return (
    <div>
      <p className="text-sm text-gray-600 mb-3">
        Electronegativity measures an atom's ability to attract electrons in a chemical bond.
        Higher values (red) indicate stronger electron attraction. Noble gases typically have no electronegativity value.
      </p>
      <ElementTable
        data={atoms}
        columns={columns}
        defaultSort="Electronegativity"
        defaultDirection="desc"
        maxHeight={450}
      />
    </div>
  );
}

/**
 * Ionization Energy Tab Content
 */
function IonizationEnergyTab({ atoms }) {
  const columns = [
    { key: 'AtomicNumber', label: '#' },
    { key: 'Symbol', label: 'Symbol' },
    { key: 'Name', label: 'Name' },
    {
      key: 'IonizationEnergy',
      label: 'Ionization Energy',
      unit: 'eV',
      render: (val, item) => {
        if (!val || val === '') return <span className="text-gray-400">—</span>;
        const numVal = parseFloat(val);
        const bgColor = getGradientColor(numVal, 3.5, 25, '#dbeafe', '#1e40af');
        return (
          <span
            className="px-2 py-1 rounded font-medium"
            style={{ backgroundColor: bgColor, color: numVal > 15 ? 'white' : 'inherit' }}
          >
            {val}
          </span>
        );
      }
    },
    {
      key: 'ElectronAffinity',
      label: 'Electron Affinity',
      unit: 'eV',
      render: (val) => {
        if (!val || val === '') return <span className="text-gray-400">—</span>;
        return val;
      }
    },
    { key: 'GroupBlock', label: 'Group' },
  ];

  return (
    <div>
      <p className="text-sm text-gray-600 mb-3">
        Ionization energy is the energy required to remove an electron from a neutral atom.
        Electron affinity is the energy change when an atom gains an electron.
      </p>
      <ElementTable
        data={atoms}
        columns={columns}
        defaultSort="IonizationEnergy"
        defaultDirection="desc"
        maxHeight={450}
      />
    </div>
  );
}

/**
 * Atomic Radii Tab Content
 */
function AtomicRadiiTab({ atoms }) {
  const columns = [
    { key: 'AtomicNumber', label: '#' },
    { key: 'Symbol', label: 'Symbol' },
    { key: 'Name', label: 'Name' },
    {
      key: 'AtomicRadius',
      label: 'Atomic Radius',
      unit: 'pm',
      render: (val, item) => {
        if (!val || val === '') return <span className="text-gray-400">—</span>;
        const numVal = parseFloat(val);
        const bgColor = getGradientColor(numVal, 30, 300, '#d1fae5', '#065f46');
        return (
          <span
            className="px-2 py-1 rounded font-medium"
            style={{ backgroundColor: bgColor, color: numVal > 200 ? 'white' : 'inherit' }}
          >
            {val}
          </span>
        );
      }
    },
    { key: 'GroupBlock', label: 'Group' },
    { key: 'StandardState', label: 'State' },
  ];

  return (
    <div>
      <p className="text-sm text-gray-600 mb-3">
        Atomic radius generally increases down a group (more electron shells) and decreases across a period
        (stronger nuclear attraction). Values shown are empirical/calculated radii in picometers.
      </p>
      <ElementTable
        data={atoms}
        columns={columns}
        defaultSort="AtomicRadius"
        defaultDirection="desc"
        maxHeight={450}
      />
    </div>
  );
}

/**
 * Physical Properties Tab Content
 */
function PhysicalPropertiesTab({ atoms }) {
  const [tempUnit, setTempUnit] = useState('K');

  const convertTemp = (kelvin) => {
    if (!kelvin || kelvin === '') return null;
    const k = parseFloat(kelvin);
    if (tempUnit === 'K') return k.toFixed(2);
    if (tempUnit === 'C') return (k - 273.15).toFixed(2);
    if (tempUnit === 'F') return ((k - 273.15) * 9/5 + 32).toFixed(2);
    return k;
  };

  const columns = [
    { key: 'AtomicNumber', label: '#' },
    { key: 'Symbol', label: 'Symbol' },
    { key: 'Name', label: 'Name' },
    {
      key: 'MeltingPoint',
      label: 'Melting Point',
      unit: tempUnit,
      render: (val) => {
        const converted = convertTemp(val);
        return converted ? converted : <span className="text-gray-400">—</span>;
      }
    },
    {
      key: 'BoilingPoint',
      label: 'Boiling Point',
      unit: tempUnit,
      render: (val) => {
        const converted = convertTemp(val);
        return converted ? converted : <span className="text-gray-400">—</span>;
      }
    },
    {
      key: 'Density',
      label: 'Density',
      unit: 'g/cm³',
      render: (val) => {
        if (!val || val === '') return <span className="text-gray-400">—</span>;
        return parseFloat(val).toFixed(4);
      }
    },
    { key: 'StandardState', label: 'State' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-gray-600">
          Physical properties at standard conditions. Density is measured in the element's standard state.
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Temp:</span>
          <select
            value={tempUnit}
            onChange={(e) => setTempUnit(e.target.value)}
            className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="K">Kelvin (K)</option>
            <option value="C">Celsius (°C)</option>
            <option value="F">Fahrenheit (°F)</option>
          </select>
        </div>
      </div>
      <ElementTable
        data={atoms}
        columns={columns}
        defaultSort="MeltingPoint"
        defaultDirection="desc"
        maxHeight={450}
      />
    </div>
  );
}

/**
 * Electron Configuration Tab Content
 */
function ElectronConfigTab({ atoms }) {
  const [groupBy, setGroupBy] = useState('all');

  const filteredAtoms = useMemo(() => {
    if (groupBy === 'all') return atoms;
    return atoms.filter(atom => {
      const config = atom.ElectronConfiguration || '';
      if (groupBy === 's-block') return /\d+s\d+$/.test(config) && !/[dpf]\d+$/.test(config);
      if (groupBy === 'p-block') return /\d+p\d+$/.test(config);
      if (groupBy === 'd-block') return /\d+d\d+/.test(config) && !/\d+p\d+$/.test(config);
      if (groupBy === 'f-block') return /\d+f\d+/.test(config);
      return true;
    });
  }, [atoms, groupBy]);

  const columns = [
    { key: 'AtomicNumber', label: '#' },
    { key: 'Symbol', label: 'Symbol' },
    { key: 'Name', label: 'Name' },
    {
      key: 'ElectronConfiguration',
      label: 'Electron Configuration',
      render: (val) => {
        if (!val) return <span className="text-gray-400">—</span>;
        return <code className="text-sm bg-gray-100 px-2 py-0.5 rounded">{val}</code>;
      }
    },
    { key: 'GroupBlock', label: 'Group' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-gray-600">
          Electron configurations show how electrons are distributed in atomic orbitals.
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Block:</span>
          <select
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value)}
            className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">All Elements</option>
            <option value="s-block">s-block</option>
            <option value="p-block">p-block</option>
            <option value="d-block">d-block</option>
            <option value="f-block">f-block</option>
          </select>
        </div>
      </div>
      <ElementTable
        data={filteredAtoms}
        columns={columns}
        defaultSort="AtomicNumber"
        defaultDirection="asc"
        maxHeight={450}
      />
    </div>
  );
}

/**
 * Oxidation States Tab Content
 */
function OxidationStatesTab({ atoms }) {
  const columns = [
    { key: 'AtomicNumber', label: '#' },
    { key: 'Symbol', label: 'Symbol' },
    { key: 'Name', label: 'Name' },
    {
      key: 'OxidationStates',
      label: 'Oxidation States',
      render: (val) => {
        if (!val || val === '') return <span className="text-gray-400">—</span>;
        const states = val.split(',').map(s => s.trim());
        return (
          <div className="flex flex-wrap gap-1">
            {states.map((state, i) => {
              const num = parseInt(state);
              let bgColor = '#e5e7eb';
              if (num > 0) bgColor = '#dbeafe';
              if (num < 0) bgColor = '#fee2e2';
              if (num === 0) bgColor = '#f3f4f6';
              return (
                <span
                  key={i}
                  className="px-1.5 py-0.5 rounded text-xs font-medium"
                  style={{ backgroundColor: bgColor }}
                >
                  {state}
                </span>
              );
            })}
          </div>
        );
      }
    },
    { key: 'GroupBlock', label: 'Group' },
  ];

  return (
    <div>
      <p className="text-sm text-gray-600 mb-3">
        Common oxidation states for each element. Positive states (blue) indicate electron loss;
        negative states (red) indicate electron gain.
      </p>
      <ElementTable
        data={atoms}
        columns={columns}
        defaultSort="AtomicNumber"
        defaultDirection="asc"
        maxHeight={450}
      />
    </div>
  );
}

/**
 * Discovery Timeline Tab Content
 */
function DiscoveryTimelineTab({ atoms }) {
  const [era, setEra] = useState('all');

  const filteredAtoms = useMemo(() => {
    if (era === 'all') return atoms;
    return atoms.filter(atom => {
      const year = atom.YearDiscovered;
      if (year === 'Ancient') return era === 'ancient';
      const y = parseInt(year);
      if (era === 'ancient') return isNaN(y);
      if (era === 'pre1800') return y < 1800;
      if (era === '1800s') return y >= 1800 && y < 1900;
      if (era === '1900s') return y >= 1900 && y < 2000;
      if (era === '2000s') return y >= 2000;
      return true;
    });
  }, [atoms, era]);

  const columns = [
    { key: 'AtomicNumber', label: '#' },
    { key: 'Symbol', label: 'Symbol' },
    { key: 'Name', label: 'Name' },
    {
      key: 'YearDiscovered',
      label: 'Year Discovered',
      render: (val) => {
        if (!val) return <span className="text-gray-400">—</span>;
        if (val === 'Ancient') {
          return <span className="text-amber-700 font-medium">Ancient</span>;
        }
        return val;
      }
    },
    { key: 'GroupBlock', label: 'Group' },
    { key: 'StandardState', label: 'State' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-gray-600">
          When elements were discovered or first isolated. "Ancient" indicates known since antiquity.
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Era:</span>
          <select
            value={era}
            onChange={(e) => setEra(e.target.value)}
            className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">All Time</option>
            <option value="ancient">Ancient</option>
            <option value="pre1800">Before 1800</option>
            <option value="1800s">1800-1899</option>
            <option value="1900s">1900-1999</option>
            <option value="2000s">2000+</option>
          </select>
        </div>
      </div>
      <ElementTable
        data={filteredAtoms}
        columns={columns}
        defaultSort="YearDiscovered"
        defaultDirection="asc"
        maxHeight={450}
      />
    </div>
  );
}

/**
 * Main Tabulated Page Component
 */
const Tabulated = () => {
  const atoms = buildAtomJSON();

  const [activeTab, setActiveTab] = useState('AtomCarousel');
  const [show, setShow] = useState(false);
  const [index, setIndex] = useState(0);
  const [searchValue, setSearchValue] = useState('');

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  const handleSelect = (selectedIndex) => setIndex(selectedIndex);

  function jumpTo(e) {
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

    const found = atoms.find((atom) =>
      atom.Name.toLowerCase() === query.toLowerCase() || atom.Symbol === query
    );

    if (!found) {
      handleShow();
      return;
    }

    setIndex(found.AtomicNumber - 1);
  }

  return (
    <div className="landing-container mt-6 px-4">
      <div className="landing mt-0">
        <Card className="mt-8 mx-auto max-w-5xl">
          <Tabs
            activeKey={activeTab}
            onSelect={setActiveTab}
            className="calc-tabs"
          >
            <TabList className="flex overflow-x-auto border-b border-gray-200 px-2 pt-2 gap-1">
              <TabButton eventKey="AtomCarousel">Atom Carousel</TabButton>
              <TabButton eventKey="Electronegativity">Electronegativity</TabButton>
              <TabButton eventKey="IonizationEnergy">Ionization Energy</TabButton>
              <TabButton eventKey="AtomicRadii">Atomic Radii</TabButton>
              <TabButton eventKey="PhysicalProps">Physical Properties</TabButton>
              <TabButton eventKey="ElectronConfig">Electron Config</TabButton>
              <TabButton eventKey="OxidationStates">Oxidation States</TabButton>
              <TabButton eventKey="Discovery">Discovery</TabButton>
            </TabList>

            {/* Atom Carousel Tab */}
            <TabPanel eventKey="AtomCarousel" className="p-4">
              <div className="flex justify-end mb-4">
                <form onSubmit={jumpTo} className="flex gap-2 items-center">
                  <Popover>
                    <PopoverTrigger>
                      <button type="button" className="text-gray-400 hover:text-gray-200 p-1">
                        <FontAwesomeIcon icon="fa-duotone fa-circle-info" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent position="top" align="end" className="w-64">
                      <PopoverBody>
                        <p className="text-base font-medium mb-2">Jump to an element by entering:</p>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          <li>Its atomic number (1-118)</li>
                          <li>Its name (US English)</li>
                          <li>Or its element symbol (e.g., Fe)</li>
                        </ul>
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>
                  <Input
                    type="text"
                    placeholder="Jump-to"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="w-32"
                  />
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
                {atoms.map((atom) => (
                  <CarouselItem key={atom['AtomicNumber']} id={atom['Name']}>
                    <AtomCard atom={atom} />
                  </CarouselItem>
                ))}
              </Carousel>
            </TabPanel>

            {/* Electronegativity Tab */}
            <TabPanel eventKey="Electronegativity" className="p-4">
              <ElectronegativityTab atoms={atoms} />
            </TabPanel>

            {/* Ionization Energy Tab */}
            <TabPanel eventKey="IonizationEnergy" className="p-4">
              <IonizationEnergyTab atoms={atoms} />
            </TabPanel>

            {/* Atomic Radii Tab */}
            <TabPanel eventKey="AtomicRadii" className="p-4">
              <AtomicRadiiTab atoms={atoms} />
            </TabPanel>

            {/* Physical Properties Tab */}
            <TabPanel eventKey="PhysicalProps" className="p-4">
              <PhysicalPropertiesTab atoms={atoms} />
            </TabPanel>

            {/* Electron Configuration Tab */}
            <TabPanel eventKey="ElectronConfig" className="p-4">
              <ElectronConfigTab atoms={atoms} />
            </TabPanel>

            {/* Oxidation States Tab */}
            <TabPanel eventKey="OxidationStates" className="p-4">
              <OxidationStatesTab atoms={atoms} />
            </TabPanel>

            {/* Discovery Timeline Tab */}
            <TabPanel eventKey="Discovery" className="p-4">
              <DiscoveryTimelineTab atoms={atoms} />
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
                  <td className="text-right py-2 px-4">{CircleCheck}</td>
                </tr>
                <tr className="border-b border-surface-700">
                  <td className="py-2 px-4"><em>sulphur</em></td>
                  <td className="text-right py-2 px-4">{CircleX}</td>
                </tr>
                <tr className="border-b border-surface-700">
                  <td className="py-2 px-4"><em>81</em></td>
                  <td className="text-right py-2 px-4">{CircleCheck}</td>
                </tr>
                <tr className="border-b border-surface-700">
                  <td className="py-2 px-4"><em>128</em></td>
                  <td className="text-right py-2 px-4">{CircleX}</td>
                </tr>
                <tr className="border-b border-surface-700">
                  <td className="py-2 px-4"><em>Ti</em></td>
                  <td className="text-right py-2 px-4">{CircleCheck}</td>
                </tr>
                <tr>
                  <td className="py-2 px-4"><em>Zz</em></td>
                  <td className="text-right py-2 px-4">{CircleX}</td>
                </tr>
              </tbody>
            </Table>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button onClick={handleClose}>Back</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default Tabulated;
