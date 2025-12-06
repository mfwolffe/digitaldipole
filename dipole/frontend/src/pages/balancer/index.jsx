/**
 * Equation Balancer Page
 *
 * Main page for the chemical equation balancer feature.
 * Provides text input, visual equation display, and auto-balancing.
 */

import React from 'react';
import { Card } from '../../components/ui/Card.jsx';
import { EquationEditor } from '../../balancer/components/EquationEditor.jsx';
import { BalanceResult } from '../../balancer/components/BalanceResult.jsx';
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
  } = useEquationBalancer();

  return (
    <div className="balancer-page min-h-screen bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
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

        {/* Main editor card */}
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
              isLoading={isLoading}
              mode={mode}
              onModeChange={setMode}
            />
          </div>
        </Card>

        {/* Balance result */}
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
