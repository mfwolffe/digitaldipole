/**
 * SolutionSteps Component
 *
 * Displays step-by-step solution with LaTeX equations.
 */
import React, { useEffect, useRef } from 'react';
import { Card, CardHeader, CardBody } from '../../components/ui';
import { typesetMath } from '../../utils/mathjax-loader';

export function SolutionSteps({ steps, className = '' }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      typesetMath([containerRef.current]);
    }
  }, [steps]);

  if (!steps || steps.length === 0) return null;

  return (
    <Card className={className}>
      <CardHeader>
        <strong>Solution Steps</strong>
      </CardHeader>
      <CardBody className="p-0">
        <ul ref={containerRef} className="divide-y divide-gray-100">
          {steps.map((step, index) => (
            <li key={index} className="px-4 py-3">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-gray-700 text-sm font-medium">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <div className="text-sm text-gray-500">{step.description}</div>
                  <div className="mt-1">{`$$${step.latex}$$`}</div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </CardBody>
    </Card>
  );
}

export default SolutionSteps;
