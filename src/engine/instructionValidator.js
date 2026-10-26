/**
 * FLAT -> COA Bridge: CPU Instruction Validator & Parser
 * Academic Reference:
 *   - FLAT Module 2.7: Regular Expression to Finite Automata conversion
 *   - COA Module 3.1: Pipelining: Stages, Throughput, and Speedup
 *
 * Provides:
 * 1. Assembly instruction tokenization and parsing
 * 2. Formal syntax verification using FLAT automaton principles
 * 3. Default academic program presets (linear, RAW data hazards, structural hazards, branches)
 */

export const INSTRUCTION_TYPES = {
  LOAD: { opcode: 'LOAD', stages: ['IF', 'ID', 'EX', 'MEM', 'WB'], usesMem: true, writesReg: true },
  STORE: { opcode: 'STORE', stages: ['IF', 'ID', 'EX', 'MEM', 'WB'], usesMem: true, writesReg: false },
  ADD: { opcode: 'ADD', stages: ['IF', 'ID', 'EX', 'MEM', 'WB'], usesMem: false, writesReg: true },
  SUB: { opcode: 'SUB', stages: ['IF', 'ID', 'EX', 'MEM', 'WB'], usesMem: false, writesReg: true },
  MUL: { opcode: 'MUL', stages: ['IF', 'ID', 'EX', 'MEM', 'WB'], usesMem: false, writesReg: true },
  BEQ: { opcode: 'BEQ', stages: ['IF', 'ID', 'EX', 'MEM', 'WB'], usesMem: false, writesReg: false, isBranch: true }
};

/**
 * Standard Academic Program Presets
 */
export const PRESET_PROGRAMS = {
  BASIC_ARITHMETIC: {
    id: 'basic',
    name: 'Ideal Pipeline (No Hazards)',
    description: 'Independent arithmetic operations demonstrating maximum throughput and ideal speedup.',
    code: `LOAD R1, 100\nADD R2, R3, R4\nSUB R5, R6, R7\nMUL R8, R9, R10`
  },
  DATA_HAZARD_RAW: {
    id: 'data_hazard',
    name: 'Data Hazard: RAW Dependency (COA Module 3.7)',
    description: 'Read-After-Write conflict: ADD reads R1 immediately after LOAD writes to R1.',
    code: `LOAD R1, 50\nADD R2, R1, R3\nSUB R4, R2, R5\nMUL R6, R4, R7`
  },
  STRUCTURAL_HAZARD: {
    id: 'structural_hazard',
    name: 'Structural Hazard: Memory Contention (COA Module 3.5)',
    description: 'Simultaneous instruction fetch and data memory access on single-port memory.',
    code: `LOAD R1, 100\nADD R2, R3, R4\nLOAD R5, 200\nSUB R6, R7, R8\nLOAD R9, 300`
  },
  CONTROL_HAZARD: {
    id: 'control_hazard',
    name: 'Control Hazard: Branch Penalty (COA Module 3.9)',
    description: 'Conditional branch BEQ causing pipeline flush and stall penalty.',
    code: `LOAD R1, 10\nADD R2, R3, R4\nBEQ R1, R2, 2\nSUB R5, R6, R7\nMUL R8, R9, R10`
  },
  TEN_INSTRUCTION_BENCHMARK: {
    id: 'benchmark_10',
    name: '10-Instruction Speedup Benchmark',
    description: 'Standard 10-instruction sequence for theoretical speedup verification.',
    code: `LOAD R1, 10\nADD R2, R10, R11\nSUB R3, R12, R13\nMUL R4, R14, R15\nLOAD R5, 20\nADD R6, R16, R17\nSUB R7, R18, R19\nMUL R8, R20, R21\nLOAD R9, 30\nADD R10, R22, R23`
  }
};

/**
 * Parses an individual assembly line into an instruction record.
 * Formats:
 *   LOAD Rd, imm / [addr]
 *   STORE Rs, imm / [addr]
 *   ADD Rd, Rs, Rt
 *   SUB Rd, Rs, Rt
 *   MUL Rd, Rs, Rt
 *   BEQ Rs, Rt, offset
 * @param {string} line - Raw assembly line
 * @param {number} index - Instruction sequence index
 * @returns {{ valid: boolean, instruction: Object | null, error: string | null }}
 */
export function parseInstructionLine(line, index = 0) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('//')) {
    return { valid: false, instruction: null, error: 'Empty line or comment' };
  }

  // Tokenize by spaces and commas
  const parts = trimmed.split(/[\s,]+/).filter(Boolean);
  if (parts.length === 0) {
    return { valid: false, instruction: null, error: 'Empty instruction' };
  }

  const opcode = parts[0].toUpperCase();
  const def = INSTRUCTION_TYPES[opcode];

  if (!def) {
    return { valid: false, instruction: null, error: `Unknown opcode: ${opcode}` };
  }

  const inst = {
    id: `I${index + 1}`,
    index,
    raw: trimmed,
    opcode,
    dest: null,
    src1: null,
    src2: null,
    imm: null,
    isBranch: !!def.isBranch,
    usesMem: !!def.usesMem,
    writesReg: !!def.writesReg
  };

  if (opcode === 'LOAD') {
    if (parts.length < 3) return { valid: false, instruction: null, error: 'LOAD expects: LOAD Rd, imm' };
    inst.dest = parts[1].toUpperCase();
    inst.imm = parts[2];
  } else if (opcode === 'STORE') {
    if (parts.length < 3) return { valid: false, instruction: null, error: 'STORE expects: STORE Rs, addr' };
    inst.src1 = parts[1].toUpperCase();
    inst.imm = parts[2];
  } else if (opcode === 'ADD' || opcode === 'SUB' || opcode === 'MUL') {
    if (parts.length < 4) return { valid: false, instruction: null, error: `${opcode} expects: ${opcode} Rd, Rs, Rt` };
    inst.dest = parts[1].toUpperCase();
    inst.src1 = parts[2].toUpperCase();
    inst.src2 = parts[3].toUpperCase();
  } else if (opcode === 'BEQ') {
    if (parts.length < 4) return { valid: false, instruction: null, error: 'BEQ expects: BEQ Rs, Rt, offset' };
    inst.src1 = parts[1].toUpperCase();
    inst.src2 = parts[2].toUpperCase();
    inst.imm = parts[3];
  }

  return { valid: true, instruction: inst, error: null };
}

/**
 * Validates and parses a multi-line program script.
 * @param {string} programText - Multi-line program code
 * @returns {{ instructions: Array<Object>, errors: Array<string> }}
 */
export function parseProgram(programText) {
  const lines = programText.split('\n');
  const instructions = [];
  const errors = [];

  let instCount = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim() || line.trim().startsWith('#') || line.trim().startsWith('//')) {
      continue;
    }

    const { valid, instruction, error } = parseInstructionLine(line, instCount);
    if (valid && instruction) {
      instructions.push(instruction);
      instCount++;
    } else {
      errors.push(`Line ${i + 1}: ${error}`);
    }
  }

  return { instructions, errors };
}
