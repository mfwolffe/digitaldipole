/**
 * Equation Balancer Page
 *
 * Main page for the chemical equation balancer feature.
 * Provides text input, visual equation display, and auto-balancing.
 */

import React, { useState, useCallback } from 'react';
import { Card } from '../../components/ui/Card.jsx';
import { Modal, ModalHeader, ModalBody } from '../../components/ui/Modal.jsx';
import { Tabs, TabList, TabButton, TabPanel } from '../../components/ui/Tabs.jsx';
import { EquationEditor } from '../../balancer/components/EquationEditor.jsx';
import { BalanceResult } from '../../balancer/components/BalanceResult.jsx';
import { ElementPalette } from '../../balancer/components/ElementPalette.jsx';
import { CompoundBuilder } from '../../balancer/components/CompoundBuilder.jsx';
import { useEquationBalancer } from '../../balancer/hooks/useEquationBalancer.js';

import '../../App.css';

export function BalancerPage() {
  const {
    equation,
    coefficients,
    balanceResult,
    mode,
    isLoading,
    error,
    parseError,
    elementInventory,
    isBalanced,
    validation,
    parseText,
    setCoefficient,
    balance,
    verify,
    reset,
    setMode,
    setArrowType,
    reorderCompound,
    moveCompound,
    removeCompound,
  } = useEquationBalancer();

  // Visual builder state
  const [showBuilder, setShowBuilder] = useState(false);
  const [builderSide, setBuilderSide] = useState('reactant');
  const [buildingElements, setBuildingElements] = useState([]);
  const [inputMode, setInputMode] = useState('text'); // 'text' | 'visual'

  // Handle element selection from palette
  const handleElementSelect = useCallback((symbol) => {
    setBuildingElements(prev => {
      const existing = prev.find(e => e.symbol === symbol);
      if (existing) {
        return prev.map(e =>
          e.symbol === symbol ? { ...e, count: e.count + 1 } : e
        );
      }
      return [...prev, { symbol, count: 1 }];
    });
  }, []);

  // Handle ion selection
  const handleIonSelect = useCallback((ion) => {
    setBuildingElements(prev => {
      const newElements = [...prev];
      ion.elements.forEach(elem => {
        const existing = newElements.find(e => e.symbol === elem.symbol);
        if (existing) {
          existing.count += elem.count;
        } else {
          newElements.push({ symbol: elem.symbol, count: elem.count });
        }
      });
      return newElements;
    });
  }, []);

  // Handle compound completion from builder
  const handleCompoundComplete = useCallback((compound) => {
    // Build new equation text with the compound added
    const currentText = equation
      ? buildEquationText(equation, builderSide, compound)
      : (builderSide === 'reactant' ? `${compound.formula} -> ` : ` -> ${compound.formula}`);

    parseText(currentText);
    setBuildingElements([]);
    setShowBuilder(false);
  }, [equation, builderSide, parseText]);

  // Open builder for a specific side
  const openBuilder = useCallback((side) => {
    setBuilderSide(side);
    setBuildingElements([]);
    setShowBuilder(true);
  }, []);

  return (
    <div className="balancer-page min-h-screen bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-teal-400 mb-2">
            Equation Balancer
          </h1>
          <p className="text-gray-400">
            Enter a chemical equation to balance it automatically,
            or edit coefficients manually for practice.
          </p>
        </header>

        {/* Input mode tabs */}
        <Tabs activeKey={inputMode} onSelect={setInputMode} className="mb-6">
          <TabList className="flex gap-2 mb-4">
            <TabButton
              eventKey="text"
              className={`px-4 py-2 rounded-lg transition-colors ${
                inputMode === 'text'
                  ? 'bg-teal-600 text-white'
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              Text Input
            </TabButton>
            <TabButton
              eventKey="visual"
              className={`px-4 py-2 rounded-lg transition-colors ${
                inputMode === 'visual'
                  ? 'bg-teal-600 text-white'
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              Visual Builder
            </TabButton>
          </TabList>

          {/* Text input mode */}
          <TabPanel eventKey="text">
            <Card className="bg-slate-800/50 border-slate-700 mb-6">
              <div className="p-6">
                <EquationEditor
                  equation={equation}
                  coefficients={coefficients}
                  parseError={parseError}
                  isBalanced={isBalanced}
                  onParseText={parseText}
                  onCoefficientChange={setCoefficient}
                  onBalance={balance}
                  onVerify={verify}
                  onReset={reset}
                  onArrowChange={setArrowType}
                  onReorder={reorderCompound}
                  onMove={moveCompound}
                  onRemoveCompound={removeCompound}
                  isLoading={isLoading}
                  mode={mode}
                  onModeChange={setMode}
                />
              </div>
            </Card>
          </TabPanel>

          {/* Visual builder mode */}
          <TabPanel eventKey="visual">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Element palette - takes 2 columns on large screens */}
              <div className="lg:col-span-2">
                <ElementPalette
                  onElementSelect={handleElementSelect}
                  onIonSelect={handleIonSelect}
                  currentCompound={buildingElements}
                  showFullTable={true}
                />
              </div>

              {/* Compound builder - 1 column */}
              <div>
                <CompoundBuilder
                  initialElements={buildingElements}
                  side={builderSide}
                  onCompoundComplete={handleCompoundComplete}
                  onCancel={() => setBuildingElements([])}
                />

                {/* Side selector */}
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => setBuilderSide('reactant')}
                    className={`flex-1 py-2 rounded-lg transition-colors ${
                      builderSide === 'reactant'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                    }`}
                  >
                    Reactant
                  </button>
                  <button
                    onClick={() => setBuilderSide('product')}
                    className={`flex-1 py-2 rounded-lg transition-colors ${
                      builderSide === 'product'
                        ? 'bg-green-600 text-white'
                        : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                    }`}
                  >
                    Product
                  </button>
                </div>

                {/* Current equation preview */}
                {equation && (
                  <div className="mt-4 p-3 bg-slate-800 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Current equation:</p>
                    <p className="font-mono text-sm text-gray-300">
                      {buildEquationText(equation)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Balance button for visual mode */}
            {equation && (
              <div className="flex gap-3 mb-6">
                <button
                  onClick={balance}
                  disabled={isLoading}
                  className="px-6 py-2 bg-teal-600 hover:bg-teal-500 text-white
                             rounded-lg transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Balancing...' : 'Balance Equation'}
                </button>
                <button
                  onClick={reset}
                  className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-gray-300
                             rounded-lg transition-colors"
                >
                  Clear All
                </button>
              </div>
            )}
          </TabPanel>
        </Tabs>

        {/* Balance result (shared between modes) */}
        <BalanceResult
          equation={equation}
          coefficients={coefficients}
          balanceResult={balanceResult}
          elementInventory={elementInventory}
          validation={validation}
          error={error}
        />

        {/* Examples section */}
        <ExamplesSection onSelectExample={parseText} />
      </div>
    </div>
  );
}

/**
 * Build equation text from equation object, optionally adding a new compound
 */
function buildEquationText(equation, addToSide = null, newCompound = null) {
  let reactants = equation.reactants.map(c => {
    const coeff = c.coefficient > 1 ? c.coefficient : '';
    return `${coeff}${c.formula}`;
  });

  let products = equation.products.map(c => {
    const coeff = c.coefficient > 1 ? c.coefficient : '';
    return `${coeff}${c.formula}`;
  });

  if (newCompound && addToSide === 'reactant') {
    reactants.push(newCompound.formula);
  }
  if (newCompound && addToSide === 'product') {
    products.push(newCompound.formula);
  }

  const arrow = equation.arrowType || '->';
  return `${reactants.join(' + ')} ${arrow} ${products.join(' + ')}`;
}

/**
 * Examples section with clickable sample equations
 */
function ExamplesSection({ onSelectExample }) {
  const examples = [
    { name: 'Combustion', equation: 'CH4 + O2 -> CO2 + H2O' },
    { name: 'Photosynthesis', equation: 'CO2 + H2O -> C6H12O6 + O2' },
    { name: 'Rust Formation', equation: 'Fe + O2 -> Fe2O3' },
    { name: 'Neutralization', equation: 'HCl + NaOH -> NaCl + H2O' },
    { name: 'Single Replacement', equation: 'Zn + HCl -> ZnCl2 + H2' },
    { name: 'Double Replacement', equation: 'AgNO3 + NaCl -> AgCl + NaNO3' },
    { name: 'Decomposition', equation: 'H2O2 -> H2O + O2' },
    { name: 'Synthesis', equation: 'N2 + H2 -> NH3' },
  ];

  return (
    <div className="examples-section mt-8">
      <h3 className="text-lg font-medium text-gray-300 mb-3">
        Try an Example
      </h3>
      <div className="flex flex-wrap gap-2">
        {examples.map((ex) => (
          <button
            key={ex.name}
            onClick={() => onSelectExample(ex.equation)}
            className="px-3 py-1.5 text-sm bg-slate-700 hover:bg-slate-600
                       text-gray-300 rounded-lg transition-colors"
            title={ex.equation}
          >
            {ex.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default BalancerPage;
