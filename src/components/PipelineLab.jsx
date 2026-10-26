import React, { useState, useEffect, useRef } from 'react';
import { parseProgram, PRESET_PROGRAMS } from '../engine/instructionValidator.js';
import { simulatePipeline, PIPELINE_STAGES } from '../engine/pipelineSimulator.js';
import { calculatePipelineMetrics } from '../engine/pipelineMetrics.js';
import PipelineMatrix from './PipelineMatrix.jsx';
import { Play, Pause, SkipForward, RotateCcw, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';

export default function PipelineLab() {
  const [selectedPreset, setSelectedPreset] = useState('BASIC_ARITHMETIC');
  const [codeText, setCodeText] = useState(PRESET_PROGRAMS.BASIC_ARITHMETIC.code);
  const [enableDataHazards, setEnableDataHazards] = useState(false);
  const [enableForwarding, setEnableForwarding] = useState(false);
  const [enableStructuralHazards, setEnableStructuralHazards] = useState(false);
  const [branchTaken, setBranchTaken] = useState(false);

  const [simData, setSimData] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [currentCycle, setCurrentCycle] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(600); // ms per cycle

  const playTimerRef = useRef(null);

  // Run simulation whenever code or hazard flags change
  useEffect(() => {
    runSimulation();
  }, [codeText, enableDataHazards, enableForwarding, enableStructuralHazards, branchTaken]);

  const runSimulation = () => {
    const { instructions, errors } = parseProgram(codeText);
    if (instructions.length === 0) {
      setSimData(null);
      setMetrics(null);
      setCurrentCycle(0);
      return;
    }

    const sim = simulatePipeline(instructions, {
      enableDataHazards,
      enableForwarding,
      enableStructuralHazards,
      branchTaken
    });

    const met = calculatePipelineMetrics(instructions.length, sim.cycles, sim.totalStalls, sim.matrix);

    setSimData(sim);
    setMetrics(met);
    setCurrentCycle(sim.cycles); // Default show completed matrix
    setIsPlaying(false);
  };

  // Playback timer effect
  useEffect(() => {
    if (isPlaying) {
      playTimerRef.current = setInterval(() => {
        setCurrentCycle(prev => {
          if (!simData || prev >= simData.cycles) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, playbackSpeed);
    } else {
      clearInterval(playTimerRef.current);
    }

    return () => clearInterval(playTimerRef.current);
  }, [isPlaying, simData, playbackSpeed]);

  const handleStartPlay = () => {
    if (simData && currentCycle >= simData.cycles) {
      setCurrentCycle(1);
    }
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleNextCycle = () => {
    setIsPlaying(false);
    if (simData && currentCycle < simData.cycles) {
      setCurrentCycle(prev => prev + 1);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentCycle(1);
  };

  const handlePresetSelect = (presetKey) => {
    setSelectedPreset(presetKey);
    setCodeText(PRESET_PROGRAMS[presetKey].code);
    if (presetKey === 'DATA_HAZARD_RAW') {
      setEnableDataHazards(true);
      setEnableForwarding(false);
      setEnableStructuralHazards(false);
      setBranchTaken(false);
    } else if (presetKey === 'STRUCTURAL_HAZARD') {
      setEnableStructuralHazards(true);
      setEnableDataHazards(false);
      setBranchTaken(false);
    } else if (presetKey === 'CONTROL_HAZARD') {
      setBranchTaken(true);
      setEnableDataHazards(false);
      setEnableStructuralHazards(false);
    } else {
      setEnableDataHazards(false);
      setEnableForwarding(false);
      setEnableStructuralHazards(false);
      setBranchTaken(false);
    }
  };

  // Current active stages at this cycle
  const currentTimelineEntry = simData?.cycleTimeline?.find(c => c.cycle === currentCycle);

  return (
    <div>
      {/* Academic Header Banner */}
      <div className="page-academic-banner" style={{ borderLeftColor: 'var(--coa-color)' }}>
        <div className="banner-title-row">
          <div>
            <h2>COA – CPU Pipeline Performance Lab</h2>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Computer Organization and Architecture • Evaluation: <strong>15 Marks</strong>
            </div>
          </div>
          <span className="module-tag" style={{ background: '#e0e7ff', color: '#3730a3', borderColor: '#c7d2fe' }}>
            Primary Concept: Module 3.1
          </span>
        </div>

        <div className="banner-concepts-row">
          <div className="concept-box">
            <div className="concept-label">Primary Module (4 Marks)</div>
            <strong>Module 3.1:</strong> Pipelining: Stages, Throughput, and Speedup (IF, ID, EX, MEM, WB)
          </div>
          <div className="concept-box">
            <div className="concept-label">Supporting Syllabus Modules</div>
            <span><strong>Module 3.3:</strong> Performance Parameters • <strong>Module 3.5:</strong> Structural Hazards • <strong>Module 3.7:</strong> Data Hazards • <strong>Module 3.9:</strong> Control Hazards • <strong>Module 3.14:</strong> CPU Equation • <strong>Module 3.15:</strong> Amdahl's Law</span>
          </div>
        </div>
      </div>

      {/* Top Controls & Instructions */}
      <div className="grid-2">
        {/* Section A: Instruction Input */}
        <div className="academic-card card-coa">
          <div className="card-header">
            <h3>A. Instruction Input & Presets</h3>
            <span className="badge badge-info">5-Stage RISC Model</span>
          </div>

          <div className="control-group">
            <label className="control-label">Academic Program Presets:</label>
            <div className="btn-group" style={{ marginBottom: '0.75rem' }}>
              {Object.keys(PRESET_PROGRAMS).map(k => (
                <button
                  key={k}
                  className={`btn btn-sm ${selectedPreset === k ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => handlePresetSelect(k)}
                >
                  {PRESET_PROGRAMS[k].name}
                </button>
              ))}
            </div>
          </div>

          <div className="control-group">
            <label className="control-label">Assembly Code Editor (or enter instructions):</label>
            <textarea
              rows={5}
              className="textarea-input font-mono"
              value={codeText}
              onChange={(e) => setCodeText(e.target.value)}
              placeholder="e.g. LOAD R1, 100&#10;ADD R2, R1, R3"
            />
          </div>

          {/* Section F: Hazards Configuration */}
          <div className="concept-box" style={{ background: '#fdf4ff', borderColor: '#f0abfc' }}>
            <div className="concept-label" style={{ color: '#86198f' }}>F. Hazard Analysis Toggles (Supporting Modules)</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.4rem', fontSize: '0.8rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={enableDataHazards}
                  onChange={(e) => setEnableDataHazards(e.target.checked)}
                />
                <span>RAW Data Hazards (Mod 3.7)</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={enableForwarding}
                  disabled={!enableDataHazards}
                  onChange={(e) => setEnableForwarding(e.target.checked)}
                />
                <span>Forwarding Path (Mod 3.8)</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={enableStructuralHazards}
                  onChange={(e) => setEnableStructuralHazards(e.target.checked)}
                />
                <span>Structural 1-Port Mem (Mod 3.5)</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={branchTaken}
                  onChange={(e) => setBranchTaken(e.target.checked)}
                />
                <span>Branch Taken / Flush (Mod 3.9)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Section E: Performance Metrics */}
        <div className="academic-card card-coa">
          <div className="card-header">
            <h3>E. Performance Metrics (Module 3.1 & 3.3)</h3>
            <span className="badge badge-success">Live Calculations</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
            <div className="stat-box">
              <div className="stat-value">{metrics ? `${metrics.actualSpeedup}×` : '—'}</div>
              <div className="stat-label">Actual Speedup (S)</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">{metrics ? metrics.actualCycles : '—'}</div>
              <div className="stat-label">Pipeline Cycles (T_pipe)</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">{metrics ? metrics.nonPipelinedCycles : '—'}</div>
              <div className="stat-label">Non-Pipelined (T_nonpipe)</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
            <div className="stat-box">
              <div className="stat-value">{metrics ? metrics.throughput : '—'}</div>
              <div className="stat-label">Throughput (Inst/Cycle)</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">{metrics ? `${metrics.utilizationPercentage}%` : '—'}</div>
              <div className="stat-label">Stage Utilization (U)</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">{metrics ? metrics.cpi : '—'}</div>
              <div className="stat-label">Avg CPI (T/n)</div>
            </div>
          </div>

          {/* Section G: Academic Derivation Summary */}
          <div className="concept-box">
            <div className="concept-label">G. Mathematical Derivation Proofs</div>
            <div style={{ fontSize: '0.785rem', fontFamily: 'monospace', lineHeight: '1.6' }}>
              <div>• Non-Pipelined: T_nonpipe = n × k = {metrics?.n || 0} × 5 = <strong>{metrics?.nonPipelinedCycles || 0} cycles</strong></div>
              <div>• Ideal Pipelined: T_ideal = k + n - 1 = 5 + {metrics?.n || 0} - 1 = <strong>{metrics?.idealPipelinedCycles || 0} cycles</strong></div>
              <div>• Total Stalls Inserted: <strong>{metrics?.totalStalls || 0} cycles</strong></div>
              <div>• Ideal Speedup: S_ideal = {metrics?.nonPipelinedCycles} / {metrics?.idealPipelinedCycles} = <strong>{metrics?.idealSpeedup}×</strong></div>
              <div>• Amdahl's Law Limit (Mod 3.15): S_max ≤ k = <strong>5.00×</strong> (Amdahl asymptote: {metrics?.amdahlSpeedupLimit}×)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Section B & D: Stage Visualizer & Playback Bar */}
      <div className="academic-card card-coa" style={{ marginBottom: '1.25rem' }}>
        <div className="card-header">
          <h3>B. Active Pipeline Stages at Cycle {currentCycle} / {simData?.cycles || 0}</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Playback Controls */}
            <div className="btn-group">
              <button
                className="btn btn-sm btn-primary"
                onClick={isPlaying ? handlePause : handleStartPlay}
              >
                {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                {isPlaying ? 'Pause' : 'Start'}
              </button>
              <button
                className="btn btn-sm btn-secondary"
                disabled={!simData || currentCycle >= simData.cycles}
                onClick={handleNextCycle}
              >
                <SkipForward size={14} /> Next Cycle
              </button>
              <button
                className="btn btn-sm btn-secondary"
                onClick={handleReset}
              >
                <RotateCcw size={14} /> Reset
              </button>
            </div>

            {/* Speed Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem' }}>
              <span>Speed:</span>
              <select
                className="select-input"
                style={{ padding: '0.2rem 0.4rem', fontSize: '0.75rem' }}
                value={playbackSpeed}
                onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
              >
                <option value={1000}>1.0s (Slow)</option>
                <option value={600}>0.6s (Normal)</option>
                <option value={300}>0.3s (Fast)</option>
              </select>
            </div>
          </div>
        </div>

        {/* 5-Stage Live Blocks */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
          {PIPELINE_STAGES.map(stage => {
            const instId = currentTimelineEntry?.activeStages[stage];
            return (
              <div
                key={stage}
                style={{
                  background: instId ? '#eff6ff' : '#f8fafc',
                  border: `2px solid ${instId ? '#3b82f6' : '#cbd5e1'}`,
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.75rem',
                  textAlign: 'center',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>STAGE</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e3a8a' }}>{stage}</div>
                <div style={{ marginTop: '0.35rem', fontSize: '0.8rem', fontWeight: 600, color: instId ? '#2563eb' : '#94a3b8' }}>
                  {instId || 'IDLE'}
                </div>
              </div>
            );
          })}
        </div>

        {/* Stall Alert Banner if hazards active in this cycle */}
        {currentTimelineEntry?.stallsOccurred?.length > 0 && (
          <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#991b1b', fontSize: '0.825rem' }}>
            <AlertTriangle size={16} />
            <span><strong>Pipeline Stall Detected:</strong> {currentTimelineEntry.stallsOccurred.join('; ')}</span>
          </div>
        )}

        {/* Section C: Cycle Matrix */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>C. Pipeline Execution Matrix (Module 3.1)</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Total Cycles: <strong>{simData?.cycles || 0}</strong> | Total Stalls: <strong>{metrics?.totalStalls || 0}</strong>
            </span>
          </div>
          <PipelineMatrix
            matrix={simData?.matrix}
            currentCycle={currentCycle}
            totalCycles={simData?.cycles || 0}
          />
        </div>
      </div>
    </div>
  );
}
