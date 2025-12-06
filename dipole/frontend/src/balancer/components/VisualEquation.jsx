/**
 * VisualEquation - Full visual representation of a chemical equation
 *
 * Displays: Reactants → Products
 * With editable coefficients, compounds, and arrow type.
 */

import React from 'react';
import { ReactionSide } from './ReactionSide.jsx';
import { ArrowSelector, ReactionArrow } from './ArrowSelector.jsx';

export function VisualEquation({
  equation,
  editable = false,
  coefficients = {},
  onCoefficientChange,
  onRemoveCompound,
  onAddCompound,
  onArrowChange,
  className = '',
  size = 'md',
}) {
  if (!equation) {
    return (
      <div className={`visual-equation text-gray-500 italic ${className}`}>
        Enter an equation above
      </div>
    );
  }

  // Apply coefficients to compounds
  const reactantsWithCoeffs = equation.reactants.map(c => ({
    ...c,
    coefficient: coefficients[c.id] ?? c.coefficient ?? 1,
  }));

  const productsWithCoeffs = equation.products.map(c => ({
    ...c,
    coefficient: coefficients[c.id] ?? c.coefficient ?? 1,
  }));

  const sizeClasses = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-xl',
  };

  return (
    <div
      className={`visual-equation flex flex-wrap items-center justify-center
                 gap-2 p-4 bg-slate-800 rounded-lg ${sizeClasses[size]} ${className}`}
    >
      {/* Reactants */}
      <ReactionSide
        compounds={reactantsWithCoeffs}
        side="reactant"
        editable={editable}
        onCoefficientChange={onCoefficientChange}
        onRemoveCompound={onRemoveCompound}
        onAddCompound={onAddCompound}
      />

      {/* Arrow */}
      {editable ? (
        <ArrowSelector
          value={equation.arrowType}
          onChange={onArrowChange}
          editable={editable}
          size={size}
        />
      ) : (
        <ReactionArrow type={equation.arrowType} />
      )}

      {/* Products */}
      <ReactionSide
        compounds={productsWithCoeffs}
        side="product"
        editable={editable}
        onCoefficientChange={onCoefficientChange}
        onRemoveCompound={onRemoveCompound}
        onAddCompound={onAddCompound}
      />
    </div>
  );
}

/**
 * Compact equation display for lists/results
 */
export function EquationText({ equation, coefficients = {}, className = '' }) {
  if (!equation) return null;

  const formatSide = (compounds) => {
    return compounds.map((c, i) => {
      const coeff = coefficients[c.id] ?? c.coefficient ?? 1;
      const coeffStr = coeff > 1 ? coeff : '';
      const chargeStr = c.charge ? formatCharge(c.charge) : '';
      return `${i > 0 ? ' + ' : ''}${coeffStr}${c.formula}${chargeStr}`;
    }).join('');
  };

  const arrowMap = { '->': '→', '<->': '⇌', '=': '⇌' };
  const arrow = arrowMap[equation.arrowType] || '→';

  return (
    <span className={`equation-text font-mono ${className}`}>
      {formatSide(equation.reactants)} {arrow} {formatSide(equation.products)}
    </span>
  );
}

function formatCharge(charge) {
  if (charge === 0) return '';
  const abs = Math.abs(charge);
  const sign = charge > 0 ? '+' : '-';
  return `^${abs > 1 ? abs : ''}${sign}`;
}

export default VisualEquation;
