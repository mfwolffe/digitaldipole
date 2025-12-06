/**
 * Calculator Component
 *
 * Reusable calculator UI that works with any calculator definition.
 * Features inline equation inputs where variables appear within the rendered equation.
 */
import React, { useEffect, useRef } from 'react';
import { Card, Form, Button, FormSelect, Alert, Spinner } from 'react-bootstrap';
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
      <div className="text-center mb-3">
        <EquationDisplay latex={calculator.latexEquation} />
      </div>

      {/* Unknown variable selector */}
      <div className="d-flex justify-content-center mb-3">
        <FormSelect
          value={unknownVariable || ''}
          onChange={(e) => setUnknownVariable(e.target.value)}
          className="calc-unknown-select"
          style={{ maxWidth: '280px' }}
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
        </FormSelect>
      </div>

      {/* Show the inline equation form when an unknown is selected */}
      {unknownVariable && symbolicRaw && (
        <Form onSubmit={handleSubmit}>
          {/* Constants display */}
          {calculator.variables
            .filter(v => v.isConstant && v.defaultValue !== undefined)
            .map(v => (
              <div key={v.id} className="text-center mb-2">
                <small className="text-muted">
                  <span dangerouslySetInnerHTML={{ __html: v.htmlSymbol }} />
                  {` = ${v.defaultValue} ${v.unit}`}
                  <span className="ms-2">({v.description})</span>
                </small>
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
          />

          {/* Error display */}
          {error && (
            <Alert variant="danger" className="mt-2 py-2 mx-auto" style={{ maxWidth: '400px' }}>
              {error}
            </Alert>
          )}

          {/* Action buttons */}
          <div className="d-flex justify-content-center gap-2 mt-3">
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading || !unknownVariable}
            >
              {isLoading ? (
                <>
                  <Spinner size="sm" className="me-1" />
                  Solving...
                </>
              ) : (
                'Solve!'
              )}
            </Button>
            <Button
              type="button"
              variant="outline-secondary"
              onClick={reset}
            >
              Reset
            </Button>
          </div>

          {/* Result display */}
          {result?.success && (
            <Alert variant="success" className="mt-3 mx-auto" style={{ maxWidth: '400px' }}>
              <strong>Answer:</strong>
              <div className="mt-1 fs-5">
                <span dangerouslySetInnerHTML={{ __html: unknownVar?.htmlSymbol || unknownVariable }} />
                {' = '}
                <strong>{result.numericValue.toPrecision(6)}</strong>
                {unknownVar?.unit && ` ${unknownVar.unit}`}
              </div>
            </Alert>
          )}
        </Form>
      )}

      {/* Prompt when no unknown selected */}
      {!unknownVariable && (
        <p className="text-center text-muted mt-3">
          Select a variable to solve for to begin
        </p>
      )}

      {/* Solution steps (if available) */}
      {result?.success && result.steps && (
        <SolutionSteps steps={result.steps} className="mt-3 mx-auto" style={{ maxWidth: '600px' }} />
      )}
    </div>
  );
}

export default Calculator;
