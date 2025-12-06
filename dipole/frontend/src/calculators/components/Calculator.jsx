/**
 * Calculator Component
 *
 * Reusable calculator UI that works with any calculator definition.
 * Features inline equation inputs where variables appear within the rendered equation.
 */
import React, { useEffect, useRef } from 'react';
import { Button, Select, Alert, Spinner } from '../../components/ui';
import { useCalculator } from '../hooks/useCalculator';
import { EquationDisplay } from './EquationDisplay';
import { SolutionSteps } from './SolutionSteps';
import { InlineEquationInput } from './InlineEquationInput';

export function Calculator({ calculatorId }) {
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
    reset
  } = useCalculator(calculatorId);

  const containerRef = useRef(null);

  // Re-render MathJax when state changes
  useEffect(() => {
    if (containerRef.current && window.MathJax) {
      window.MathJax.typesetClear([containerRef.current]);
      window.MathJax.typeset([containerRef.current]);
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
      {/* Original equation display */}
      <div className="text-center mb-4">
        <EquationDisplay latex={calculator.latexEquation} />
      </div>

      {/* Unknown variable selector */}
      <div className="flex justify-center mb-4">
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
                  <strong>{result.numericValue.toPrecision(6)}</strong>
                  {unknownVar?.unit && ` ${unknownVar.unit}`}
                </div>
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
