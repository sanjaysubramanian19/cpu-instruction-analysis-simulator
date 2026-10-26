import React, { useState, useEffect } from 'react';
import { buildAutomatonFromRegex } from '../engine/regexToAutomaton.js';
import { simulateAutomaton } from '../engine/automatonSimulator.js';
import AutomatonVisualizer from './AutomatonVisualizer.jsx';
import { Play, RotateCcw, CheckCircle, XCircle, ArrowRight, BookOpen } from 'lucide-react';

const REGEX_PRESETS = [
  { label: 'Standard Benchmark: (a|b)*abb', regex: '(a|b)*abb', testStr: 'aabb' },
  { label: 'Simple Union: a|b', regex: 'a|b', testStr: 'a' },
  { label: 'Kleene Closure: (ab)*', regex: '(ab)*', testStr: 'abab' },
  { label: 'Instruction Opcode: LOAD|ADD|SUB', regex: 'LOAD|ADD|SUB', testStr: 'ADD' }
];

export default function FlatLab() {
  const [regexInput, setRegexInput] = useState('(a|b)*abb');
  const [testString, setTestString] = useState('aabb');
  const [automatonData, setAutomatonData] = useState(null);
  const [simResult, setSimResult] = useState(null);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  // Compile regex on mount or when regexInput changes
  useEffect(() => {
    compileRegex(regexInput);
  }, []);

  const compileRegex = (regex) => {
    const res = buildAutomatonFromRegex(regex);
    setAutomatonData(res);
    if (res.automaton) {
      const sim = simulateAutomaton(res.automaton, testString);
      setSimResult(sim);
      setCurrentStepIdx(sim.trace.length - 1);
    } else {
      setSimResult(null);
    }
  };

  const handleTestStringChange = (str) => {
    setTestString(str);
    if (automatonData && automatonData.automaton) {
      const sim = simulateAutomaton(automatonData.automaton, str);
      setSimResult(sim);
      setCurrentStepIdx(sim.trace.length - 1);
    }
  };

  const activeStatesForCurrentStep = simResult && simResult.trace[currentStepIdx]
    ? simResult.trace[currentStepIdx].postStates
    : [];

  return (
    <div>
      {/* Academic Header Banner */}
      <div className="page-academic-banner" style={{ borderLeftColor: 'var(--flat-color)' }}>
        <div className="banner-title-row">
          <div>
            <h2>FLAT – Regular Expression to Finite Automaton Lab</h2>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Formal Language & Automata Theory • Evaluation: <strong>15 Marks</strong>
            </div>
          </div>
          <span className="module-tag" style={{ background: '#ecfeff', color: '#0e7490', borderColor: '#a5f3fc' }}>
            Primary Concept: Module 2.7
          </span>
        </div>

        <div className="banner-concepts-row">
          <div className="concept-box">
            <div className="concept-label">Primary Module (4 Marks)</div>
            <strong>Module 2.7:</strong> Regular Expression to Finite Automata conversion (Thompson's Construction)
          </div>
          <div className="concept-box">
            <div className="concept-label">Supporting Syllabus Modules</div>
            <span><strong>Module 1.4:</strong> Finite State Machine • <strong>Module 1.8:</strong> Epsilon NFA • <strong>Module 2.2:</strong> Kleene's Theorem</span>
          </div>
        </div>
      </div>

      <div className="grid-2">
        {/* Section A: Regular Expression Editor */}
        <div className="academic-card card-flat">
          <div className="card-header">
            <h3>A. Regular Expression Editor</h3>
            <span className="badge badge-info">Thompson's Compiler</span>
          </div>

          <div className="control-group">
            <label className="control-label">Enter Regular Expression:</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                className="text-input font-mono"
                value={regexInput}
                onChange={(e) => setRegexInput(e.target.value)}
                placeholder="e.g. (a|b)*abb"
              />
              <button
                className="btn btn-primary"
                onClick={() => compileRegex(regexInput)}
              >
                Compile
              </button>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="control-group">
            <label className="control-label">Academic Presets:</label>
            <div className="btn-group">
              {REGEX_PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    setRegexInput(p.regex);
                    setTestString(p.testStr);
                    compileRegex(p.regex);
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Section B: Parsed Expression & Formal 5-Tuple */}
          <div className="concept-box" style={{ marginTop: '0.5rem' }}>
            <div className="concept-label">B. Parsed Expression & 5-Tuple Definition M = (Q, Σ, δ, q0, F)</div>
            {automatonData && automatonData.error ? (
              <div style={{ color: 'var(--danger)', fontSize: '0.85rem' }}>{automatonData.error}</div>
            ) : automatonData && automatonData.automaton ? (
              <div style={{ fontSize: '0.825rem', fontFamily: 'monospace' }}>
                <div><strong>Infix:</strong> {regexInput}</div>
                <div><strong>Postfix (Explicit Concat '·'):</strong> {automatonData.postfix}</div>
                <div style={{ marginTop: '0.35rem' }}>
                  <strong>Q (States):</strong> {'{' + automatonData.automaton.states.join(', ') + '}'}
                </div>
                <div>
                  <strong>Σ (Alphabet):</strong> {'{' + automatonData.automaton.alphabet.join(', ') + '}'}
                </div>
                <div>
                  <strong>Start (q0):</strong> {automatonData.automaton.startState} | <strong>F (Accept):</strong> {'{' + automatonData.automaton.acceptStates.join(', ') + '}'}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* Section E & G: String Simulator & Acceptance Result */}
        <div className="academic-card card-flat">
          <div className="card-header">
            <h3>E. String Simulator & Verification</h3>
            {simResult && (
              <span className={`badge ${simResult.accepted ? 'badge-success' : 'badge-danger'}`}>
                {simResult.accepted ? <CheckCircle size={14} /> : <XCircle size={14} />}
                {simResult.accepted ? 'ACCEPT' : 'REJECT'}
              </span>
            )}
          </div>

          <div className="control-group">
            <label className="control-label">Enter Input String to Simulate:</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                className="text-input font-mono"
                value={testString}
                onChange={(e) => handleTestStringChange(e.target.value)}
                placeholder="e.g. aabb or abab"
              />
              <button
                className="btn btn-secondary"
                onClick={() => handleTestStringChange(testString)}
              >
                Re-simulate
              </button>
            </div>
          </div>

          {/* Quick String Test Buttons */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', alignSelf: 'center' }}>Try Strings:</span>
            {['aabb', 'abab', 'abb', 'babb', 'a', ''].map((str, idx) => (
              <button
                key={idx}
                className="btn btn-secondary btn-sm font-mono"
                onClick={() => handleTestStringChange(str)}
              >
                {str === '' ? 'ε (empty)' : `"${str}"`}
              </button>
            ))}
          </div>

          {/* Section G: Verdict Card */}
          {simResult && (
            <div style={{
              background: simResult.accepted ? '#f0fdf4' : '#fef2f2',
              border: `1px solid ${simResult.accepted ? '#bbf7d0' : '#fecaca'}`,
              borderRadius: 'var(--radius-sm)',
              padding: '0.85rem',
              marginBottom: '1rem'
            }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: simResult.accepted ? '#15803d' : '#b91c1c', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                {simResult.accepted ? 'STRING ACCEPTED' : 'STRING REJECTED'}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                {simResult.reason}
              </div>
            </div>
          )}

          {/* Stepper Controls */}
          {simResult && simResult.trace.length > 0 && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Simulation Step: {currentStepIdx} / {simResult.trace.length - 1}</span>
                <div className="btn-group">
                  <button
                    className="btn btn-secondary btn-sm"
                    disabled={currentStepIdx === 0}
                    onClick={() => setCurrentStepIdx(prev => Math.max(0, prev - 1))}
                  >
                    Prev
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    disabled={currentStepIdx === simResult.trace.length - 1}
                    onClick={() => setCurrentStepIdx(prev => Math.min(simResult.trace.length - 1, prev + 1))}
                  >
                    Next
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => setCurrentStepIdx(simResult.trace.length - 1)}
                  >
                    Final
                  </button>
                </div>
              </div>
              <div style={{ fontSize: '0.8rem', background: '#f8fafc', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                {simResult.trace[currentStepIdx]?.description}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Section D: Automaton Visualization */}
      <div className="academic-card card-flat" style={{ marginBottom: '1.25rem' }}>
        <div className="card-header">
          <h3>D. Automaton Visualization (Thompson's ε-NFA)</h3>
          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', alignItems: 'center' }}>
            <span><span style={{ display: 'inline-block', width: '10px', height: '10px', background: '#fef3c7', border: '1px solid #d97706', borderRadius: '50%' }}></span> Start State</span>
            <span><span style={{ display: 'inline-block', width: '10px', height: '10px', background: '#e0f2fe', border: '2px double #0284c7', borderRadius: '50%' }}></span> Accept State</span>
            <span><span style={{ display: 'inline-block', width: '10px', height: '10px', background: '#bbf7d0', border: '1px solid #15803d', borderRadius: '50%' }}></span> Active in Step</span>
            <span><span style={{ color: '#0891b2', fontWeight: 700 }}>{'--- ε --->'}</span> Epsilon Transition</span>
          </div>
        </div>

        <AutomatonVisualizer
          automaton={automatonData?.automaton}
          activeStates={activeStatesForCurrentStep}
        />
      </div>

      {/* Section C & F: Conversion Steps & Full Transition Trace */}
      <div className="grid-2">
        {/* Section C: Thompson Inductive Steps */}
        <div className="academic-card card-flat">
          <div className="card-header">
            <h3>C. Thompson's Inductive Construction Steps</h3>
            <span className="badge badge-info">FLAT Mod 2.7</span>
          </div>
          <div className="table-container" style={{ maxHeight: '260px' }}>
            <table className="academic-table">
              <thead>
                <tr>
                  <th>Step</th>
                  <th>Operation</th>
                  <th>Academic Description</th>
                </tr>
              </thead>
              <tbody>
                {automatonData?.steps?.map((s) => (
                  <tr key={s.step}>
                    <td><strong>{s.step}</strong></td>
                    <td><span className="badge badge-info">{s.operation}</span></td>
                    <td style={{ fontSize: '0.8rem' }}>{s.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section F: Full Simulation Trace */}
        <div className="academic-card card-flat">
          <div className="card-header">
            <h3>F. Transition Trace for String "{testString}"</h3>
            <span className="badge badge-info">FLAT Mod 1.8</span>
          </div>
          <div className="table-container" style={{ maxHeight: '260px' }}>
            <table className="academic-table">
              <thead>
                <tr>
                  <th>Step</th>
                  <th>Symbol</th>
                  <th>Pre-States</th>
                  <th>Post-States (with ε-closure)</th>
                </tr>
              </thead>
              <tbody>
                {simResult?.trace?.map((t) => (
                  <tr key={t.stepIndex} style={{ background: t.stepIndex === currentStepIdx ? '#eff6ff' : 'transparent' }}>
                    <td>{t.stepIndex}</td>
                    <td><strong>{t.char}</strong></td>
                    <td className="font-mono">{'{' + t.preStates.join(', ') + '}'}</td>
                    <td className="font-mono">{'{' + t.postStates.join(', ') + '}'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
