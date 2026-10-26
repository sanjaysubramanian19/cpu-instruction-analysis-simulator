/**
 * COA Engine: Pipeline Performance Metrics & Mathematical Formulas
 * Academic Reference:
 *   - COA Module 3.1: Pipelining: Stages, Throughput, and Speedup (PRIMARY)
 *   - COA Module 3.3: Pipeline Performance Parameters
 *   - COA Module 3.12: Pipeline Performance Analysis with Hazards
 *   - COA Module 3.14: CPU Performance Equation
 *   - COA Module 3.15: Amdahl's Law and Optimization Limits
 */

import { NUM_STAGES } from './pipelineSimulator.js';

/**
 * Calculates theoretical and empirical pipeline performance metrics.
 * @param {number} n - Number of instructions
 * @param {number} actualCycles - Total cycles measured from simulation
 * @param {number} totalStalls - Stall cycles inserted due to hazards
 * @param {Array<Object>} matrix - Detailed cycle matrix
 * @param {number} clockPeriodNs - Clock cycle time in nanoseconds (default: 1ns)
 * @returns {Object} Comprehensive performance parameters
 */
export function calculatePipelineMetrics(n, actualCycles, totalStalls = 0, matrix = [], clockPeriodNs = 1.0) {
  const k = NUM_STAGES; // 5 stages

  if (n <= 0) {
    return {
      n: 0,
      k,
      nonPipelinedCycles: 0,
      idealPipelinedCycles: 0,
      actualCycles: 0,
      totalStalls: 0,
      idealSpeedup: 1.0,
      actualSpeedup: 1.0,
      theoreticalMaxSpeedup: k,
      throughput: 0,
      idealThroughput: 0,
      utilizationPercentage: 0,
      cpi: 1.0,
      idealCpi: 1.0,
      cpuExecutionTimeNs: 0,
      amdahlSpeedupLimit: k
    };
  }

  // 1. Cycle Timing
  const nonPipelinedCycles = n * k;
  const idealPipelinedCycles = k + n - 1;
  const effectiveCycles = actualCycles > 0 ? actualCycles : (idealPipelinedCycles + totalStalls);

  // 2. Speedup Calculations (Module 3.1 & 3.3)
  const idealSpeedup = nonPipelinedCycles / idealPipelinedCycles;
  const actualSpeedup = nonPipelinedCycles / effectiveCycles;
  const theoreticalMaxSpeedup = k; // As n -> infinity, S -> k = 5

  // 3. Throughput: Instructions completed per clock cycle (Module 3.1 & 3.3)
  const throughput = n / effectiveCycles;
  const idealThroughput = n / idealPipelinedCycles;

  // 4. Stage Utilization: Active stage occurrences / (k * Total Cycles) (Module 3.1)
  let totalActiveStages = 0;
  if (matrix && matrix.length > 0) {
    for (const row of matrix) {
      for (const cell of row.stages) {
        if (cell && cell !== 'STALL' && cell !== '') {
          totalActiveStages++;
        }
      }
    }
  } else {
    totalActiveStages = n * k;
  }
  const utilizationPercentage = (totalActiveStages / (k * effectiveCycles)) * 100;

  // 5. CPI: Cycles Per Instruction (Module 3.14 CPU Performance Equation)
  const cpi = effectiveCycles / n;
  const idealCpi = idealPipelinedCycles / n;
  const cpuExecutionTimeNs = n * cpi * clockPeriodNs;

  // 6. Amdahl's Law Optimization Limits (Module 3.15)
  // S_Amdahl = 1 / ((1 - p) + (p / s)), where p = parallelizable fraction (assume 0.95 for pipeline)
  const p = 0.95;
  const amdahlSpeedupLimit = 1 / ((1 - p) + (p / k));

  return {
    n,
    k,
    nonPipelinedCycles,
    idealPipelinedCycles,
    actualCycles: effectiveCycles,
    totalStalls,
    idealSpeedup: Number(idealSpeedup.toFixed(2)),
    actualSpeedup: Number(actualSpeedup.toFixed(2)),
    theoreticalMaxSpeedup: k,
    throughput: Number(throughput.toFixed(4)),
    idealThroughput: Number(idealThroughput.toFixed(4)),
    utilizationPercentage: Number(utilizationPercentage.toFixed(2)),
    cpi: Number(cpi.toFixed(2)),
    idealCpi: Number(idealCpi.toFixed(2)),
    cpuExecutionTimeNs: Number(cpuExecutionTimeNs.toFixed(2)),
    amdahlSpeedupLimit: Number(amdahlSpeedupLimit.toFixed(2))
  };
}
