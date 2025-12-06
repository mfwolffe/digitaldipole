/**
 * PracticeMode - Interactive practice for balancing equations
 *
 * Features:
 * - Manual coefficient entry
 * - Real-time element count feedback
 * - Progressive hints without revealing answer
 * - Verification with detailed feedback
 */

import React, { useState, useCallback, useMemo } from 'react';
import { CompoundDisplay } from './CompoundDisplay.jsx';
import { CoefficientInput } from './CoefficientInput.jsx';
import { ReactionArrow } from './ArrowSelector.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Alert } from '../../components/ui/Alert.jsx';
import { getElementInventory } from '../utils/validation.js';
import { getAllElements } from '../utils/chemicalParser.js';

/**
 * Generate progressive hints for balancing
 */
function generateHints(equation, coefficients, solutionCoeffs) {
  const hints = [];
  const elements = getAllElements(equation);
  const inventory = getElementInventory(equation, coefficients);

  // Find unbalanced elements
  const unbalanced = inventory.filter(item => !item.balanced);

  if (unbalanced.length === 0) {
    return [{ level: 'success', message: 'All elements are balanced! Click Verify to confirm.' }];
  }

  // Hint 1: Which elements are unbalanced
  hints.push({
    level: 1,
    message: `Focus on balancing: ${unbalanced.map(u => u.element).join(', ')}`,
  });

  // Hint 2: Which element to start with (one that appears in fewest compounds)
  const elementCounts = {};
  for (const elem of elements) {
    elementCounts[elem] = 0;
    for (const compound of [...equation.reactants, ...equation.products]) {
      if (compound.elements.some(e => e.symbol === elem)) {
        elementCounts[elem]++;
      }
    }
  }

  const rareElement = unbalanced.reduce((min, item) =>
    (elementCounts[item.element] < elementCounts[min.element]) ? item : min
  );

  hints.push({
    level: 2,
    message: `Try balancing ${rareElement.element} first - it appears in the fewest compounds.`,
  });

  // Hint 3: Specific direction
  const diff = rareElement.reactants - rareElement.products;
  if (diff > 0) {
    hints.push({
      level: 3,
      message: `You have ${rareElement.reactants} ${rareElement.element} in reactants but only ${rareElement.products} in products. Increase a product coefficient.`,
    });
  } else {
    hints.push({
      level: 3,
      message: `You have ${rareElement.products} ${rareElement.element} in products but only ${rareElement.reactants} in reactants. Increase a reactant coefficient.`,
    });
  }

  // Hint 4: Which compound to adjust (without giving exact number)
  if (solutionCoeffs) {
    const allCompounds = [...equation.reactants, ...equation.products];
    for (const compound of allCompounds) {
      const current = coefficients[compound.id] || 1;
      const correct = solutionCoeffs[compound.id] || 1;
      if (current !== correct) {
        const direction = current < correct ? 'increase' : 'decrease';
        hints.push({
          level: 4,
          message: `Try to ${direction} the coefficient for ${compound.formula}.`,
        });
        break;
      }
    }
  }

  return hints;
}

/**
 * Practice mode equation display with editable coefficients
 */
