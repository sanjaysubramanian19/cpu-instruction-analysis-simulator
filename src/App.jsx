import React, { useState } from 'react';
import Navigation from './components/Navigation.jsx';
import Dashboard from './components/Dashboard.jsx';
import IntegratedAnalysis from './components/IntegratedAnalysis.jsx';
import FlatLab from './components/FlatLab.jsx';
import PipelineLab from './components/PipelineLab.jsx';
import AStarLab from './components/AStarLab.jsx';
import DijkstraLab from './components/DijkstraLab.jsx';
import Comparison from './components/Comparison.jsx';
import TestLaboratory from './components/TestLaboratory.jsx';
import ModuleMapping from './components/ModuleMapping.jsx';
import EvidenceMatrix from './components/EvidenceMatrix.jsx';
import AboutProject from './components/AboutProject.jsx';
import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard setActiveTab={setActiveTab} />;
      case 'integrated':
        return <IntegratedAnalysis setActiveTab={setActiveTab} />;
      case 'flat':
        return <FlatLab />;
      case 'coa':
        return <PipelineLab />;
      case 'aiml':
        return <AStarLab />;
      case 'daa':
        return <DijkstraLab />;
      case 'comparison':
        return <Comparison />;
      case 'tests':
        return <TestLaboratory />;
      case 'mapping':
        return <ModuleMapping />;
      case 'evidence':
        return <EvidenceMatrix />;
      case 'about':
        return <AboutProject />;
      default:
        return <Dashboard setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="app-container">
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="main-content">
        {renderActiveView()}
      </main>
      <footer className="app-footer">
        <div>
          <strong>Integrated CPU Instruction Analysis, Pipeline Performance & Intelligent Search Simulator</strong>
        </div>
        <div style={{ marginTop: '0.25rem' }}>
          Integrated Academic Micro Project • 4 Technical Subjects × 15 Marks = 60 Marks Total • Made with ❤️ for learning & innovation
        </div>
      </footer>
    </div>
  );
}
