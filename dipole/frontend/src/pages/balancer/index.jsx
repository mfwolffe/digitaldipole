/**
 * Equation Balancer Page
 *
 * Unified input approach:
 * - Text input is the single source of truth
 * - Visual tools (Element Palette, Compound Builder) assist text entry
 * - Visual preview shows parsed equation below input
 */

import React, { useState, useCallback, useRef } from 'react';
import { Card } from '../../components/ui/Card.jsx';
import { Modal, ModalHeader, ModalBody } from '../../components/ui/Modal.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { EquationEditor } from '../../balancer/components/EquationEditor.jsx';
import { BalanceResult } from '../../balancer/components/BalanceResult.jsx';
import { ElementPalette } from '../../balancer/components/ElementPalette.jsx';
import { CompoundBuilder } from '../../balancer/components/CompoundBuilder.jsx';
import { PracticeMode } from '../../balancer/components/PracticeMode.jsx';
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
    setSolution,
    solution,
    setArrowType,
    reorderCompound,
    moveCompound,
    removeCompound,
    practiceMode,
    practiceCoefficients,
    startPractice,
    exitPractice,
    setPracticeCoefficient,
    equationString,
  } = useEquationBalancer();

  // Text input state (controlled by EquationEditor but we need access for visual tools)
  const [textInput, setTextInput] = useState('');

  // Visual builder modal state
  const [showBuilder, setShowBuilder] = useState(false);
  const [builderSide, setBuilderSide] = useState('reactant');
  const [buildingElements, setBuildingElements] = useState([]);

  // Element palette visibility
  const [showPalette, setShowPalette] = useState(false);

  /**
   * Insert text at cursor position or append to input
   * Returns the new text value for immediate use
   */
  const insertIntoInput = useCallback((text) => {
    let newValue = '';
    setTextInput(prev => {
      // If empty, just set
      if (!prev.trim()) {
        newValue = text;
        return text;
      }

      // If we have an arrow, figure out which side to add to
      const arrowMatch = prev.match(/(->|→|⇌|<->|=)/);
      if (arrowMatch) {
        const arrowIndex = prev.indexOf(arrowMatch[0]);
        const beforeArrow = prev.slice(0, arrowIndex).trim();
        const afterArrow = prev.slice(arrowIndex + arrowMatch[0].length).trim();

        if (builderSide === 'reactant') {
          // Add to reactants (before arrow)
          const newBefore = beforeArrow ? `${beforeArrow} + ${text}` : text;
          newValue = `${newBefore} ${arrowMatch[0]} ${afterArrow}`;
        } else {
          // Add to products (after arrow)
          const newAfter = afterArrow ? `${afterArrow} + ${text}` : text;
          newValue = `${beforeArrow} ${arrowMatch[0]} ${newAfter}`;
        }
        return newValue;
      }

      // No arrow yet - add based on side
      if (builderSide === 'reactant') {
        newValue = prev ? `${prev} + ${text}` : text;
      } else {
        // Need to add arrow first
        newValue = prev ? `${prev} -> ${text}` : `-> ${text}`;
      }
      return newValue;
    });

    // Parse the new value after state update
    setTimeout(() => parseText(newValue), 0);

    return newValue;
  }, [builderSide, parseText]);

  /**
   * Handle text input changes from EquationEditor
   */
  const handleTextChange = useCallback((text) => {
    setTextInput(text);
    parseText(text);
  }, [parseText]);

  /**
   * Handle element click from palette - insert element symbol
   */
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

  /**
   * Handle ion selection from palette
   */
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

  /**
   * Handle compound completion - insert formula into text
   */
  const handleCompoundComplete = useCallback((compound) => {
    insertIntoInput(compound.formula);
    setBuildingElements([]);
    setShowBuilder(false);
  }, [insertIntoInput]);

  /**
   * Quick insert common elements/compounds
   */
  const handleQuickInsert = useCallback((formula) => {
    insertIntoInput(formula);
  }, [insertIntoInput]);

  /**
   * Open compound builder modal
   */
  const openBuilder = useCallback((side) => {
    setBuilderSide(side);
    setBuildingElements([]);
    setShowBuilder(true);
  }, []);

  /**
   * Handle reset - clear text input too
   */
  const handleReset = useCallback(() => {
    setTextInput('');
    reset();
  }, [reset]);

  return (
    <div className="balancer-page text-white">
      <div className="px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-teal-400 mb-2">
            Equation Balancer
          </h1>
          <p className="text-gray-400">
            Enter a chemical equation to balance it automatically,
            or use the visual tools to build compounds.
          </p>
        </header>

        {/* Main Editor Card */}
        <Card className="bg-slate-800/50 border-slate-700 mb-6 w-fit">
          <div className="p-6">
            <EquationEditor
              equation={equation}
              coefficients={coefficients}
              parseError={parseError}
              isBalanced={isBalanced}
              onParseText={handleTextChange}
              onCoefficientChange={setCoefficient}
              onBalance={balance}
              onVerify={verify}
              onReset={handleReset}
              onArrowChange={setArrowType}
              onReorder={reorderCompound}
              onMove={moveCompound}
              onRemoveCompound={removeCompound}
              isLoading={isLoading}
              mode={mode}
              onModeChange={setMode}
              solution={solution}
              onSolutionChange={setSolution}
              onStartPractice={startPractice}
              textValue={textInput}
              onTextValueChange={setTextInput}
            />

            {/* Visual Tools Bar */}
            <div className="visual-tools mt-4 pt-4 border-t border-slate-700">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm text-gray-400">Build visually:</span>

                {/* Side selector */}
                <div className="flex rounded-lg overflow-hidden border border-slate-600">
                  <button
                    onClick={() => setBuilderSide('reactant')}
                    className={`px-3 py-1.5 text-sm transition-colors ${
                      builderSide === 'reactant'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                    }`}
                  >
                    Reactant
                  </button>
                  <button
                    onClick={() => setBuilderSide('product')}
                    className={`px-3 py-1.5 text-sm transition-colors ${
                      builderSide === 'product'
                        ? 'bg-green-600 text-white'
                        : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                    }`}
                  >
                    Product
                  </button>
                </div>

                {/* Open compound builder */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openBuilder(builderSide)}
                >
                  Compound Builder
                </Button>

                {/* Toggle element palette */}
                <Button
                  variant={showPalette ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setShowPalette(!showPalette)}
                >
                  {showPalette ? 'Hide' : 'Show'} Element Palette
                </Button>

                {/* Quick insert common items */}
                <div className="flex items-center gap-1 ml-auto flex-wrap">
                  <span className="text-xs text-gray-500 mr-2">Quick add:</span>
                  {['H2O', 'O2', 'CO2', 'H2', 'N2'].map(formula => (
                    <button
                      key={formula}
                      onClick={() => handleQuickInsert(formula)}
                      className="px-2 py-1 text-xs bg-slate-700 hover:bg-slate-600
                                 rounded transition-colors font-mono"
                    >
                      {formula}
                    </button>
                  ))}
                  <span className="text-gray-600 mx-1">|</span>
                  {/* Syntax helpers */}
                  {[
                    { char: '+', title: 'Plus (separate compounds)' },
                    { char: '->', title: 'Reaction arrow' },
                    { char: '^', title: 'Charge (e.g., Fe^2+)' },
                    { char: '(', title: 'Open parenthesis for groups' },
                    { char: ')', title: 'Close parenthesis' },
                  ].map(({ char, title }) => (
                    <button
                      key={char}
                      onClick={() => setTextInput(prev => prev + char)}
                      className="px-2 py-1 text-xs bg-slate-700 hover:bg-slate-600
                                 rounded transition-colors font-mono"
                      title={title}
                    >
                      {char}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Element Palette (collapsible) */}
        {showPalette && (
          <Card className="bg-slate-800/50 border-slate-700 mb-6 w-fit">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-300">Element Palette</h3>
                <p className="text-sm text-gray-500">
                  Click elements to build a compound, then use Compound Builder to add it
                </p>
              </div>
              <ElementPalette
                onElementSelect={handleElementSelect}
                onIonSelect={handleIonSelect}
                currentCompound={buildingElements}
                showFullTable={true}
              />

              {/* Show what's being built */}
              {buildingElements.length > 0 && (
                <div className="mt-4 p-3 bg-slate-700 rounded-lg flex items-center justify-between">
                  <div>
                    <span className="text-sm text-gray-400 mr-2">Building:</span>
                    <span className="font-mono text-lg">
                      {buildingElements.map(e =>
                        e.count > 1 ? `${e.symbol}${e.count}` : e.symbol
                      ).join('')}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        const formula = buildingElements.map(e =>
                          e.count > 1 ? `${e.symbol}${e.count}` : e.symbol
                        ).join('');
                        insertIntoInput(formula);
                        setBuildingElements([]);
                      }}
                    >
                      Add to {builderSide === 'reactant' ? 'Reactants' : 'Products'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const formula = buildingElements.map(e =>
                          e.count > 1 ? `${e.symbol}${e.count}` : e.symbol
                        ).join('');
                        insertIntoInput(formula);
                        setBuildingElements([]);
                      }}
                      title="Add compound and continue building another"
                    >
                      + Add More
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setBuildingElements([])}
                    >
                      Clear
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Compound Builder Modal */}
        <Modal show={showBuilder} onClose={() => setShowBuilder(false)}>
          <ModalHeader onClose={() => setShowBuilder(false)}>
            Build Compound ({builderSide === 'reactant' ? 'Reactant' : 'Product'})
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              {/* Mini element palette in modal */}
              <ElementPalette
                onElementSelect={handleElementSelect}
                onIonSelect={handleIonSelect}
                currentCompound={buildingElements}
                showFullTable={false}
              />

              {/* Compound builder */}
              <CompoundBuilder
                initialElements={buildingElements}
                side={builderSide}
                onCompoundComplete={(compound) => {
                  insertIntoInput(compound.formula);
                  setBuildingElements([]);
                  setShowBuilder(false);
                }}
                onCancel={() => {
                  setBuildingElements([]);
                  setShowBuilder(false);
                }}
              />
            </div>
          </ModalBody>
        </Modal>

        {/* Practice Mode */}
        {practiceMode && equation && (
          <Card className="bg-slate-800/50 border-slate-700 mb-6 w-fit">
            <div className="p-6">
              <PracticeMode
                equation={equation}
                solutionCoeffs={coefficients}
                onComplete={(result) => {
                  console.log('Practice complete:', result);
                  exitPractice();
                }}
                onExit={exitPractice}
              />
            </div>
          </Card>
        )}

        {/* Balance result - hide in practice mode */}
        {!practiceMode && (
          <BalanceResult
            equation={equation}
            coefficients={coefficients}
            balanceResult={balanceResult}
            elementInventory={elementInventory}
            validation={validation}
            error={error}
          />
        )}

        {/* Examples section */}
        <ExamplesSection onSelectExample={(eq) => {
          setTextInput(eq);
          parseText(eq);
        }} />
      </div>
    </div>
  );
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
    { name: 'Redox (Fe/Cu)', equation: 'Fe + Cu^2+ -> Fe^2+ + Cu', isRedox: true },
    { name: 'Redox (MnO4)', equation: 'MnO4^- + Fe^2+ -> Mn^2+ + Fe^3+', isRedox: true },
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
