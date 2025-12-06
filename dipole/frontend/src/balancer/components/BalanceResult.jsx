/**
 * BalanceResult - Display balanced equation with steps and validation
 */

import React, { useState } from 'react';
import { VisualEquation } from './VisualEquation.jsx';
import { HalfReactionPanel } from './HalfReactionDisplay.jsx';
import { MatrixVisualizationPanel } from './MatrixVisualization.jsx';
import { Card } from '../../components/ui/Card.jsx';
import { Alert } from '../../components/ui/Alert.jsx';
import { Accordion, AccordionItem, AccordionHeader, AccordionBody } from '../../components/ui/Accordion.jsx';

export function BalanceResult({
  equation,
  coefficients,
  balanceResult,
  elementInventory,
  validation,
  error,
}) {
  const [showDetails, setShowDetails] = useState(false);

  if (error) {
    return (
      <Alert variant="danger" className="mt-4">
        <div className="flex items-start gap-2">
          <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="font-medium">Could not balance equation</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        </div>
      </Alert>
    );
  }

  if (!balanceResult) {
    return null;
  }

  const isValid = validation?.valid ?? false;

  return (
    <div className="balance-result space-y-4 mt-6">
      {/* Balanced equation display */}
      <Card className="bg-slate-800 border-slate-700">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-teal-400">
              Balanced Equation
            </h3>
            {isValid && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 text-sm rounded">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Verified
              </span>
            )}
          </div>
          <VisualEquation
            equation={equation}
            coefficients={coefficients}
            editable={false}
            size="lg"
          />
        </div>
      </Card>

      {/* Element inventory table */}
      <ElementInventoryTable
        inventory={elementInventory}
        isBalanced={isValid}
      />

      {/* Half-reactions for redox equations */}
      {balanceResult.isRedox && balanceResult.halfReactions && (
        <Card className="bg-slate-800 border-slate-700">
          <div className="p-4">
            <h3 className="text-lg font-semibold text-teal-400 mb-4">
              Half-Reaction Method
            </h3>
            <HalfReactionPanel
              halfReactions={balanceResult.halfReactions}
              solution={balanceResult.solution}
              showSteps={true}
            />
          </div>
        </Card>
      )}

      {/* Matrix Visualization (for molecular/ionic mode) */}
      {balanceResult.matrixData && (
        <Accordion>
          <AccordionItem eventKey="matrix">
            <AccordionHeader>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                Matrix Visualization
              </span>
            </AccordionHeader>
            <AccordionBody>
              <MatrixVisualizationPanel matrixData={balanceResult.matrixData} />
            </AccordionBody>
          </AccordionItem>
        </Accordion>
      )}

      {/* Balancing steps */}
      {balanceResult.steps && balanceResult.steps.length > 0 && (
        <Accordion>
          <AccordionItem eventKey="steps">
            <AccordionHeader>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                Balancing Steps
              </span>
            </AccordionHeader>
            <AccordionBody>
              <ol className="list-decimal list-inside space-y-2 text-gray-300">
                {balanceResult.steps.map((step, idx) => (
                  <li key={idx} className="pl-2">
                    <span className="font-medium text-teal-400">{step.description}</span>
                    {step.detail && (
                      <span className="text-gray-400 ml-2">— {step.detail}</span>
                    )}
                  </li>
                ))}
              </ol>
            </AccordionBody>
          </AccordionItem>
        </Accordion>
      )}
    </div>
  );
}

/**
 * Element inventory table showing atom counts on each side
 */
function ElementInventoryTable({ inventory, isBalanced }) {
  if (!inventory || inventory.length === 0) return null;

  return (
    <div className="element-inventory">
      <h4 className="text-sm font-medium text-gray-400 mb-2">Element Count</h4>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left py-2 px-3 text-gray-400">Element</th>
              <th className="text-center py-2 px-3 text-gray-400">Reactants</th>
              <th className="text-center py-2 px-3 text-gray-400">Products</th>
              <th className="text-center py-2 px-3 text-gray-400">Status</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) => (
              <tr key={item.element} className="border-b border-slate-800">
                <td className="py-2 px-3 font-medium">{item.element}</td>
                <td className="text-center py-2 px-3">{item.reactants}</td>
                <td className="text-center py-2 px-3">{item.products}</td>
                <td className="text-center py-2 px-3">
                  {item.balanced ? (
                    <span className="text-green-400">✓</span>
                  ) : (
                    <span className="text-red-400">✗</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BalanceResult;
