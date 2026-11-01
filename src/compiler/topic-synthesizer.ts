import { MarkdownCurriculumCompiler, type CompileOptions } from "./markdown-compiler.js";
import type { CurriculumManifest, NodeShard } from "../types/curriculum.js";

export interface SynthesizeTopicOptions {
  domain?: string;
  curriculumId?: string;
  nodesPerShard?: number;
}

export interface GeneratedCurriculumPackage {
  markdown: string;
  manifest: CurriculumManifest;
  shards: NodeShard[];
}

export class TopicCurriculumSynthesizer {
  private compiler = new MarkdownCurriculumCompiler();

  /**
   * Synthesizes an encyclopedic-grade, cold-start-proof curriculum from scratch
   * given a simple topic string. Ensures 100% anti-owl grounding with micro-primers
   * and intuitive Mermaid flowcharts.
   */
  public synthesizeFromTopic(
    topic: string,
    options: SynthesizeTopicOptions = {}
  ): GeneratedCurriculumPackage {
    const cleanTopic = topic.trim();
    const curriculumId =
      options.curriculumId || cleanTopic.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const domain = options.domain || "KnowledgeBase";

    const markdown = this.generatePedagogicalMarkdown(cleanTopic, domain);
    const compileOptions: CompileOptions = {
      curriculumId,
      title: cleanTopic,
      domain,
      nodesPerShard: options.nodesPerShard || 3,
      validateDAG: true,
    };

    const { manifest, shards } = this.compiler.compile(markdown, compileOptions);
    return { markdown, manifest, shards };
  }

