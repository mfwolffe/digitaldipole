/**
 * HalfReactionDisplay - Shows oxidation and reduction half-reactions
 *
 * Displays:
 * - Oxidation state changes
 * - Balanced half-reactions with steps
 * - Electron transfer visualization
 */

import React from 'react';
import { toSuperscript } from './ChargeIndicator.jsx';

/**
 * Display oxidation state changes for an element
 */
export function OxidationStateChange({ element, from, to, type }) {
  const arrow = type === 'oxidation' ? '↑' : '↓';
  const color = type === 'oxidation' ? 'text-red-400' : 'text-blue-400';
  const label = type === 'oxidation' ? 'Oxidation' : 'Reduction';

  const formatState = (state) => {
    if (state === 0) return '0';
    return state > 0 ? `+${state}` : `${state}`;
  };

  return (
    <div className={`oxidation-change inline-flex items-center gap-2 px-3 py-1.5
                     bg-slate-700 rounded-lg ${color}`}>
      <span className="font-medium">{element}</span>
      <span className="text-gray-400 text-sm">{formatState(from)}</span>
      <span className="text-lg">{arrow}</span>
      <span className="text-gray-400 text-sm">{formatState(to)}</span>
      <span className="text-xs bg-slate-600 px-2 py-0.5 rounded">
        {label}
      </span>
    </div>
  );
}

/**
 * Display a single half-reaction with its balancing steps
 */
export function HalfReaction({ halfReaction, multiplier = 1, showSteps = true }) {
  const { type, element, reactants, products, steps, electronCount } = halfReaction;
  const isOxidation = type === 'oxidation';

  const formatCompound = (compound) => {
    const coeff = (compound.coefficient || 1) * multiplier;
    const coeffStr = coeff > 1 ? coeff : '';

    // Handle electrons specially
    if (compound.isElectron || compound.formula === 'e-') {
      return (
        <span className="text-yellow-400">
          {coeffStr}e<sup>−</sup>
        </span>
      );
    }

    // Format with subscripts and charges
    let formula = compound.formula || '';

    // Simple formatting for common species
    if (formula === 'H2O') {
      return <span>{coeffStr}H<sub>2</sub>O</span>;
    }
    if (formula === 'H+') {
      return <span>{coeffStr}H<sup>+</sup></span>;
    }
    if (formula === 'OH-') {
      return <span>{coeffStr}OH<sup>−</sup></span>;
    }

    // Generic formula display
    return <span>{coeffStr}{formula}</span>;
  };

  const formatSide = (compounds) => {
    return compounds.map((c, i) => (
      <React.Fragment key={c.id || i}>
        {i > 0 && <span className="mx-2 text-gray-500">+</span>}
        {formatCompound(c)}
      </React.Fragment>
    ));
  };

  return (
    <div className={`half-reaction p-4 rounded-lg ${
      isOxidation ? 'bg-red-900/20 border border-red-800/30' : 'bg-blue-900/20 border border-blue-800/30'
    }`}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <span className={`text-sm font-medium px-2 py-0.5 rounded ${
          isOxidation ? 'bg-red-700 text-red-100' : 'bg-blue-700 text-blue-100'
        }`}>
          {isOxidation ? 'Oxidation' : 'Reduction'}
        </span>
        <span className="text-gray-400 text-sm">
          {element} loses {electronCount}e⁻
        </span>
        {multiplier > 1 && (
          <span className="text-gray-500 text-sm">
            (×{multiplier})
          </span>
        )}
      </div>

      {/* Equation */}
      <div className="equation font-mono text-lg flex items-center flex-wrap gap-1">
        <span className="text-gray-200">
          {formatSide(reactants)}
        </span>
        <span className="mx-3 text-teal-400">→</span>
        <span className="text-gray-200">
          {formatSide(products)}
        </span>
      </div>

      {/* Steps */}
      {showSteps && steps && steps.length > 0 && (
        <div className="steps mt-3 pl-4 border-l-2 border-slate-600">
          {steps.map((step, i) => (
            <div key={i} className="text-sm text-gray-400 py-0.5">
              <span className="text-gray-500">{i + 1}.</span>{' '}
              <span className="text-gray-300">{step.action}:</span>{' '}
              {step.detail}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Display electron transfer between half-reactions
 */
export function ElectronTransfer({ oxidation, reduction }) {
  const oxElectrons = oxidation.electronCount * (oxidation.multiplier || 1);
  const redElectrons = reduction.electronCount * (reduction.multiplier || 1);

  return (
    <div className="electron-transfer flex items-center justify-center py-4">
      <div className="flex items-center gap-4 px-6 py-3 bg-slate-700/50 rounded-lg">
        <span className="text-red-400 font-medium">
          {oxidation.element}
        </span>
        <div className="flex flex-col items-center">
          <span className="text-yellow-400 text-2xl">
            {oxElectrons}e<sup>−</sup>
          </span>
          <div className="flex items-center gap-1 text-gray-500">
            <span>→</span>
          </div>
        </div>
        <span className="text-blue-400 font-medium">
          {reduction.element}
        </span>
      </div>
    </div>
  );
}

/**
 * Full half-reaction display panel
 */
export function HalfReactionPanel({
  halfReactions,
  solution = 'acidic',
  showSteps = true,
}) {
  if (!halfReactions) return null;

  const { oxidation, reduction } = halfReactions;

  return (
    <div className="half-reaction-panel space-y-4">
      {/* Solution type indicator */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-gray-400">Solution:</span>
        <span className={`px-2 py-0.5 rounded ${
          solution === 'acidic'
            ? 'bg-orange-700/30 text-orange-300'
            : 'bg-purple-700/30 text-purple-300'
        }`}>
          {solution === 'acidic' ? 'Acidic (H⁺)' : 'Basic (OH⁻)'}
        </span>
      </div>

      {/* Half-reactions */}
      <div className="grid gap-4 md:grid-cols-2">
        <HalfReaction
          halfReaction={oxidation}
          multiplier={oxidation.multiplier}
          showSteps={showSteps}
        />
        <HalfReaction
          halfReaction={reduction}
          multiplier={reduction.multiplier}
          showSteps={showSteps}
        />
      </div>

      {/* Electron transfer visualization */}
      <ElectronTransfer oxidation={oxidation} reduction={reduction} />

      {/* Combined equation note */}
      <div className="text-center text-sm text-gray-400">
        Electrons cancel when half-reactions are added together
      </div>
    </div>
  );
}

/**
 * Oxidation state summary table
 */
export function OxidationStateSummary({ changes }) {
  if (!changes || changes.length === 0) return null;

  return (
    <div className="oxidation-summary">
      <h4 className="text-sm font-medium text-gray-300 mb-2">
        Oxidation State Changes
      </h4>
      <div className="flex flex-wrap gap-2">
        {changes.map((change, i) => (
          <OxidationStateChange
            key={i}
            element={change.element}
            from={change.from}
            to={change.to}
            type={change.type}
          />
        ))}
      </div>
    </div>
  );
}

export default HalfReactionPanel;