export function PracticeEquation({
  equation,
  coefficients,
  onCoefficientChange,
}) {
  if (!equation) return null;

  return (
    <div className="practice-equation flex flex-wrap items-center justify-center gap-3 p-4 bg-slate-800 rounded-lg">
      {/* Reactants */}
      <div className="flex flex-wrap items-center gap-2">
        {equation.reactants.map((compound, idx) => (
          <React.Fragment key={compound.id}>
            {idx > 0 && <span className="text-xl text-gray-400">+</span>}
            <div className="flex items-center gap-1">
              <CoefficientInput
                value={coefficients[compound.id] || 1}
                onChange={(val) => onCoefficientChange(compound.id, val)}
                editable={true}
                size="lg"
              />
              <CompoundDisplay compound={compound} editable={false} />
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* Arrow */}
      <ReactionArrow type={equation.arrowType || '->'} />

      {/* Products */}
      <div className="flex flex-wrap items-center gap-2">
        {equation.products.map((compound, idx) => (
          <React.Fragment key={compound.id}>
            {idx > 0 && <span className="text-xl text-gray-400">+</span>}
            <div className="flex items-center gap-1">
              <CoefficientInput
                value={coefficients[compound.id] || 1}
                onChange={(val) => onCoefficientChange(compound.id, val)}
                editable={true}
                size="lg"
              />
              <CompoundDisplay compound={compound} editable={false} />
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

/**
 * Live element balance indicator
 */
export function ElementBalanceIndicator({ equation, coefficients }) {
  const inventory = useMemo(() => {
    if (!equation) return [];
    return getElementInventory(equation, coefficients);
  }, [equation, coefficients]);

  if (inventory.length === 0) return null;

  const allBalanced = inventory.every(item => item.balanced);

  return (
    <div className="element-balance-indicator">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-400">Element Balance</span>
        {allBalanced && (
          <span className="text-sm text-green-400 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            All balanced!
          </span>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {inventory.map((item) => (
          <div
            key={item.element}
            className={`flex items-center justify-between p-2 rounded ${
              item.balanced
                ? 'bg-green-900/30 border border-green-700/50'
                : 'bg-red-900/30 border border-red-700/50'
            }`}
          >
            <span className="font-medium">{item.element}</span>
            <div className="flex items-center gap-2 text-sm">
              <span className={item.balanced ? 'text-green-400' : 'text-gray-300'}>
                {item.reactants}
              </span>
              <span className="text-gray-500">=</span>
              <span className={item.balanced ? 'text-green-400' : 'text-gray-300'}>
                {item.products}
              </span>
              {item.balanced ? (
                <span className="text-green-400">✓</span>
              ) : (
                <span className="text-red-400">✗</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Hint display with progressive reveal
 */
export function HintPanel({ hints, currentLevel, onRequestHint }) {
  const visibleHints = hints.filter(h => h.level <= currentLevel);
  const hasMoreHints = hints.some(h => h.level > currentLevel);

  return (
    <div className="hint-panel p-4 bg-amber-900/20 border border-amber-700/30 rounded-lg">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-amber-400">Hints</span>
        {hasMoreHints && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRequestHint}
            className="text-amber-400 hover:text-amber-300"
          >
            Need more help?
          </Button>
        )}
      </div>
      {visibleHints.length === 0 ? (
        <p className="text-sm text-gray-400">
          Click "Need more help?" to get a hint.
        </p>
      ) : (
        <ul className="space-y-2">
          {visibleHints.map((hint, idx) => (
            <li key={idx} className="text-sm text-amber-200 flex items-start gap-2">
              <span className="text-amber-500 mt-0.5">💡</span>
              {hint.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/**
 * Main practice mode component
 */
export function PracticeMode({
  equation,
  solutionCoeffs,
  onComplete,
  onExit,
}) {
  // User's current coefficients (start with all 1s)
  const [coefficients, setCoefficients] = useState(() => {
    const initial = {};
    if (equation) {
      for (const c of [...equation.reactants, ...equation.products]) {
        initial[c.id] = 1;
      }
    }
    return initial;
  });

  const [hintLevel, setHintLevel] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Generate hints based on current state
  const hints = useMemo(() => {
    if (!equation) return [];
    return generateHints(equation, coefficients, solutionCoeffs);
  }, [equation, coefficients, solutionCoeffs]);

  const handleCoefficientChange = useCallback((compoundId, value) => {
    setCoefficients(prev => ({ ...prev, [compoundId]: value }));
    setShowResult(false); // Clear previous result when user makes changes
  }, []);

  const handleVerify = useCallback(() => {
    setAttempts(prev => prev + 1);
    const inventory = getElementInventory(equation, coefficients);
    const balanced = inventory.every(item => item.balanced);
    setIsCorrect(balanced);
    setShowResult(true);

    if (balanced && onComplete) {
      onComplete({ attempts: attempts + 1, coefficients });
    }
  }, [equation, coefficients, attempts, onComplete]);

  const handleRequestHint = useCallback(() => {
    setHintLevel(prev => Math.min(prev + 1, 4));
  }, []);

  const handleReset = useCallback(() => {
    const reset = {};
    for (const c of [...equation.reactants, ...equation.products]) {
      reset[c.id] = 1;
    }
    setCoefficients(reset);
    setHintLevel(0);
    setShowResult(false);
  }, [equation]);

  const handleShowAnswer = useCallback(() => {
    if (solutionCoeffs) {
      setCoefficients({ ...solutionCoeffs });
      setShowResult(true);
      setIsCorrect(true);
    }
  }, [solutionCoeffs]);

  if (!equation) return null;

  return (
    <div className="practice-mode space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-teal-400">Practice Mode</h3>
          <p className="text-sm text-gray-400">
            Adjust the coefficients to balance the equation
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            Attempts: {attempts}
          </span>
          {onExit && (
            <Button variant="ghost" size="sm" onClick={onExit}>
              Exit Practice
            </Button>
          )}
        </div>
      </div>

      {/* Equation with editable coefficients */}
      <PracticeEquation
        equation={equation}
        coefficients={coefficients}
        onCoefficientChange={handleCoefficientChange}
      />

      {/* Live element balance */}
      <ElementBalanceIndicator
        equation={equation}
        coefficients={coefficients}
      />

      {/* Result feedback */}
      {showResult && (
        <Alert variant={isCorrect ? 'success' : 'warning'}>
          {isCorrect ? (
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Correct! The equation is balanced.</span>
              {attempts === 1 && <span className="text-green-300 ml-2">First try!</span>}
            </div>
          ) : (
            <div>
              <p>Not quite balanced yet. Check the element counts above.</p>
              {attempts >= 3 && hintLevel < 2 && (
                <p className="text-sm mt-1">Consider using a hint to help guide you.</p>
              )}
            </div>
          )}
        </Alert>
      )}

      {/* Hints section */}
      {!isCorrect && (
        <HintPanel
          hints={hints}
          currentLevel={hintLevel}
          onRequestHint={handleRequestHint}
        />
      )}

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3">
        <Button
          variant="primary"
          onClick={handleVerify}
          disabled={isCorrect}
        >
          Verify
        </Button>
        <Button
          variant="outline"
          onClick={handleReset}
        >
          Reset
        </Button>
        {attempts >= 5 && !isCorrect && (
          <Button
            variant="ghost"
            onClick={handleShowAnswer}
            className="text-gray-400"
          >
            Show Answer
          </Button>
        )}
      </div>

      {/* Keyboard hint */}
      <p className="text-xs text-gray-600">
        Tip: Use arrow keys or type numbers directly in coefficient boxes
      </p>
    </div>
  );
}

export default PracticeMode;