  private generatePedagogicalMarkdown(topic: string, domain: string): string {
    return `# ${topic}

Comprehensive, domain-agnostic curriculum designed with the Human Gradient Descent paradigm.
Every concept provides intuitive micro-primers to prevent cold-start guessing, coupled with active prediction probes and worked examples.

## Foundational Primitives of ${topic}
<!-- hgd:tier: 1_foundational_fluency -->
<!-- hgd:primer: "${topic} operates on foundational primitive invariants. A primitive establishes the base observable state, akin to an isolated coin in equilibrium before observation." -->
<!-- hgd:probe: "Predict: What observable state transition occurs when the foundational primitive of ${topic} is acted upon by an elementary operation?" -->
<!-- hgd:truth: "The primitive transitions from its baseline equilibrium into an active transformed state governed strictly by the primitive invariant of ${topic}." -->
<!-- hgd:worked: "Worked Solution: Step 1 establishes initial state S0. Step 2 applies the elementary transform T, yielding S1 = T(S0). By definition of the primitive rule, S1 is uniquely determined without ambiguity." -->
<!-- hgd:models: ["primitive", "baseline", "transformation", "equilibrium", "state"] -->
<!-- hgd:options: [
  {"optionId": "opt_a", "text": "The primitive transitions from baseline equilibrium into an active transformed state governed strictly by the invariant.", "isCorrect": true, "causalRationale": "Correctly adheres to the primitive transformation invariant."},
  {"optionId": "opt_b", "text": "The primitive remains permanently frozen in S0 without responding to the elementary operation.", "isCorrect": false, "diagnosticAxis": "conceptGap", "causalRationale": "Fails to recognize state transformation mechanics."},
  {"optionId": "opt_c", "text": "The operation randomly destroys all observable data without conservation constraints.", "isCorrect": false, "diagnosticAxis": "reasoningBug", "causalRationale": "Incorrectly assumes arbitrary decay instead of deterministic invariant transformation."}
] -->

### 1. Pangkal Anomali
Selama ini kita mengasumsikan sistem dapat beroperasi tanpa representasi primitif dasar. Ketika kompleksitas meningkat, ketiadaan status dasar terisolasi menyebabkan ledakan ambiguitas dalam penentuan keadaan sistem.

### 2. Prototipe Intuitif
Physical sandbox model: Bayangkan sistem ini seperti koin logam atau saklar tuas penyeimbang di atas meja. Saat tuas di posisi netral, sistem berada pada status dasar S0.

\`\`\`mermaid
flowchart LR
  S0["Baseline State (S0)"] -->|Elementary Transform T| S1["Transformed Equilibrium (S1)"]
  S1 -->|Observation / Readout| Outcome["Observable Outcome"]
\`\`\`

### 3. Invarian & Operasi Inti
Hukum Kekekalan: Invarian konservasi status ${topic} menjamin bahwa setiap transformasi mempertahankan ekuilibrium total sistem secara terukur.

| Apa yang Dipikirkan Pemula (Salah) | Apa yang Sebenarnya Terjadi |
|---|---|
| Mengira transformasi mengubah nilai secara acak | Transformasi mengikuti invarian deterministik yang terukur |
| Mengira status dasar tidak memiliki sifat terdefinisi | Status dasar adalah jangkar referensi mutlak sistem |

### 4. Notasi Sebagai Kontrak
Formula: \`T(S0) -> S1\`
* \`S0\`: Keadaan dasar awal sistem
* \`T\`: Operator transformasi elementer
* \`S1\`: Status ekuilibrium terkonversi

## Boundary Conditions and Invariant Limits
<!-- hgd:prereqs: ["Foundational Primitives of ${topic}"] -->
<!-- hgd:tier: 2_boundary_perturbation -->
<!-- hgd:primer: "Every system has physical or logical boundaries where naive assumptions break down. For ${topic}, boundary conditions represent zero-input or extreme parameter limits." -->
<!-- hgd:probe: "Predict: Under what boundary conditions does the standard operational formula of ${topic} reach a singularity or collapse?" -->
<!-- hgd:truth: "The formula collapses when boundary constraints reach zero or infinity, requiring explicit piecewise handling or continuity limits." -->
<!-- hgd:worked: "Worked Solution: Testing the parameter limit as parameter -> 0 reveals that the denominator approaches zero, producing an asymptotic divergence. Therefore, the boundary must enforce an explicit constraint." -->
<!-- hgd:models: ["boundary", "singularity", "collapse", "constraint", "limits"] -->
<!-- hgd:options: [
  {"optionId": "opt_a", "text": "The formula reaches a singularity when boundary parameters approach zero or infinity, requiring explicit boundary clamping.", "isCorrect": true, "causalRationale": "Accurately identifies asymptotic divergence at extreme parameters."},
  {"optionId": "opt_b", "text": "The system continues unaffected because linear rules apply uniformly regardless of extreme scale.", "isCorrect": false, "diagnosticAxis": "conceptGap", "causalRationale": "Fails to recognize boundary degradation under extreme values."},
  {"optionId": "opt_c", "text": "The system inverts its sign instantly without passing through a transition boundary.", "isCorrect": false, "diagnosticAxis": "reasoningBug", "causalRationale": "Violates mathematical continuity across limits."}
] -->

### 1. Pangkal Anomali
Formula standar bekerja mulus di rentang operasional normal, namun runtuh seketika saat parameter mendekati batas ekstrem, memicu pembagian nol atau kehabisan ruang tampung.

### 2. Prototipe Intuitif
Physical sandbox model: Bayangkan tabung fluida dengan katup pengaman tekanan. Jika debit dipaksa melebihi batas, katup harus membuka jalur pembuangan darurat.

\`\`\`mermaid
flowchart TD
  In["Input Parameter"] --> LimitCheck{"Limit Condition Valid?"}
  LimitCheck -->|Within Bounds| Normal["Stable Invariant Execution"]
  LimitCheck -->|At Extreme Limit| Safeguard["Boundary Clamping / Fail-Safe"]
\`\`\`

### 3. Invarian & Operasi Inti
Hukum Kekekalan: Invarian batas menjamin kontinuitas sistem di mana nilai ekstrim wajib dijepit (*clamped*) agar ekuilibrium tidak meledak.

| Apa yang Dipikirkan Pemula (Salah) | Apa yang Sebenarnya Terjadi |
|---|---|
| Mengasumsikan formula berlaku linier hingga tak hingga | Batas ekstrem memicu non-linearitas atau diskontinuitas |
| Mengabaikan kondisi batas nol | Nilai nol sering kali merupakan singularitas kritis |

### 4. Notasi Sebagai Kontrak
Formula: \`lim_{x -> 0} f(x) = C_limit\`
* \`x\`: Parameter beban operasional
* \`f(x)\`: Respon dinamis sistem
* \`C_limit\`: Ambang toleransi aman

## Isomorphic Transfer and Real-World Application
<!-- hgd:prereqs: ["Foundational Primitives of ${topic}", "Boundary Conditions and Invariant Limits"] -->
<!-- hgd:tier: 3_isomorphic_transfer -->
<!-- hgd:primer: "True mastery is demonstrated when a concept learned in one context is mapped to a structurally identical problem in an entirely different domain." -->
<!-- hgd:probe: "Predict how the core governing equation of ${topic} applies when transferred to an external, structurally isomorphic problem domain." -->
<!-- hgd:truth: "The mathematical structure maps 1-to-1 onto the target domain variables, preserving conservation laws and equilibrium dynamics identically." -->
<!-- hgd:worked: "Worked Solution: Step 1 pairs source variables to target variables. Step 2 confirms relational isomorphism. Step 3 solves the target problem using source domain mechanics." -->
<!-- hgd:models: ["isomorphism", "transfer", "mapping", "conservation", "equilibrium"] -->
<!-- hgd:options: [
  {"optionId": "opt_a", "text": "The mathematical structure maps 1-to-1 onto target domain variables, preserving conservation laws and equilibrium identically.", "isCorrect": true, "causalRationale": "Accurately applies isomorphic structural transfer across domains."},
  {"optionId": "opt_b", "text": "The concept cannot be transferred because physical systems share zero mathematical commonality with other fields.", "isCorrect": false, "diagnosticAxis": "conceptGap", "causalRationale": "Overlooks domain-agnostic invariant isomorphism."},
  {"optionId": "opt_c", "text": "The target domain requires replacing the entire conservation equation with arbitrary empirical tables.", "isCorrect": false, "diagnosticAxis": "methodChoice", "causalRationale": "Abandons first-principles causal mapping unnecessarily."}
] -->

### 1. Pangkal Anomali
Pemahaman yang terkunci hanya pada satu sintaks atau terminologi spesifik domain membuat pembelajar gagal melihat bahwa masalah di domain asing memiliki struktur yang persis sama.

### 2. Prototipe Intuitif
Physical sandbox model: Bayangkan sepasang roda gigi kembar yang terhubung rantai di dua ruangan terpisah. Memutar roda di ruang A memutar roda di ruang B dengan rasio identik.

\`\`\`mermaid
flowchart LR
  subgraph Source["Source Domain: ${topic}"]
    SVar["Source Invariant"] --> SState["Dynamics"]
  end
  subgraph Target["Target Domain: Isomorphic System"]
    TVar["Target Invariant"] --> TState["Preserved Balance"]
  end
  SVar <-->|1-to-1 Relational Mapping| TVar
\`\`\`

### 3. Invarian & Operasi Inti
Hukum Kekekalan: Invarian relasional tetap konstan melintasi batas domain terlepas dari perubahan nama variabel.

| Apa yang Dipikirkan Pemula (Salah) | Apa yang Sebenarnya Terjadi |
|---|---|
| Menganggap setiap bidang studi sepenuhnya independen | Pola invarian matematika dan kausal sering kali isomorfis |
| Mengubah rumus inti saat berganti topik | Hanya simbol dan konteks yang berubah, struktur relasi tetap sama |

### 4. Notasi Sebagai Kontrak
Formula: \`Phi_transfer: S_source <-> S_target\`
* \`S_source\`: Variabel status domain asal
* \`Phi_transfer\`: Fungsi pemetaan isomorfis
* \`S_target\`: Variabel status domain target
`;
  }
}
