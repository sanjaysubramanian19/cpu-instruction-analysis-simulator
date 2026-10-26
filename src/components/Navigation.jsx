import React from 'react';
import {
  LayoutDashboard,
  Layers,
  Cpu,
  Sparkles,
  GitBranch,
  Split,
  FileCode2,
  CheckCircle2,
  BookOpen,
  Info
} from 'lucide-react';

export const TABS = [
  { id: 'dashboard', label: '1. Dashboard', icon: LayoutDashboard },
  { id: 'integrated', label: '2. Integrated Workflow', icon: Layers, badge: 'End-to-End' },
  { id: 'flat', label: '3. FLAT – Regex → Automaton', icon: Split, badge: 'Mod 2.7' },
  { id: 'coa', label: '4. COA – Pipeline Simulator', icon: Cpu, badge: 'Mod 3.1' },
  { id: 'aiml', label: '5. AI/ML – A* Search', icon: Sparkles, badge: 'Mod 2.7' },
  { id: 'daa', label: '6. DAA – Dijkstra', icon: GitBranch, badge: 'Mod 3.13' },
  { id: 'comparison', label: '7. A* vs Dijkstra', icon: Split },
  { id: 'tests', label: '8. Test Laboratory', icon: CheckCircle2, badge: '36+8 Tests' },
  { id: 'mapping', label: '9. Academic Module Mapping', icon: BookOpen },
  { id: 'evidence', label: '10. 15-Mark Evidence', icon: FileCode2 },
  { id: 'about', label: 'About Project', icon: Info }
];

export default function Navigation({ activeTab, setActiveTab }) {
  return (
    <header className="app-header">
      <div className="header-top">
        <div className="brand-section">
          <h1>Integrated CPU Instruction Analysis, Pipeline Performance & Intelligent Search Simulator</h1>
          <div className="subtitle">
            Integrated Academic Micro Project • 4 Technical Subjects × 15 Marks = 60 Marks Total • Made with ❤️ for learning & innovation
          </div>
          <div className="author-line" style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
            Done by: <strong style={{ color: 'var(--text-main)' }}>Sanjay Subramanian</strong> • Squad 71 • AU × Kalvium
          </div>
        </div>
      </div>

      <nav className="nav-tabs" aria-label="Main Navigation">
        {TABS.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`nav-tab-btn ${isActive ? 'active' : ''}`}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span style={{
                  fontSize: '0.7rem',
                  padding: '1px 5px',
                  borderRadius: '4px',
                  background: isActive ? '#dbeafe' : '#f1f5f9',
                  color: isActive ? '#1e40af' : '#64748b'
                }}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </header>
  );
}
