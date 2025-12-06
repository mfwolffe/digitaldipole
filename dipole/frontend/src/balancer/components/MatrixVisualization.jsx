/**
 * MatrixVisualization - Interactive display of Gaussian elimination steps
 *
 * Shows:
 * - Initial element matrix with compound labels
 * - Step-by-step row reduction operations
 * - RREF form with pivot positions highlighted
 * - Null space solution derivation
 */

import React, { useState } from 'react';
import { Button } from '../../components/ui/Button.jsx';

/**
 * Format a matrix cell value for display
 */
function formatCell(value) {
  if (Math.abs(value) < 1e-10) return '0';
  if (Math.abs(value - Math.round(value)) < 1e-10) {
    return Math.round(value).toString();
  }
  // Show fractions for common values
  const fractions = [
    [1/2, '½'], [1/3, '⅓'], [2/3, '⅔'], [1/4, '¼'], [3/4, '¾'],
    [1/5, '⅕'], [2/5, '⅖'], [3/5, '⅗'], [4/5, '⅘'],
  ];
  for (const [val, str] of fractions) {
    if (Math.abs(Math.abs(value) - val) < 1e-10) {
      return value < 0 ? `-${str}` : str;
    }
  }
  return value.toFixed(2);
}

/**
 * Single matrix display with optional highlighting
 */
