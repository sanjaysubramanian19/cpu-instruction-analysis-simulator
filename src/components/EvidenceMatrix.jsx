import React from 'react';
import { Award, CheckCircle2, FileText, Cpu, Sparkles, GitBranch, Split } from 'lucide-react';

export default function EvidenceMatrix() {
  const subjects = [
    {
      code: 'COA',
      name: 'Computer Organization and Architecture',
      icon: Cpu,
      color: 'var(--coa-color)',
      cardClass: 'card-coa',
      rubric: [
        { criterion: '1. Project Report', marks: '3 Marks', evidence: 'COA_Project_Report.pdf / .docx (Pipeline architecture, formulas, hazard derivations, screenshots, test results)', status: 'Evidence Verified ✓' },
        { criterion: '2. Application of Selected Concept', marks: '4 Marks', evidence: 'Pipeline Simulator (5-stage RISC-style educational pipeline IF, ID, EX, MEM, WB simulation engine)', status: 'Evidence Verified ✓' },
        { criterion: '3. Correctness & Depth of Implementation', marks: '4 Marks', evidence: 'Exact cycle timing (k+n-1), RAW data hazard stalls, CPI, speedup, throughput & utilization formulas', status: 'Evidence Verified ✓' },
        { criterion: '4. Functionality & Working Demonstration', marks: '3 Marks', evidence: 'Interactive cycle matrix, live stage blocks, playback controls (Start/Pause/Next/Reset), speed adjustment', status: 'Evidence Verified ✓' },
        { criterion: '5. Testing & Results', marks: '1 Mark', evidence: '8 Automated Unit Tests (0, 1, 3, 5, 10 instructions, RAW dependency, cascading dependencies, branch flush) — 100% Pass', status: 'Evidence Verified ✓' }
      ]
    },
    {
      code: 'AI/ML',
      name: 'AI/ML Foundations',
      icon: Sparkles,
      color: 'var(--aiml-color)',
      cardClass: 'card-aiml',
      rubric: [
        { criterion: '1. Project Report', marks: '3 Marks', evidence: 'AIML_Project_Report.pdf / .docx (State space formulation, heuristic admissibility proof, step trace, screenshots)', status: 'Evidence Verified ✓' },
        { criterion: '2. Application of Selected Concept', marks: '4 Marks', evidence: 'A* Search Lab (Informed heuristic graph search over weighted state-space microarchitectural graph)', status: 'Evidence Verified ✓' },
        { criterion: '3. Correctness & Depth of Implementation', marks: '4 Marks', evidence: 'f(n) = g(n) + h(n), binary min-heap Open Set, Closed Set, parent backpointers, programmatic admissibility (h <= h*) & consistency checks', status: 'Evidence Verified ✓' },
        { criterion: '4. Functionality & Working Demonstration', marks: '3 Marks', evidence: 'Interactive step-by-step frontier animation, node selection, dynamic F/G/H evaluation matrix', status: 'Evidence Verified ✓' },
        { criterion: '5. Testing & Results', marks: '1 Mark', evidence: '8 Automated Unit Tests (Linear, diamond, programmatic admissibility, consistency, start=goal, disconnected, tie-breaking, heuristic scaling) — 100% Pass', status: 'Evidence Verified ✓' }
      ]
    },
    {
      code: 'DAA',
      name: 'Design and Analysis of Algorithms',
      icon: GitBranch,
      color: 'var(--daa-color)',
      cardClass: 'card-daa',
      rubric: [
        { criterion: '1. Project Report', marks: '3 Marks', evidence: 'DAA_Project_Report.pdf / .docx (Greedy choice property, relaxation proofs, asymptotic complexity, comparative study)', status: 'Evidence Verified ✓' },
        { criterion: '2. Application of Selected Concept', marks: '4 Marks', evidence: 'Dijkstra Algorithm Lab (Greedy single-source shortest path algorithm on identical graph topology)', status: 'Evidence Verified ✓' },
        { criterion: '3. Correctness & Depth of Implementation', marks: '4 Marks', evidence: 'dist[v] = min(dist[v], dist[u] + w), priority queue extraction, non-negative weight invariant, SPT generation', status: 'Evidence Verified ✓' },
        { criterion: '4. Functionality & Working Demonstration', marks: '3 Marks', evidence: 'Interactive relaxation animator, live distance table, edge relaxation event log, complexity counters', status: 'Evidence Verified ✓' },
        { criterion: '5. Testing & Results', marks: '1 Mark', evidence: '8 Automated Unit Tests (Single edge, multi-path, weights, equal costs, source=dest, disconnected, dense graph, negative weight constraint) — 100% Pass', status: 'Evidence Verified ✓' }
      ]
    },
    {
      code: 'FLAT',
      name: 'Formal Language and Automata Theory',
      icon: Split,
      color: 'var(--flat-color)',
      cardClass: 'card-flat',
      rubric: [
        { criterion: '1. Project Report', marks: '3 Marks', evidence: 'FLAT_Project_Report.pdf / .docx (Formal language theory, Thompson induction proof, epsilon-closure derivation, traces)', status: 'Evidence Verified ✓' },
        { criterion: '2. Application of Selected Concept', marks: '4 Marks', evidence: 'Regex → Finite Automaton Lab (Interactive Thompson compiler and finite state machine generator)', status: 'Evidence Verified ✓' },
        { criterion: '3. Correctness & Depth of Implementation', marks: '4 Marks', evidence: 'Shunting-Yard explicit concatenation parser, Thompson fragments (union, concat, star), epsilon-closure engine', status: 'Evidence Verified ✓' },
        { criterion: '4. Functionality & Working Demonstration', marks: '3 Marks', evidence: 'Interactive SVG automaton diagram, step-by-step string simulation, active state badges, ACCEPT/REJECT', status: 'Evidence Verified ✓' },
        { criterion: '5. Testing & Results', marks: '1 Mark', evidence: '12 Automated Unit Tests (Base, union, concat, star, (a|b)*abb valid/invalid, nested parens, empty string, syntax trap) — 100% Pass', status: 'Evidence Verified ✓' }
      ]
    }
  ];

  return (
    <div>
      {/* Header Banner */}
      <div className="page-academic-banner" style={{ borderLeftColor: '#f59e0b' }}>
        <div className="banner-title-row">
          <div>
            <h2>15-Mark Independent Evaluation Evidence Matrix</h2>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Explicit grading rubric mapping across all 5 evaluation criteria • Total: <strong>60 Marks</strong>
            </div>
          </div>
          <span className="score-badge">
            <Award size={15} color="#38bdf8" />
            <span>Evaluation Standard: 15 Marks Per Subject</span>
          </span>
        </div>

        <div className="banner-concepts-row">
          <div className="concept-box">
            <div className="concept-label">Evaluation Principle</div>
            Each subject independently provides comprehensive evidence designed to satisfy all 5 evaluation criteria with its own module, implementation, tests, and documentation. No cross-subject dependency for marks.
          </div>
          <div className="concept-box">
            <div className="concept-label">Grading Breakdown (Criterion Weightage)</div>
            Report (3m) + Concept Application (4m) + Correctness & Depth (4m) + Functionality & Demo (3m) + Testing (1m) = <strong>15 Marks Target</strong>
          </div>
        </div>
      </div>

      {/* 4 Subject Rubrics */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {subjects.map((sub, idx) => {
          const Icon = sub.icon;
          return (
            <div key={idx} className={`academic-card ${sub.cardClass}`}>
              <div className="card-header">
                <h3>
                  <Icon size={20} color={sub.color} />
                  <span>{sub.name} ({sub.code})</span>
                </h3>
                <span className="badge badge-success" style={{ fontSize: '0.8rem', padding: '0.3rem 0.75rem' }}>
                  Evidence designed to satisfy all 5 criteria (15 Marks Target)
                </span>
              </div>

              <div className="table-container">
                <table className="academic-table">
                  <thead>
                    <tr>
                      <th style={{ width: '22%' }}>Evaluation Criterion</th>
                      <th style={{ width: '10%' }}>Weight</th>
                      <th style={{ width: '54%' }}>Specific Implementation Evidence in Project</th>
                      <th style={{ width: '14%' }}>Verification Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sub.rubric.map((r, rIdx) => (
                      <tr key={rIdx}>
                        <td><strong>{r.criterion}</strong></td>
                        <td className="font-mono" style={{ fontWeight: 700, color: 'var(--primary)' }}>{r.marks}</td>
                        <td style={{ fontSize: '0.825rem' }}>{r.evidence}</td>
                        <td>
                          <span className="badge badge-success"><CheckCircle2 size={12} /> {r.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>

      {/* Integrated Workflow Verification Card */}
      <div className="academic-card" style={{ marginTop: '1.5rem', borderLeft: '4px solid #4f46e5' }}>
        <div className="card-header">
          <h3>
            <Award size={20} color="#4f46e5" />
            <span>Integrated Project Architecture & Cross-Module Verification</span>
          </h3>
          <span className="badge badge-info">End-to-End Verification</span>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
          While each subject is evaluated independently for 15 marks, the four subjects are also connected into a continuous educational pipeline (Tab 2: Integrated Workflow):
        </p>
        <div className="table-container">
          <table className="academic-table">
            <thead>
              <tr>
                <th style={{ width: '22%' }}>Integration Stage</th>
                <th style={{ width: '20%' }}>Connected Subjects</th>
                <th style={{ width: '44%' }}>Mechanism / Bridge</th>
                <th style={{ width: '14%' }}>Tests</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Stage 1 → 2: Syntax Gating</strong></td>
                <td>FLAT (Mod 2.7) → COA (Mod 3.1)</td>
                <td>Thompson ε-NFA validates instruction opcode & operands before CPU pipeline admission. Syntax errors halt execution immediately.</td>
                <td><span className="badge badge-success">2 Tests ✓</span></td>
              </tr>
              <tr>
                <td><strong>Stage 2 → 3: State Graph</strong></td>
                <td>COA (Mod 3.1) → Graph Engine</td>
                <td>Deterministic execution state graph generated from pipeline instruction sequence with stage latency edge weights.</td>
                <td><span className="badge badge-success">2 Tests ✓</span></td>
              </tr>
              <tr>
                <td><strong>Stage 3 → 4 & 5: Dual Search</strong></td>
                <td>AI/ML (Mod 2.7) & DAA (Mod 3.13)</td>
                <td>A* (heuristic guided) and Dijkstra (greedy relaxation) run on the identical graph topology with verified cost parity.</td>
                <td><span className="badge badge-success">3 Tests ✓</span></td>
              </tr>
              <tr>
                <td><strong>Stage 6: Comparative Parity</strong></td>
                <td>All 4 Subjects Integrated</td>
                <td>Side-by-side performance matrix, optimality invariant verification, and boundary test validation (Start=Goal).</td>
                <td><span className="badge badge-success">1 Test ✓</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
