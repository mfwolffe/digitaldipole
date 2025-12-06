/**
 * SolutionSteps Component
 *
 * Displays step-by-step solution with LaTeX equations.
 */
import React, { useEffect, useRef } from 'react';
import { Card, ListGroup } from 'react-bootstrap';

export function SolutionSteps({ steps, className = '' }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current && window.MathJax) {
      window.MathJax.typesetClear([containerRef.current]);
      window.MathJax.typeset([containerRef.current]);
    }
  }, [steps]);

  if (!steps || steps.length === 0) return null;

  return (
    <Card className={`mt-3 ${className}`}>
      <Card.Header>
        <strong>Solution Steps</strong>
      </Card.Header>
      <ListGroup variant="flush" ref={containerRef}>
        {steps.map((step, index) => (
          <ListGroup.Item key={index}>
            <div className="d-flex align-items-start">
              <span className="badge bg-secondary me-2">{index + 1}</span>
              <div>
                <div className="text-muted small">{step.description}</div>
                <div className="mt-1">{`$$${step.latex}$$`}</div>
              </div>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Card>
  );
}

export default SolutionSteps;
