/**
 * COA Engine: 5-Stage RISC Pipeline Simulator
 * Academic Reference:
 *   - COA Module 3.1: Pipelining: Stages, Throughput, and Speedup (PRIMARY)
 *   - COA Module 3.5: Structural Hazards
 *   - COA Module 3.7: Data Hazards
 *   - COA Module 3.9: Control Hazards
 *   - COA Module 3.12: Pipeline Performance Analysis with Hazards
 *
 * Simulates classical 5-stage RISC architecture:
 *   IF -> ID -> EX -> MEM -> WB
 */

export const PIPELINE_STAGES = ['IF', 'ID', 'EX', 'MEM', 'WB'];
export const NUM_STAGES = 5;

/**
 * Simulates pipeline execution cycle-by-cycle.
 * @param {Array<Object>} instructions - Parsed instruction list
 * @param {Object} options - Hazard configuration options
 */
export function simulatePipeline(instructions = [], options = {}) {
  const {
    enableDataHazards = true,
    enableForwarding = false,
    enableStructuralHazards = false,
    branchTaken = false
  } = options;

  if (!instructions || instructions.length === 0) {
    return {
      cycles: 0,
      matrix: [],
      cycleTimeline: [],
      hazardEvents: [],
      totalStalls: 0,
      stageUtilizationHistory: []
    };
  }

  const n = instructions.length;
  // State for each instruction:
  // stage: -1 (unfetched), 0 (IF), 1 (ID), 2 (EX), 3 (MEM), 4 (WB), 5 (done), -2 (flushed)
  const instStates = instructions.map(() => ({
    stage: -1,
    stalledCycles: 0,
    flushed: false
  }));

  // Fetch first instruction at cycle 1
  instStates[0].stage = 0;
  let nextToFetch = 1;

  const matrixGrid = Array.from({ length: n }, () => []);
  const hazardEvents = [];
  const cycleTimeline = [];
  const stageUtilizationHistory = [];

  let cycle = 0;
  let totalStalls = 0;
  const MAX_CYCLES = Math.max(100, n * 10);

  while (cycle < MAX_CYCLES) {
    cycle++;
    const activeStagesThisCycle = {};
    const stallsInThisCycle = [];
    const cycleEvents = [];

    // Determine stall conditions for this cycle
    const isStalled = new Array(n).fill(false);

    // Check Data Hazards for any instruction currently in ID (stage === 1)
    if (enableDataHazards) {
      for (let i = 0; i < n; i++) {
        if (instStates[i].stage === 1 && !instStates[i].flushed) {
          const curr = instructions[i];
          const needed = [curr.src1, curr.src2].filter(Boolean);

          for (const reg of needed) {
            // Check earlier instructions that write to reg and haven't finished WB
            for (let prev = 0; prev < i; prev++) {
              if (instStates[prev].flushed) continue;
              const pInst = instructions[prev];
              const pStage = instStates[prev].stage;

              if (pInst.writesReg && pInst.dest === reg) {
                if (enableForwarding) {
                  // Forwarding resolves EX->EX and MEM->EX
                  // Only stall 1 cycle for LOAD-use hazard (when LOAD is in EX)
                  if (pInst.opcode === 'LOAD' && pStage === 2) {
                    isStalled[i] = true;
                    const detail = `Load-Use RAW hazard: ${curr.id} stalled waiting for ${reg} from ${pInst.id}`;
                    hazardEvents.push({ cycle, instructionId: curr.id, type: 'RAW Hazard (Load-Use)', detail });
                    stallsInThisCycle.push(detail);
                  }
                } else {
                  // Without forwarding: stall while previous instruction is in EX (2) or MEM (3)
                  if (pStage === 2 || pStage === 3) {
                    isStalled[i] = true;
                    const detail = `RAW Data hazard: ${curr.id} stalled in ID waiting for ${reg} writeback from ${pInst.id} (in ${PIPELINE_STAGES[pStage]})`;
                    hazardEvents.push({ cycle, instructionId: curr.id, type: 'RAW Data Hazard', detail });
                    stallsInThisCycle.push(detail);
                  }
                }
              }
            }
          }
        }
      }
    }

    // Check Structural Hazards (IF and MEM contention on single-port memory)
    if (enableStructuralHazards) {
      const memInstruction = instructions.findIndex((inst, idx) => instStates[idx].stage === 3 && inst.usesMem);
      if (memInstruction !== -1) {
        // Any instruction currently in IF or wanting to enter IF must stall
        for (let i = 0; i < n; i++) {
          if (instStates[i].stage === 0) {
            isStalled[i] = true;
            const detail = `Structural Hazard: Memory port contention between Fetch (${instructions[i].id}) and ${instructions[memInstruction].id}`;
            hazardEvents.push({ cycle, instructionId: instructions[i].id, type: 'Structural Hazard', detail });
            stallsInThisCycle.push(detail);
          }
        }
      }
    }

    // Check Control Hazard (Branch in EX)
    for (let i = 0; i < n; i++) {
      if (instStates[i].stage === 2 && instructions[i].isBranch && branchTaken && !instStates[i].flushed) {
        // Flush subsequent instructions in IF or ID
        for (let j = i + 1; j < n; j++) {
          if (instStates[j].stage === 0 || instStates[j].stage === 1) {
            instStates[j].flushed = true;
            const detail = `Control Hazard: Branch taken in ${instructions[i].id}, flushing ${instructions[j].id}`;
            hazardEvents.push({ cycle, instructionId: instructions[j].id, type: 'Control Hazard Flush', detail });
            stallsInThisCycle.push(detail);
          }
        }
      }
    }

    // Advance pipeline stages in reverse (from WB to IF)
    // Next stage buffer to commit at end of cycle
    const nextStages = instStates.map(s => s.stage);

    for (let i = n - 1; i >= 0; i--) {
      const state = instStates[i];
      if (state.flushed) {
        matrixGrid[i].push('FLUSH');
        continue;
      }

      if (state.stage === -1) {
        // Not yet in pipeline
        matrixGrid[i].push('');
        continue;
      }

      if (isStalled[i]) {
        // Stalled: remain in current stage, record stall in matrix
        matrixGrid[i].push('STALL');
        totalStalls++;
        state.stalledCycles++;
        continue;
      }

      // Record current stage in matrix
      matrixGrid[i].push(PIPELINE_STAGES[state.stage]);
      activeStagesThisCycle[PIPELINE_STAGES[state.stage]] = instructions[i].id;

      // Determine next stage
      if (state.stage === 4) {
        // WB finished
        nextStages[i] = 5;
      } else {
        // Check if next stage is blocked by a stalled subsequent instruction
        let nextStageBlocked = false;
        for (let j = 0; j < i; j++) {
          if (instStates[j].stage === state.stage + 1 && isStalled[j]) {
            nextStageBlocked = true;
            break;
          }
        }

        if (!nextStageBlocked) {
          nextStages[i] = state.stage + 1;
        } else {
          // Cascade stall
          isStalled[i] = true;
        }
      }
    }

    // Check if IF stage is free to fetch the next instruction
    const ifOccupied = instStates.some((s, idx) => !s.flushed && s.stage === 0 && isStalled[idx]);
    if (!ifOccupied && nextToFetch < n) {
      // Check structural hazard blocking fetch
      const blockFetch = enableStructuralHazards && instStates.some((s, idx) => s.stage === 3 && instructions[idx].usesMem);
      if (!blockFetch) {
        nextStages[nextToFetch] = 0; // Enters IF on next cycle
        // If this instruction had not yet started, this cycle's cell is already handled above ('')
        nextToFetch++;
      }
    }

    // Commit updated stages
    for (let i = 0; i < n; i++) {
      instStates[i].stage = nextStages[i];
    }

    // Record utilization
    const activeCount = Object.keys(activeStagesThisCycle).length;
    stageUtilizationHistory.push((activeCount / NUM_STAGES) * 100);

    cycleTimeline.push({
      cycle,
      activeStages: activeStagesThisCycle,
      stallsOccurred: stallsInThisCycle,
      events: cycleEvents
    });

    // Check termination: all instructions are completed (stage >= 5) or flushed
    const allDone = instStates.every(s => s.stage >= 5 || s.flushed);
    if (allDone) {
      break;
    }
  }

  // Format matrix
  const matrix = instructions.map((inst, idx) => ({
    instruction: inst,
    stages: matrixGrid[idx],
    stalls: matrixGrid[idx].filter(s => s === 'STALL').length
  }));

  return {
    cycles: cycle,
    matrix,
    cycleTimeline,
    hazardEvents,
    totalStalls,
    stageUtilizationHistory
  };
}
