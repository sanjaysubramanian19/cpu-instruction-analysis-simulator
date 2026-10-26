import React from 'react';
import { Info, ShieldAlert, CheckCircle2, Laptop, Code2, Award } from 'lucide-react';

export default function AboutProject() {
  return (
    <div>
      {/* Header Banner */}
      <div className="page-academic-banner" style={{ borderLeftColor: '#3b82f6' }}>
        <div className="banner-title-row">
          <div>
            <h2>About the Integrated Academic Micro Project</h2>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Academic Specifications, Technical Architecture & Evaluation Integrity
            </div>
          </div>
          <span className="module-tag">60 Marks Capstone Project</span>
        </div>

        <div className="banner-concepts-row">
          <div className="concept-box">
            <div className="concept-label">Official Project Title</div>
            <strong>Integrated CPU Instruction Analysis, Pipeline Performance & Intelligent Search Simulator</strong>
          </div>
          <div className="concept-box">
            <div className="concept-label">Evaluation Structure</div>
            Four technical subjects evaluated independently for <strong>15 marks each</strong> across 5 standard criteria (Total = 60 Marks).
          </div>
        </div>
      </div>

      <div className="grid-2">
        {/* Core Principles */}
        <div className="academic-card">
          <div className="card-header">
            <h3><Award size={18} color="#2563eb" /> Academic Marking Standards</h3>
            <span className="badge badge-success">4 × 15 = 60 Marks</span>
          </div>

          <div style={{ fontSize: '0.85rem', lineHeight: '1.7' }}>
            <p style={{ marginBottom: '0.75rem' }}>
              This project is built as an <strong>Integrated / Combined Subject Project</strong> uniting four technical subjects under a single coherent educational simulator, while preserving complete independence for evaluation:
            </p>
            <ul style={{ paddingLeft: '1.25rem', marginBottom: '0.75rem' }}>
              <li><strong>Computer Organization and Architecture (COA):</strong> 15 Marks (Module 3.1)</li>
              <li><strong>AI/ML Foundations (AI/ML):</strong> 15 Marks (Module 2.7)</li>
              <li><strong>Design and Analysis of Algorithms (DAA):</strong> 15 Marks (Module 3.13)</li>
              <li><strong>Formal Language and Automata Theory (FLAT):</strong> 15 Marks (Module 2.7)</li>
            </ul>
            <p>
              Each subject independently provides its own module, implementation, UI demonstration, automated tests, results, explanation of correctness, and independent project report.
            </p>
          </div>
        </div>

        {/* Academic Integrity Box */}
        <div className="academic-card">
          <div className="card-header">
            <h3><ShieldAlert size={18} color="#dc2626" /> Academic Integrity & Implementation Rules</h3>
            <span className="badge badge-info">Zero Black Boxes</span>
          </div>

          <div style={{ fontSize: '0.85rem', lineHeight: '1.6' }}>
            <div style={{ marginBottom: '0.5rem' }}>
              <span className="badge badge-success" style={{ marginRight: '0.4rem' }}>Rule 1</span>
              <strong>No External Algorithm Libraries:</strong> Thompson's Construction, $\varepsilon$-NFA simulation, 5-stage RISC-style educational pipeline, Min-Heap Priority Queue, A* search, and Dijkstra's algorithm are implemented 100% from scratch.
            </div>
            <div style={{ marginBottom: '0.5rem' }}>
              <span className="badge badge-success" style={{ marginRight: '0.4rem' }}>Rule 2</span>
              <strong>No Built-in RegExp Shortcuts:</strong> FLAT automaton string membership is executed via explicit state-set transitions and $\varepsilon$-closures, never relying on `RegExp.test()`.
            </div>
            <div style={{ marginBottom: '0.5rem' }}>
              <span className="badge badge-success" style={{ marginRight: '0.4rem' }}>Rule 3</span>
              <strong>No Machine Learning Model Training Claims:</strong> A* is strictly presented as an informed heuristic search technique from AI Foundations Unit 2, not a trained ML neural network.
            </div>
            <div>
              <span className="badge badge-success" style={{ marginRight: '0.4rem' }}>Rule 4</span>
              <strong>Completely Offline Operation:</strong> Pure client-side React + Vite architecture. No backend server, no database, no cloud API, and zero external network calls required.
            </div>
          </div>
        </div>
      </div>

      {/* Technology Stack & Architecture */}
      <div className="academic-card" style={{ marginBottom: '1.25rem' }}>
        <div className="card-header">
          <h3><Code2 size={18} color="#4f46e5" /> Technology Stack & Engineering Design</h3>
          <span className="badge badge-secondary">Pure Client-Side Architecture</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', fontSize: '0.825rem' }}>
          <div className="stat-box" style={{ textAlign: 'left' }}>
            <div style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.3rem' }}>Frontend Framework</div>
            <div>• React 18 (Functional Components, Hooks)</div>
            <div>• Vite 5 (High-performance build tool)</div>
            <div>• Pure Vanilla CSS3 (Custom responsive theme)</div>
          </div>

          <div className="stat-box" style={{ textAlign: 'left' }}>
            <div style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.3rem' }}>Visualization Engines</div>
            <div>• Pure SVG for Finite Automata Diagrams</div>
            <div>• Pure SVG for Directed Weighted State Graphs</div>
            <div>• Dynamic HTML5 CSS Table Grid for Pipeline Matrix</div>
          </div>

          <div className="stat-box" style={{ textAlign: 'left' }}>
            <div style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.3rem' }}>Algorithmic Core</div>
            <div>• Pure JavaScript ES6+ Engines</div>
            <div>• Custom Binary Min-Heap Priority Queue</div>
            <div>• Shunting-Yard Infix-to-Postfix Converter</div>
          </div>

          <div className="stat-box" style={{ textAlign: 'left' }}>
            <div style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.3rem' }}>Documentation & Testing</div>
            <div>• 4 Comprehensive Reports (PDF & Word .docx)</div>
            <div>• 36 Subject Unit Tests + 8 Integration Tests (100% Pass)</div>
            <div>• Detailed Step-by-Step DEMO_SCRIPT.md</div>
          </div>
        </div>
      </div>
    </div>
  );
}
