/**
 * AST to React Renderer
 *
 * Converts a simplified AST into React components for interactive equation display.
 * Variables are rendered as either inputs (for known values) or symbols (for unknowns/constants).
 */
import React from 'react';
import { Fraction } from './components/Fraction.jsx';
import { Product } from './components/Product.jsx';
import { Power } from './components/Power.jsx';
import { Sqrt } from './components/Sqrt.jsx';
import { Parentheses } from './components/Parentheses.jsx';
import { FunctionCall } from './components/FunctionCall.jsx';
import { VariableInput } from './components/VariableInput.jsx';
import { VariableSymbol } from './components/VariableSymbol.jsx';

/**
 * Render a simplified AST node to React components
 *
 * @param {Object} node - AST node from simplify()
 * @param {Object} context - Rendering context
 * @param {Map<string, Object>} context.variableMap - Maps variable IDs to variable objects
 * @param {Set<string>} context.knownVarIds - Set of variable IDs that need input fields
 * @param {Object} context.inputValues - Current input values { varId: value }
 * @param {Function} context.onVariableChange - Callback for input changes (varId, value)
 * @param {Object} context.logConfig - Optional { numerator, denominator } for log replacement
 * @param {Object} context.selectedUnits - Optional selected units { varId: unitId }
 * @param {Function} context.onUnitChange - Optional callback for unit changes (varId, unitId)
 * @param {Function} context.getCompatibleUnitsFor - Optional function to get compatible units for a variable
 * @param {number} key - React key for this node
 */
export function renderNode(node, context, key = 0) {
  if (!node) return null;

  const {
    variableMap, knownVarIds, inputValues, onVariableChange, logConfig,
    selectedUnits, onUnitChange, getCompatibleUnitsFor
  } = context;

  switch (node.type) {
    case 'number':
      return <span key={key} className="eq-number">{node.value}</span>;

    case 'variable': {
      const varName = node.name;

      // Helper to get unit props for a variable
      const getUnitProps = (varId) => {
        if (!onUnitChange || !getCompatibleUnitsFor) return {};
        return {
          selectedUnit: selectedUnits?.[varId],
          compatibleUnits: getCompatibleUnitsFor(varId) || [],
          onUnitChange,
        };
      };

      // Special case: lnRatio gets replaced with ln(num/denom) display
      if (varName === 'lnRatio' && logConfig) {
        const numVar = variableMap.get(logConfig.numerator);
        const denomVar = variableMap.get(logConfig.denominator);

        // Build the log fraction with inputs
        const numNode = knownVarIds.has(logConfig.numerator)
          ? <VariableInput
              key={`${key}-num`}
              variable={numVar}
              value={inputValues[logConfig.numerator]}
              onChange={onVariableChange}
              size="small"
              {...getUnitProps(logConfig.numerator)}
            />
          : <VariableSymbol key={`${key}-num`} variable={numVar} />;

        const denomNode = knownVarIds.has(logConfig.denominator)
          ? <VariableInput
              key={`${key}-denom`}
              variable={denomVar}
              value={inputValues[logConfig.denominator]}
              onChange={onVariableChange}
              size="small"
              {...getUnitProps(logConfig.denominator)}
            />
          : <VariableSymbol key={`${key}-denom`} variable={denomVar} />;

        return (
          <span key={key} className="eq-log-ratio">
            <span className="eq-ln">ln</span>
            <Parentheses>
              <Fraction numerator={numNode} denominator={denomNode} />
            </Parentheses>
          </span>
        );
      }

      const variable = variableMap.get(varName);

      // If it's a known variable (needs input)
      if (knownVarIds.has(varName)) {
        return (
          <VariableInput
            key={key}
            variable={variable || { id: varName, name: varName, unit: '' }}
            value={inputValues[varName]}
            onChange={onVariableChange}
            {...getUnitProps(varName)}
          />
        );
      }

      // Otherwise it's unknown or constant - just display the symbol
      return (
        <VariableSymbol
          key={key}
          variable={variable || { id: varName, htmlSymbol: varName }}
        />
      );
    }

    case 'negate':
      return (
        <span key={key} className="eq-negate">
          <span className="eq-minus">−</span>
          {renderNode(node.child, context, `${key}-child`)}
        </span>
      );

    case 'add':
      return (
        <span key={key} className="eq-add">
          {renderNode(node.left, context, `${key}-left`)}
          <span className="eq-plus">+</span>
          {renderNode(node.right, context, `${key}-right`)}
        </span>
      );

    case 'subtract':
      return (
        <span key={key} className="eq-subtract">
          {renderNode(node.left, context, `${key}-left`)}
          <span className="eq-minus">−</span>
          {renderNode(node.right, context, `${key}-right`)}
        </span>
      );

    case 'product': {
      const factors = node.factors.map((f, i) => renderNode(f, context, `${key}-f${i}`));
      return <Product key={key} factors={factors} />;
    }

    case 'fraction': {
      const num = renderNode(node.numerator, context, `${key}-num`);
      const denom = renderNode(node.denominator, context, `${key}-denom`);
      return <Fraction key={key} numerator={num} denominator={denom} />;
    }

    case 'power': {
      const base = renderNode(node.base, context, `${key}-base`);
      const exp = renderNode(node.exponent, context, `${key}-exp`);
      return <Power key={key} base={base} exponent={exp} />;
    }

    case 'sqrt': {
      const child = renderNode(node.child, context, `${key}-child`);
      return <Sqrt key={key}>{child}</Sqrt>;
    }

    case 'function': {
      const arg = renderNode(node.argument, context, `${key}-arg`);
      return <FunctionCall key={key} name={node.name} argument={arg} />;
    }

    default:
      console.warn('Unknown AST node type:', node.type);
      return <span key={key} className="eq-unknown">[?]</span>;
  }
}

/**
 * Main render function - takes simplified AST and context, returns React element
 */
export function renderEquation(ast, context) {
  return renderNode(ast, context, 'root');
}

export default { renderNode, renderEquation };
