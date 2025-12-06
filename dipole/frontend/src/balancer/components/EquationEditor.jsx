/**
 * EquationEditor - Main editor component for equation balancer
 *
 * Combines text input with visual equation display.
 * Hybrid approach: type text -> see visual, edit visual -> update text.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { VisualEquation } from './VisualEquation.jsx';
import { Input, Label, ErrorMessage } from '../../components/ui/Form.jsx';
import { Button } from '../../components/ui/Button.jsx';

export function EquationEditor({
  equation,
  coefficients,
  parseError,
  isBalanced,
  onParseText,
  onCoefficientChange,
  onBalance,
  onVerify,
  onReset,
  onArrowChange,
  isLoading,
  mode,
  onModeChange,
}) {
  const [textInput, setTextInput] = useState('');
  const [hasEdited, setHasEdited] = useState(false);

  // Debounced parse
  const [parseTimer, setParseTimer] = useState(null);

  const handleTextChange = useCallback((e) => {
    const text = e.target.value;
    setTextInput(text);
    setHasEdited(true);

    // Clear existing timer
    if (parseTimer) clearTimeout(parseTimer);

    // Set new timer for debounced parsing
    const timer = setTimeout(() => {
      onParseText(text);
    }, 300);

    setParseTimer(timer);
  }, [onParseText, parseTimer]);

  // Parse immediately on blur
  const handleBlur = useCallback(() => {
    if (parseTimer) {
      clearTimeout(parseTimer);
      setParseTimer(null);
    }
    onParseText(textInput);
  }, [textInput, onParseText, parseTimer]);

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      onBalance();
    }
  }, [onBalance]);

  // Clear timer on unmount
  useEffect(() => {
    return () => {
      if (parseTimer) clearTimeout(parseTimer);
    };
  }, [parseTimer]);

  const handleReset = useCallback(() => {
    setTextInput('');
    setHasEdited(false);
    onReset();
  }, [onReset]);

  const handleVerify = useCallback(() => {
    const result = onVerify();
    if (result.valid) {
      alert('Equation is balanced!');
    } else {
      alert(`Not balanced:\n${result.errors?.join('\n') || result.error}`);
    }
  }, [onVerify]);

  return (
    <div className="equation-editor space-y-4">
      {/* Text input */}
      <div className="text-input-section">
        <Label htmlFor="equation-input">
          Enter Chemical Equation
        </Label>
        <Input
          id="equation-input"
          type="text"
          value={textInput}
          onChange={handleTextChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder="e.g., CH4 + O2 -> CO2 + H2O"
          error={parseError}
          className="font-mono text-lg bg-slate-800 text-white border-slate-600
                     placeholder-slate-500 focus:border-teal-500"
          autoComplete="off"
          spellCheck={false}
        />
        {parseError && <ErrorMessage>{parseError}</ErrorMessage>}
        <p className="text-xs text-gray-500 mt-1">
          Use element symbols (H, O, Ca), numbers for subscripts (H2O),
          and ^ for charges (Fe^3+). Arrows: -&gt; or =
        </p>
      </div>

      {/* Mode selector */}
      <div className="mode-section flex items-center gap-4">
        <span className="text-sm text-gray-400">Mode:</span>
        <label className="inline-flex items-center">
          <input
            type="radio"
            name="mode"
            value="molecular"
            checked={mode === 'molecular'}
            onChange={() => onModeChange('molecular')}
            className="form-radio text-teal-500"
          />
          <span className="ml-2 text-sm">Molecular</span>
        </label>
        <label className="inline-flex items-center">
          <input
            type="radio"
            name="mode"
            value="ionic"
            checked={mode === 'ionic'}
            onChange={() => onModeChange('ionic')}
            className="form-radio text-teal-500"
          />
          <span className="ml-2 text-sm">Ionic</span>
        </label>
      </div>

      {/* Visual equation display */}
      {equation && (
        <div className="visual-section">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Visual Preview:</span>
            {isBalanced && (
              <span className="text-sm text-green-400 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Balanced
              </span>
            )}
          </div>
          <VisualEquation
            equation={equation}
            coefficients={coefficients}
            editable={true}
            onCoefficientChange={onCoefficientChange}
            onArrowChange={onArrowChange}
          />
        </div>
      )}

      {/* Action buttons */}
      <div className="actions-section flex flex-wrap gap-3">
        <Button
          variant="primary"
          onClick={onBalance}
          disabled={!equation || isLoading}
          loading={isLoading}
        >
          Balance
        </Button>

        <Button
          variant="outline"
          onClick={handleVerify}
          disabled={!equation}
        >
          Verify
        </Button>

        <Button
          variant="ghost"
          onClick={handleReset}
          disabled={!hasEdited && !equation}
        >
          Clear
        </Button>
      </div>

      {/* Keyboard shortcut hint */}
      <p className="text-xs text-gray-600">
        Tip: Press Ctrl+Enter to balance quickly
      </p>
    </div>
  );
}

export default EquationEditor;
