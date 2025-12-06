/**
 * InlineEquationInput Component
 *
 * Renders an equation with inline input fields embedded where variables should be entered.
 * Displays as a proper fraction with inputs in numerator and denominator.
 */
import React, { useEffect, useRef } from 'react';
import { Form } from 'react-bootstrap';

/**
 * Parse nerdamer raw expression into numerator and denominator variable lists
 * Input format: "P1^(-1)*P2*V2" means (P2*V2)/P1
 */
function parseNerdamerExpression(rawExpr, knownVariables) {
  if (!rawExpr || !knownVariables.length) {
    return { numerator: [], denominator: [] };
  }

  const varMap = new Map(knownVariables.map(v => [v.id, v]));
  const numerator = [];
  const denominator = [];

  // Split by * and analyze each part
  const parts = rawExpr.split('*');

  parts.forEach(part => {
    // Check for ^(-1) indicating denominator
    const invMatch = part.match(/^(.+)\^\(-1\)$/);
    if (invMatch) {
      const varId = invMatch[1];
      if (varMap.has(varId)) {
        denominator.push(varMap.get(varId));
      }
    } else {
      // Regular variable (numerator)
      if (varMap.has(part)) {
        numerator.push(varMap.get(part));
      }
    }
  });

  return { numerator, denominator };
}

/**
 * Small inline input that fits within the equation flow
 */
function InlineInput({ variable, value, onChange }) {
  return (
    <span className="inline-eq-input-wrapper">
      <Form.Control
        type="number"
        step="any"
        value={value}
        onChange={(e) => onChange(variable.id, e.target.value)}
        placeholder={variable.htmlSymbol.replace(/<[^>]*>/g, '')}
        className="inline-eq-input"
        aria-label={variable.name}
        title={`${variable.name} (${variable.unit})`}
      />
      <span className="inline-eq-unit">{variable.unit}</span>
    </span>
  );
}

/**
 * Render a row of variables with multiplication between them
 */
function VariableRow({ variables, inputValues, onVariableChange }) {
  return (
    <span className="inline-eq-var-row">
      {variables.map((v, i) => (
        <React.Fragment key={v.id}>
          {i > 0 && <span className="inline-eq-multiply">×</span>}
          <InlineInput
            variable={v}
            value={inputValues[v.id] || ''}
            onChange={onVariableChange}
          />
        </React.Fragment>
      ))}
    </span>
  );
}

export function InlineEquationInput({
  symbolicRaw,
  unknownVariable,
  knownVariables,
  inputValues,
  onVariableChange
}) {
  const containerRef = useRef(null);

  // Re-render MathJax for the unknown symbol
  useEffect(() => {
    if (containerRef.current && window.MathJax) {
      window.MathJax.typesetClear([containerRef.current]);
      window.MathJax.typeset([containerRef.current]);
    }
  }, [unknownVariable]);

  if (!symbolicRaw || !unknownVariable) {
    return null;
  }

  const { numerator, denominator } = parseNerdamerExpression(symbolicRaw, knownVariables);

  // Get the unknown variable display symbol (LaTeX format for MathJax)
  const unknownSymbol = unknownVariable.symbol || unknownVariable.id;

  // If no variables parsed, show a message
  if (numerator.length === 0 && denominator.length === 0) {
    return (
      <div className="inline-equation-container text-center text-muted">
        Enter values for the known variables
      </div>
    );
  }

  const hasFraction = denominator.length > 0;

  return (
    <div className="inline-equation-container" ref={containerRef}>
      <div className="inline-equation">
        {/* Unknown variable on the left - rendered with MathJax */}
        <span className="inline-eq-unknown">{`$$${unknownSymbol}$$`}</span>
        <span className="inline-eq-equals">=</span>

        {/* Right side - fraction or simple expression */}
        {hasFraction ? (
          <div className="inline-eq-fraction">
            <div className="inline-eq-numerator">
              <VariableRow
                variables={numerator}
                inputValues={inputValues}
                onVariableChange={onVariableChange}
              />
            </div>
            <div className="inline-eq-fraction-bar"></div>
            <div className="inline-eq-denominator">
              <VariableRow
                variables={denominator}
                inputValues={inputValues}
                onVariableChange={onVariableChange}
              />
            </div>
          </div>
        ) : (
          <VariableRow
            variables={numerator}
            inputValues={inputValues}
            onVariableChange={onVariableChange}
          />
        )}
      </div>
    </div>
  );
}

export default InlineEquationInput;
