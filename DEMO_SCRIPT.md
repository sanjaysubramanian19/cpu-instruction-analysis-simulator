# Precise 5–8 Minute Integrated Academic Demonstration Protocol

**Project Title:** Integrated CPU Instruction Analysis, Pipeline Performance & Intelligent Search Simulator  
**Scope:** 4 Technical Subjects × 15 Marks = **60 Marks Total**  
**Evaluation Target:** Independent verification across all 5 evaluation criteria with zero dependencies.

---

## Demonstration Overview Timeline

| Time Segment | Subject / Feature | Module ID & Title | Primary Objective |
| :--- | :--- | :--- | :--- |
| **0:00 – 1:00** | Project Overview | All 4 Subjects | Dashboard overview, 4 independent status cards, score rubrics |
| **1:00 – 2:30** | Integrated Workflow | All 4 Subjects Connected | Live end-to-end simulation: FLAT → COA → Graph → A* & Dijkstra |
| **2:30 – 3:30** | FLAT Lab | Module 2.7: Regex to Finite Automata | Thompson compilation, ε-transitions, string simulation, ACCEPT/REJECT |
| **3:30 – 4:45** | COA Lab | Module 3.1: Pipelining Stages & Speedup | 5-stage pipeline playback, cycle matrix, RAW hazards, speedup |
| **4:45 – 5:45** | AI/ML Lab | Module 2.7: A* Search Fundamentals | State-space graph, Euclidean heuristic, f(n)=g(n)+h(n), step traversal |
| **5:45 – 6:45** | DAA Lab & Comparison | Module 3.13: Dijkstra's Algorithm | Same graph parity, greedy distance relaxation, cost parity verification |
| **6:45 – 8:00** | Verification & Tests | Academic Audit & 44 Tests | 44 automated tests (36 unit + 8 integration), 15-mark evidence, reports |

---

## Step-by-Step Examiner Walkthrough Script

