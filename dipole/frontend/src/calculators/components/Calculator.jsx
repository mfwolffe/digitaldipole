/**
 * Calculator Component
 *
 * Reusable calculator UI that works with any calculator definition.
 * Features inline equation inputs where variables appear within the rendered equation.
 * Supports unit selection and automatic reconciliation for unit-aware calculators.
 */
import React, { useEffect, useRef, useState } from 'react';
import { Button, Select, Alert, Spinner } from '../../components/ui';
import { useCalculator } from '../hooks/useCalculator';
import { EquationDisplay } from './EquationDisplay';
import { SolutionSteps } from './SolutionSteps';
import { InlineEquationInput } from './InlineEquationInput';
import { FavoriteButton } from '../../components/FavoriteButton';
import { UnitConverterDrawer } from '../../components/UnitConverterDrawer';
import { useUnitPreferences } from '../../contexts/UnitPreferencesContext';
import { typesetMath } from '../../utils/mathjax-loader';

export function Calculator({ calculatorId }) {
  // Get user's unit preferences from context
  const { preferredUnits } = useUnitPreferences();

  const {
    calculator,
    unknownVariable,
    inputValues,
    result,
    symbolicPreview,
    symbolicRaw,
    isLoading,
    error,
    knownVariables,
    setUnknownVariable,
    setVariable,
    solve,
    reset,
    // Unit-related state and actions
    selectedUnits,
    reconciliationSteps,
    setUnitForVariable,
    getCompatibleUnitsFor,
  } = useCalculator(calculatorId, { userPreferences: preferredUnits });

  const containerRef = useRef(null);
  const [converterOpen, setConverterOpen] = useState(false);

  // Determine which dimension to show in converter based on calculator
  const getRelevantDimension = () => {
    // Find the first variable with a dimension
    const dimVar = calculator?.variables.find(v => v.dimension);
    return dimVar?.dimension || 'pressure';
  };

  // Re-render MathJax when state changes (lazy-loaded)
  useEffect(() => {
    if (containerRef.current) {
      typesetMath([containerRef.current]);
    }
  }, [result, symbolicPreview, unknownVariable]);

  if (!calculator) {
    return (
      <Alert variant="warning">
        Calculator "{calculatorId}" not found in registry.
      </Alert>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    solve();
  };

  // Find the unknown variable object for display
  const unknownVar = calculator.variables.find(v => v.id === unknownVariable);

  return (
    <div className="calculator-container" ref={containerRef}>
      {/* Original equation display with favorite button and converter in header */}
      <div className="text-center mb-4 relative">
        <div className="absolute top-0 right-0 z-10 flex items-center gap-2">
          {/* Unit converter button */}
          <button
            onClick={() => setConverterOpen(true)}
            className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
            title="Open unit converter"
            aria-label="Open unit converter"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </button>
          <FavoriteButton equationName={calculatorId} size="xl" />
        </div>
        <EquationDisplay latex={calculator.latexEquation} />
      </div>

      {/* Unit Converter Drawer */}
      <UnitConverterDrawer
        isOpen={converterOpen}
        onClose={() => setConverterOpen(false)}
        initialDimension={getRelevantDimension()}
      />

      {/* Unknown variable selector with output unit */}
      <div className="flex justify-center items-center gap-2 mb-4 flex-wrap">
        <Select
          value={unknownVariable || ''}
          onChange={(e) => setUnknownVariable(e.target.value)}
          className="max-w-xs"
          aria-label="Select unknown variable"
        >
          <option value="">Select variable to solve for...</option>
          {calculator.variables
            .filter(v => !v.isConstant)
            .map(v => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))
          }
        </Select>

        {/* Output unit dropdown - show when unknown is selected and has a dimension */}
        {unknownVariable && unknownVar?.dimension && (
          <>
            <span className="text-gray-500 text-sm">in</span>
            <Select
              value={selectedUnits[unknownVariable] || ''}
              onChange={(e) => setUnitForVariable(unknownVariable, e.target.value)}
              className="w-24"
              aria-label="Select output unit"
            >
              {getCompatibleUnitsFor(unknownVariable).map(unit => (
                <option key={unit.id} value={unit.id}>
                  {unit.symbol}
                </option>
              ))}
            </Select>
          </>
        )}
      </div>

      {/* Show the inline equation form when an unknown is selected */}
      {unknownVariable && symbolicRaw && (
        <form onSubmit={handleSubmit}>
          {/* Constants display */}
          {calculator.variables
            .filter(v => v.isConstant && v.defaultValue !== undefined)
            .map(v => (
              <div key={v.id} className="text-center mb-2">
                <span className="text-sm text-gray-500">
                  <span dangerouslySetInnerHTML={{ __html: v.htmlSymbol }} />
                  {` = ${v.defaultValue} ${v.unit}`}
                  <span className="ml-2">({v.description})</span>
                </span>
              </div>
            ))
          }

          {/* Inline equation with inputs */}
          <InlineEquationInput
            symbolicRaw={symbolicRaw}
            symbolicLatex={symbolicPreview}
            unknownVariable={unknownVar}
            knownVariables={knownVariables}
            inputValues={inputValues}
            onVariableChange={setVariable}
            logConfig={calculator.logarithmic}
            // Unit selection props
            selectedUnits={selectedUnits}
            onUnitChange={setUnitForVariable}
            getCompatibleUnitsFor={getCompatibleUnitsFor}
          />

          {/* Error display */}
          {error && (
            <div className="mt-3 max-w-md mx-auto">
              <Alert variant="danger">
                {error}
              </Alert>
            </div>
          )}

          {/* Action buttons - compact row below equation */}
          <div className="flex justify-center items-center gap-3 mt-4">
            <FavoriteButton equationName={calculatorId} size="lg" className="mr-1" />
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading || !unknownVariable}
              loading={isLoading}
              className="px-5 py-2 text-sm flex-shrink-0"
            >
              {isLoading ? 'Solving...' : 'Solve'}
            </Button>
            <Button
              type="button"
              variant="outline-secondary"
              onClick={reset}
              className="px-5 py-2 text-sm flex-shrink-0"
            >
              Reset
            </Button>
          </div>

          {/* Result display */}
          {result?.success && (
            <div className="mt-4 max-w-md mx-auto">
              <Alert variant="success">
                <strong>Answer:</strong>
                <div className="mt-1 text-lg">
                  <span dangerouslySetInnerHTML={{ __html: unknownVar?.htmlSymbol || unknownVariable }} />
                  {' = '}
                  <strong>{(result.value ?? result.numericValue).toPrecision(6)}</strong>
                  {/* Use result.unit if available (from unit system), else fall back to variable.unit */}
                  {(result.unit || unknownVar?.unit) && ` ${result.unit || unknownVar.unit}`}
                </div>
                {/* Show reconciliation steps if any conversions happened */}
                {reconciliationSteps && reconciliationSteps.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-green-200 text-sm text-green-800">
                    <span className="font-medium">Unit conversions applied:</span>
                    <ul className="list-disc list-inside mt-1">
                      {reconciliationSteps.map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </Alert>
            </div>
          )}
        </form>
      )}

      {/* Prompt when no unknown selected */}
      {!unknownVariable && (
        <p className="text-center text-gray-500 mt-4">
          Select a variable to solve for to begin
        </p>
      )}

      {/* Solution steps (if available) */}
      {result?.success && result.steps && (
        <SolutionSteps steps={result.steps} className="mt-4 max-w-xl mx-auto" />
      )}
    </div>
  );
}

export default Calculator;
