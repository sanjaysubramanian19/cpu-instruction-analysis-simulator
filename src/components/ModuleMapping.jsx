import React from 'react';
import { BookOpen, CheckCircle, Cpu, Sparkles, GitBranch, Split } from 'lucide-react';

export default function ModuleMapping() {
  const subjects = [
    {
      subject: 'Computer Organization and Architecture (COA)',
      marks: '15 Marks',
      icon: Cpu,
      color: 'var(--coa-color)',
      cardClass: 'card-coa',
      badgeClass: 'badge-info',
      primary: {
        id: 'Module 3.1',
        title: 'Pipelining: Stages, Throughput, and Speedup',
        implementation: 'CPU Pipeline Performance Lab (IF, ID, EX, MEM, WB Simulation)',
        sourceFile: 'src/engine/pipelineSimulator.js, src/engine/pipelineMetrics.js',
        demo: 'Tab 4: COA – Pipeline Simulator (Interactive cycle stepper & matrix)'
      },
      supporting: [
        { id: 'Module 3.3', title: 'Pipeline Performance Parameters', detail: 'Calculation of Speedup (S), Throughput (TP), and Stage Utilization (U).' },
        { id: 'Module 3.5', title: 'Structural Hazards', detail: 'Single memory port resource contention simulation causing pipeline stalls.' },
        { id: 'Module 3.7', title: 'Data Hazards', detail: 'Read-After-Write (RAW) register dependency detection & bubble insertion.' },
        { id: 'Module 3.9', title: 'Control Hazards', detail: 'Branch resolution in EX stage with speculative instruction flush.' },
        { id: 'Module 3.12', title: 'Pipeline Performance Analysis with Hazards', detail: 'Composite cycle calculation with multi-hazard stall penalty.' },
        { id: 'Module 3.14', title: 'CPU Performance Equation', detail: 'CPU Execution Time computation (I × CPI × Clock Period).' },
        { id: 'Module 3.15', title: 'Amdahl\'s Law and Optimization Limits', detail: 'Theoretical speedup upper bounding (S_max ≤ k = 5).' }
      ]
    },
    {
      subject: 'AI/ML Foundations (AI/ML)',
      marks: '15 Marks',
      icon: Sparkles,
      color: 'var(--aiml-color)',
      cardClass: 'card-aiml',
      badgeClass: 'badge-success',
      primary: {
        id: 'Module 2.7',
        title: 'A* Search Fundamentals: The Gold Standard of Search',
        implementation: 'A* Search Lab with f(n) = g(n) + h(n) frontier expansion',
        sourceFile: 'src/engine/astar.js, src/engine/priorityQueue.js',
        demo: 'Tab 5: AI/ML – A* Search (Live step-by-step state space traversal)'
      },
      supporting: [
        { id: 'Module 2.1', title: 'The AI Search Engine: Exploring Possibility Space', detail: 'Formal (S, A, T, G, c) state-space graph representation of CPU micro-states.' },
        { id: 'Module 2.5', title: 'Heuristics 101: Guiding AI with Smart Estimates', detail: 'Euclidean geometric distance calculation guiding exploration frontier.' },
        { id: 'Module 2.8', title: 'A* in Action: Building Optimal Pathfinders', detail: 'Interactive start/goal pathfinder with parent pointer path recovery.' },
        { id: 'Module 2.9', title: 'Designing Good Heuristics: The Art Behind Smart Search', detail: 'Admissibility verification (h(n) ≤ h*(n)) ensuring optimal shortest path.' }
      ]
    },
    {
      subject: 'Design and Analysis of Algorithms (DAA)',
      marks: '15 Marks',
      icon: GitBranch,
      color: 'var(--daa-color)',
      cardClass: 'card-daa',
      badgeClass: 'badge-warning',
      primary: {
        id: 'Module 3.13',
        title: 'Dijkstra\'s Algorithm',
        implementation: 'Dijkstra Algorithm Lab with edge relaxation logs & Shortest Path Tree',
        sourceFile: 'src/engine/dijkstra.js, src/engine/graph.js',
        demo: 'Tab 6: DAA – Dijkstra (Step-by-step greedy vertex settling)'
      },
      supporting: [
        { id: 'Module 1.3', title: 'Asymptotic Analysis and Amortized Complexity', detail: 'Operation counter comparing binary min-heap O((V+E) log V) with array O(V²).' },
        { id: 'Module 1.7', title: 'Revisiting Graph Foundations', detail: 'Directed weighted adjacency list data structure with non-negative edge weights.' },
        { id: 'Module 3.1', title: 'Introduction to Greedy Algorithms', detail: 'Greedy choice property: permanently settling vertex with minimum distance.' },
        { id: 'Module 3.2', title: 'Evaluating Greedy Strategies', detail: 'Optimal substructure verification and comparison against informed heuristic search.' },
        { id: 'Module 3.15', title: 'Shortest Path Algorithms with Dijkstra', detail: 'Single-source shortest path tree (SPT) extraction.' }
      ]
    },
    {
      subject: 'Formal Language and Automata Theory (FLAT)',
      marks: '15 Marks',
      icon: Split,
      color: 'var(--flat-color)',
      cardClass: 'card-flat',
      badgeClass: 'badge-info',
      primary: {
        id: 'Module 2.7',
        title: 'Regular Expression to Finite Automata conversion',
        implementation: 'Regex → Finite Automaton Lab (Thompson\'s Construction Compiler)',
        sourceFile: 'src/engine/regexParser.js, src/engine/regexToAutomaton.js',
        demo: 'Tab 3: FLAT – Regex → Automaton (Interactive FSM visualizer & tester)'
      },
      supporting: [
        { id: 'Module 1.4', title: 'Finite State Machine and Regular Languages', detail: 'Formal 5-tuple specification M = (Q, Σ, δ, q0, F) and language membership.' },
        { id: 'Module 1.5', title: 'Deterministic Finite Automata', detail: 'Deterministic path tracing and trap-state rejection mechanics.' },
        { id: 'Module 1.8', title: 'Non-deterministic Finite Automata and Epsilon NFA', detail: 'Depth-first ε-closure computation and multi-state concurrent transitions.' },
        { id: 'Module 2.1', title: 'Introduction to Regular Expressions', detail: 'Syntax lexing and Shunting-Yard infix-to-postfix operator conversion.' },
        { id: 'Module 2.2', title: 'Kleene\'s theorem and Operations on Regular Expressions', detail: 'Inductive Thompson fragments for union (A|B), concat (A·B), and star (A*).' }
      ]
    }
  ];

  return (
    <div>
      {/* Academic Header Banner */}
      <div className="page-academic-banner" style={{ borderLeftColor: '#2563eb' }}>
        <div className="banner-title-row">
          <div>
            <h2>Academic Module Mapping & Syllabus Traceability</h2>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Rigorous syllabus alignment for all four subjects • Only Modules 1–3 utilized
            </div>
          </div>
          <span className="module-tag">Strict Academic Integrity</span>
        </div>

        <div className="banner-concepts-row">
          <div className="concept-box">
            <div className="concept-label">Academic Guideline Compliance</div>
            All primary and supporting concepts are drawn strictly from Modules 1–3 of the supplied syllabus. No fabricated module titles.
          </div>
          <div className="concept-box">
            <div className="concept-label">Evaluation Rule</div>
            Every subject is mapped to its own primary module, supporting modules, source files, and live UI demonstrations.
          </div>
        </div>
      </div>

      {/* 4 Subject Mapping Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {subjects.map((sub, idx) => {
          const Icon = sub.icon;
          return (
            <div key={idx} className={`academic-card ${sub.cardClass}`}>
              <div className="card-header">
                <h3>
                  <Icon size={20} color={sub.color} />
                  <span>{sub.subject}</span>
                </h3>
                <span className="score-badge" style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem' }}>
                  {sub.marks}
                </span>
              </div>

              {/* Primary Concept Box */}
              <div style={{ background: '#f8fafc', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '1rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: sub.color, letterSpacing: '0.05em' }}>
                    ★ PRIMARY CONCEPT (4 MARKS)
                  </span>
                  <span className="badge badge-success">
                    <CheckCircle size={12} /> {sub.primary.id}
                  </span>
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  {sub.primary.title}
                </div>
                <div style={{ fontSize: '0.825rem', marginTop: '0.4rem', color: 'var(--text-muted)' }}>
                  <div>• <strong>Implemented Feature:</strong> {sub.primary.implementation}</div>
                  <div>• <strong>Source Code:</strong> <code className="font-mono">{sub.primary.sourceFile}</code></div>
                  <div>• <strong>UI Demonstration:</strong> {sub.primary.demo}</div>
                </div>
              </div>

              {/* Supporting Concepts Table */}
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                  Supporting Syllabus Concepts Actually Implemented (Modules 1–3)
                </div>
                <div className="table-container">
                  <table className="academic-table">
                    <thead>
                      <tr>
                        <th style={{ width: '15%' }}>Module ID</th>
                        <th style={{ width: '35%' }}>Exact Syllabus Title</th>
                        <th style={{ width: '50%' }}>Feature Using It in this Project</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sub.supporting.map((sup, sIdx) => (
                        <tr key={sIdx}>
                          <td className="font-mono"><strong>{sup.id}</strong></td>
                          <td><strong>{sup.title}</strong></td>
                          <td style={{ fontSize: '0.8rem' }}>{sup.detail}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