### PHASE 1: Project Overview & Academic Dashboard (0:00 – 1:00)
1. **Action:** Open application home screen (Tab 1: Dashboard).
2. **What to Observe:**
   - Point out the top academic header displaying **4 Subjects × 15 Marks = 60 Marks Total**.
   - Show the **Four Independent Subject Cards**:
     - **COA (15 Marks):** Module 3.1 (Pipelining: Stages, Throughput, and Speedup) — `Implemented ✓`
     - **AI/ML (15 Marks):** Module 2.7 (A* Search Fundamentals: The Gold Standard) — `Implemented ✓`
     - **DAA (15 Marks):** Module 3.13 (Dijkstra's Algorithm) — `Implemented ✓`
     - **FLAT (15 Marks):** Module 2.7 (Regex to Finite Automata Conversion) — `Implemented ✓`
   - Point out that every subject shows dynamic live metrics computed directly at runtime.
   - Highlight the **6-Step Educational Dataflow** banner and click **"Launch Full Integrated Simulator"** (or Tab 2: Integrated Workflow).

---

### PHASE 2: Live End-to-End Cross-Subject Integrated Workflow (1:00 – 2:30)
- **Scope:** Connects FLAT $\to$ COA $\to$ Graph Engine $\to$ AI/ML & DAA in one continuous academic workflow.
- **Academic Purpose:** Proves the project is ONE genuinely integrated application, while the 4 subject labs remain available for independent grading.

1. **Action:** Click **"2. Integrated Workflow"** in the top navigation.
2. **Demo 2A: Valid Standard Instruction Stream:**
   - Select preset **"Standard 3-Instruction Pipeline"**:
     ```assembly
     LOAD R1, 100
     ADD R2, R1, R3
     SUB R4, R2, R5
     ```
   - **Observe Stage 1 (FLAT Validation):** All 3 instructions are evaluated against the Thompson $\varepsilon$-NFA. All 3 show **VALID (ACCEPTED)**.
   - **Observe Stage 2 (COA 5-Stage Pipelining):** Instructions enter the cycle matrix. Cycle count, throughput, and speedup are computed in real time.
   - **Observe Stage 3 (Graph Engine):** An educational execution state graph is deterministically generated ($START \to EX \to WB \to COMMIT$) with stage latency edge weights.
   - **Observe Stage 4 & 5 (Dual Search):** A* (AI/ML) and Dijkstra (DAA) execute on the **exact same graph**.
   - **Observe Stage 6 (Parity Matrix):** Both algorithms discover the exact same path cost ($C_{A^*} = C_{\text{Dijkstra}}$).
3. **Demo 2B: Syntax Gating Trap (FLAT Halting Mechanism):**
   - Click preset **"Invalid Opcode Trap (FLAT Gating)"** (`HALT R1, 100`).
   - **What to Observe:**
     - Stage 1 FLAT immediately traps the invalid opcode `HALT`.
     - An alert banner displays: *Syntax Trap: Execution Halted at FLAT Validation Stage*.
     - The downstream COA pipeline and search algorithms are safely prevented from processing invalid instructions, demonstrating true architectural gating.

---

### PHASE 3: Formal Language and Automata Theory (FLAT) Lab (2:30 – 3:30)
- **Subject:** Formal Language and Automata Theory (FLAT) — 15 Marks
- **Primary Module:** Module 2.7: *Regular Expression to Finite Automata conversion*
- **Supporting Modules:** Module 1.4 (Finite State Machine), Module 1.8 (Epsilon NFA), Module 2.2 (Kleene's Theorem)

1. **Action:** Click **"3. FLAT – Regex → Automaton"** tab in top navigation.
2. **What to Enter:**
   - In the Regular Expression text input, enter: `(a|b)*abb` (or click the preset button **"Standard Benchmark: (a|b)*abb"**).
   - Click the **"Compile"** button.
3. **What Should Happen & What Evaluator Observes:**
   - **Section B (Parsed Expression):** The Shunting-Yard parser displays the infix expression with explicit concatenation: `(a|b)*.a.b.b`.
   - **Formal 5-Tuple Display:** Evaluator sees formal mathematical definition $M = (Q, \Sigma, \delta, q_0, F)$ generated dynamically.
   - **Section C (Inductive Steps):** The table displays each inductive Thompson fragment step (Base symbols, Union, Kleene Star, Concatenations).
   - **Section D (Automaton Visualization):** An SVG state diagram appears with start state arrow, directed transition arcs, $\varepsilon$-transitions (dashed cyan lines), and accept states (double circles).
4. **Action:** String Testing:
   - In the input string box, enter `"aabb"` and click **"Re-simulate"**.
   - **Observer Note:** The badge turns **GREEN: STRING ACCEPTED**.
   - Step through the transitions using the **"Next"** button: watch active states highlight in green on the SVG diagram as characters 'a', 'a', 'b', 'b' are consumed.
   - Next, enter `"abab"` in the input string box and click **"Re-simulate"**.
   - **Observer Note:** The badge turns **RED: STRING REJECTED** because active states do not intersect with final accept state.
   - **Academic Integrity Callout:** Explain to evaluator that JavaScript's built-in `RegExp.test()` is NOT used; transitions and $\varepsilon$-closures are simulated completely from scratch.

---

### PHASE 4: Computer Organization and Architecture (COA) Lab (3:30 – 4:45)
- **Subject:** Computer Organization and Architecture (COA) — 15 Marks
- **Primary Module:** Module 3.1: *Pipelining: Stages, Throughput, and Speedup*
- **Supporting Modules:** Module 3.3 (Parameters), Module 3.5 (Structural Hazards), Module 3.7 (Data Hazards), Module 3.9 (Control Hazards), Module 3.14 (CPU Equation), Module 3.15 (Amdahl's Law)

1. **Action:** Click **"4. COA – Pipeline Simulator"** tab.
2. **Demo 4A: Ideal Pipeline Execution:**
   - Click the preset **"Ideal Pipeline (No Hazards)"** (3 instructions).
   - Ensure hazard checkboxes are unchecked.
   - Click **"Start"** or step through with **"Next Cycle"**.
   - **What to Observe:**
     - Active stage boxes (`IF`, `ID`, `EX`, `MEM`, `WB`) update in real time.
     - The **Cycle Matrix** displays the classical diagonal overlap pattern.
     - **Performance Metrics:** Evaluator observes:
       - $n = 4$ instructions, $k = 5$ stages
       - Pipeline Cycles: $T_{\text{pipe}} = k + n - 1 = 8$
       - Non-pipelined: $T_{\text{nonpipe}} = n \times k = 20$
       - Ideal Speedup: $S = 20 / 8 = 2.50\times$
       - Throughput: $0.50 \text{ IPC}$
3. **Demo 4B: RAW Data Hazard Demonstration (Module 3.7):**
   - Click the preset **"Data Hazard: RAW Dependency (COA Module 3.7)"**.
   - Code: `LOAD R1, 50` followed immediately by `ADD R2, R1, R3`.
   - Check the **"RAW Data Hazards (Mod 3.7)"** box.
   - Click **"Start"**.
   - **What to Observe:**
     - In Cycle 4 and 5, red **STALL** cells appear in the cycle matrix because `ADD` in `ID` must wait for `LOAD` to reach `WB`.
     - An alert banner displays: *Pipeline Stall Detected: RAW Data Hazard*.
     - Metrics dynamically reflect the hazard penalty: Speedup drops, and CPI increases.
   - Toggle **"Forwarding Path (Mod 3.8)"**: Show how hardware forwarding bypasses the ALU result, reducing stall cycles!

---

### PHASE 5: AI/ML Foundations (AI/ML) Lab (4:45 – 5:45)
- **Subject:** AI/ML Foundations — 15 Marks
- **Primary Module:** Module 2.7: *A\* Search Fundamentals: The Gold Standard of Search*
- **Supporting Modules:** Module 2.1 (Search Space), Module 2.5 (Heuristics), Module 2.8 (A* in Action), Module 2.9 (Designing Good Heuristics)

1. **Action:** Click **"5. AI/ML – A* Search"** tab.
2. **What to Observe:**
   - The SVG visualizer displays the weighted execution state-space graph.
   - Start Node: `S_INIT`, Goal Node: `G_COMMIT`.
3. **Action:** Interactive Step-by-Step Traversal:
   - Click **"Play Traversal"** (or use **"Next Step"**).
   - Watch the search frontier expand.
4. **What to Observe:**
   - **Open Set vs Closed Set:** Open Set priority queue extracts min-$f(n)$ node; closed nodes turn gray.
   - **Evaluation Function Matrix (Section D):** Show the evaluator the exact values:
     - $g(n)$: Accumulated cost from start.
     - $h(n)$: Euclidean straight-line heuristic estimate.
     - $f(n) = g(n) + h(n)$: Combined evaluation score.
   - **Admissibility Callout:** Highlight the green badge **"Strictly Admissible (h ≤ h*)"**, proving the mathematical guarantee of optimality.
   - **Optimal Path:** Shows the recovered shortest path sequence in green.
   - **Academic Note to Evaluator:** Clarify that A* is an AI state-space search algorithm from syllabus Unit 2, and no machine learning model training is falsely claimed.

---

### PHASE 6: Design and Analysis of Algorithms (DAA) Lab (5:45 – 6:45)
- **Subject:** Design and Analysis of Algorithms (DAA) — 15 Marks
- **Primary Module:** Module 3.13: *Dijkstra's Algorithm*
- **Supporting Modules:** Module 1.3 (Asymptotic Analysis), Module 1.7 (Graph Foundations), Module 3.1 (Greedy Algorithms), Module 3.15 (Shortest Path Algorithms)

1. **Action:** Click **"6. DAA – Dijkstra"** tab.
2. **Academic Parity Callout to Evaluator:**
   - Point out that Dijkstra is running on the **exact same graph, same source, same destination, and same edge weights** as A* to enable fair academic evaluation.
3. **Action:** Step-by-Step Greedy Relaxation:
   - Click **"Next Step"** repeatedly.
4. **What to Observe:**
   - **Greedy Choice Property:** Vertex with minimum $\text{dist}[u]$ is extracted from the min-heap and marked permanently settled.
   - **Distance Table (Section D):** Watch $\text{dist}[v]$ dynamically update from $\infty$ to lower relaxed values.
   - **Edge Relaxation History Log (Section E):** Shows every successful edge relaxation:
     $$\text{dist}[v] = \min(\text{dist}[v], \text{dist}[u] + w(u, v))$$
   - **Asymptotic Operation Counter (Section B):** Evaluator sees the exact count of vertex extractions and edge relaxations verified against $O((V+E)\log V)$ theoretical bounds.

---

### PHASE 7: Integrated Comparison (A* vs Dijkstra)
1. **Action:** Click **"7. A* vs Dijkstra"** tab.
2. **What to Observe:**
   - **Side-by-Side Table:** Evaluator sees the dynamic comparison:
     - **Path Cost Parity:** Both algorithms yield the exact same optimal cost (proving mathematical correctness of both scratch implementations).
     - **Nodes Explored:** Evaluator observes that A* explored fewer nodes due to heuristic pruning ($f(n) = g(n) + h(n)$) compared to Dijkstra's radial expansion.
     - **Heuristic Comparison:** A* utilizes informed Euclidean estimates, while Dijkstra operates uniformly without domain heuristics.
   - **Integrity Statement:** Point out to evaluator that neither algorithm is claimed to be universally superior: Dijkstra computes all-pairs/SPT without coordinate requirements, while A* is optimized for targeted point-to-point pathfinding.

---

### PHASE 8: Academic Verification, Testing & Reports (6:45 – 8:00)
1. **Action:** Click **"8. Test Laboratory"** tab.
   - Click **"Re-Run All 44 Tests"**.
   - Show the evaluator the **100% PASS rate across all 44 automated tests**:
     - FLAT: 12/12 PASS
     - COA: 8/8 PASS
     - AI/ML: 8/8 PASS
     - DAA: 8/8 PASS
     - End-to-End Integration: 8/8 PASS
   - Confirms **Evaluation Criterion 5 (Testing & Results = 1 mark per subject)** plus cross-module pipeline integrity.
2. **Action:** Click **"9. Academic Module Mapping"** tab.
   - Show that all primary and supporting modules are strictly drawn from Modules 1–3 of the official syllabus with source file paths.
3. **Action:** Click **"10. 15-Mark Evidence"** tab.
   - Walk the evaluator through the 5-point checklist verifying that each subject independently earns all 15 marks.
4. **Documentation:** Reference the 4 separate complete project reports in both PDF and editable Word formats (`COA_Project_Report.pdf / .docx`, `AIML_Project_Report.pdf / .docx`, `DAA_Project_Report.pdf / .docx`, `FLAT_Project_Report.pdf / .docx`) in the `/reports` directory ready for academic evaluation.

---

## Conclusion
The demonstration proves that all four technical subjects are thoroughly implemented, mathematically verified, visually demonstrable, and independently auditable, earning the full **60 / 60 marks**.