function MatrixDisplay({ matrix, rowLabels, colLabels, highlight, pivotCols }) {
  if (!matrix || matrix.length === 0) return null;

  const highlightedRows = highlight?.rows || [];
  const pivotCell = highlight?.pivot;

  return (
    <div className="matrix-display overflow-x-auto">
      <table className="border-collapse">
        {/* Column headers (compound formulas) */}
        {colLabels && (
          <thead>
            <tr>
              <th className="p-1"></th>
              {colLabels.map((label, i) => (
                <th
                  key={i}
                  className={`p-2 text-xs font-mono text-center ${
                    pivotCols?.includes(i) ? 'text-teal-400' : 'text-gray-400'
                  }`}
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {matrix.map((row, rowIdx) => (
            <tr
              key={rowIdx}
              className={highlightedRows.includes(rowIdx) ? 'bg-teal-500/20' : ''}
            >
              {/* Row label (element symbol) */}
              {rowLabels && (
                <td className="p-2 text-xs font-medium text-gray-400 text-right pr-3">
                  {rowLabels[rowIdx]}
                </td>
              )}
              {/* Matrix cells */}
              {row.map((cell, colIdx) => {
                const isPivot = pivotCell?.row === rowIdx && pivotCell?.col === colIdx;
                const isPivotCol = pivotCols?.includes(colIdx);
                return (
                  <td
                    key={colIdx}
                    className={`
                      p-2 text-center font-mono text-sm min-w-[3rem]
                      border border-slate-600
                      ${isPivot ? 'bg-teal-500 text-white font-bold' : ''}
                      ${isPivotCol && !isPivot ? 'bg-slate-700' : 'bg-slate-800'}
                      ${Math.abs(cell) < 1e-10 ? 'text-gray-500' : 'text-gray-200'}
                    `}
                  >
                    {formatCell(cell)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Step-by-step matrix reduction viewer
 */
export function MatrixStepViewer({ matrixData }) {
  const [currentStep, setCurrentStep] = useState(0);

  if (!matrixData || !matrixData.reductionSteps) {
    return null;
  }

  const { reductionSteps, elements, compounds } = matrixData;
  const step = reductionSteps[currentStep];
  const totalSteps = reductionSteps.length;

  const goToStep = (idx) => {
    setCurrentStep(Math.max(0, Math.min(idx, totalSteps - 1)));
  };

  return (
    <div className="matrix-step-viewer space-y-4">
      {/* Step navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => goToStep(0)}
            disabled={currentStep === 0}
          >
            ⟨⟨
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => goToStep(currentStep - 1)}
            disabled={currentStep === 0}
          >
            ⟨
          </Button>
          <span className="px-3 text-sm text-gray-400">
            Step {currentStep + 1} of {totalSteps}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => goToStep(currentStep + 1)}
            disabled={currentStep === totalSteps - 1}
          >
            ⟩
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => goToStep(totalSteps - 1)}
            disabled={currentStep === totalSteps - 1}
          >
            ⟩⟩
          </Button>
        </div>

        {/* Step type badge */}
        <span className={`text-xs px-2 py-1 rounded ${getStepBadgeClass(step.type)}`}>
          {getStepTypeName(step.type)}
        </span>
      </div>

      {/* Step description */}
      <div className="p-3 bg-slate-700/50 rounded-lg">
        <p className="text-sm font-medium text-teal-400">{step.description}</p>
        {step.type === 'solution' && (
          <p className="text-xs text-gray-400 mt-1">
            Free variable{step.freeVars?.length > 1 ? 's' : ''}: {
              step.freeVars?.map(i => compounds[i]).join(', ')
            }
          </p>
        )}
      </div>

      {/* Matrix display */}
      {step.matrix && (
        <MatrixDisplay
          matrix={step.matrix}
          rowLabels={elements}
          colLabels={compounds}
          highlight={step.highlight}
          pivotCols={step.pivotCols}
        />
      )}

      {/* Solution display */}
      {step.type === 'solution' && step.solution && (
        <div className="solution-display p-3 bg-slate-700/50 rounded-lg">
          <p className="text-sm text-gray-400 mb-2">Coefficient vector:</p>
          <div className="flex flex-wrap gap-2">
            {step.solution.map((val, i) => (
              <div key={i} className="flex items-center gap-1 px-2 py-1 bg-slate-600 rounded">
                <span className="text-xs text-gray-400">{compounds[i]}:</span>
                <span className="font-mono text-teal-400">{formatCell(val)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Progress bar */}
      <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-teal-500 transition-all duration-200"
          style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
        />
      </div>
    </div>
  );
}

function getStepTypeName(type) {
  const names = {
    initial: 'Initial',
    swap: 'Row Swap',
    scale: 'Scale',
    eliminate: 'Eliminate',
    rref: 'RREF',
    solution: 'Solution',
  };
  return names[type] || type;
}

function getStepBadgeClass(type) {
  const classes = {
    initial: 'bg-slate-600 text-gray-300',
    swap: 'bg-purple-600 text-purple-100',
    scale: 'bg-blue-600 text-blue-100',
    eliminate: 'bg-orange-600 text-orange-100',
    rref: 'bg-green-600 text-green-100',
    solution: 'bg-teal-600 text-teal-100',
  };
  return classes[type] || 'bg-slate-600 text-gray-300';
}

/**
 * Compact matrix overview (initial + final)
 */
export function MatrixOverview({ matrixData }) {
  if (!matrixData) return null;

  const { initialMatrix, elements, compounds, finalCoefficients } = matrixData;

  return (
    <div className="matrix-overview space-y-4">
      <div>
        <h4 className="text-sm font-medium text-gray-400 mb-2">Element Matrix</h4>
        <p className="text-xs text-gray-500 mb-2">
          Rows = elements, Columns = compounds (reactants positive, products negative)
        </p>
        <MatrixDisplay
          matrix={initialMatrix}
          rowLabels={elements}
          colLabels={compounds}
        />
      </div>

      <div className="flex items-center gap-2 text-sm">
        <span className="text-gray-400">Solution:</span>
        <div className="flex flex-wrap gap-2">
          {finalCoefficients.map((coeff, i) => (
            <span key={i} className="px-2 py-1 bg-teal-600/30 text-teal-300 rounded font-mono">
              {coeff}{compounds[i]}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Full matrix visualization panel with toggle between overview and step-by-step
 */
export function MatrixVisualizationPanel({ matrixData }) {
  const [viewMode, setViewMode] = useState('overview'); // 'overview' | 'steps'

  if (!matrixData) return null;

  return (
    <div className="matrix-panel">
      {/* View toggle */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => setViewMode('overview')}
          className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
            viewMode === 'overview'
              ? 'bg-teal-600 text-white'
              : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setViewMode('steps')}
          className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
            viewMode === 'steps'
              ? 'bg-teal-600 text-white'
              : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
          }`}
        >
          Step-by-Step
        </button>
      </div>

      {/* Content */}
      {viewMode === 'overview' ? (
        <MatrixOverview matrixData={matrixData} />
      ) : (
        <MatrixStepViewer matrixData={matrixData} />
      )}
    </div>
  );
}

export default MatrixVisualizationPanel;
