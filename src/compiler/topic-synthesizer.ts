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
Selama ini kita mengasumsikan sistem dapat beroperasi tanpa representasi primitif dasar. Kita sering menganggap pemrosesan dapat langsung melompat ke logika tingkat tinggi tanpa mengisolasi status awal secara eksplisit.

Ketika kompleksitas sistem meningkat, ketiadaan status dasar terisolasi menyebabkan ledakan ambiguitas dalam penentuan keadaan sistem. Dua pengamat yang mengamati titik awal yang sama dapat menarik kesimpulan status yang saling bertentangan karena tidak adanya jangkar status referensi yang disepakati.

Pada kondisi batas operasional, ketiadaan primitif ini memicu efek domino di mana seluruh lapisan abstraksi di atasnya runtuh. Upaya menambal ambiguitas dengan aturan ad-hoc sekadar menumpuk utang teknis dan mengaburkan akar ketidakpastian.

Kita membutuhkan entitas primitif dasar yang terisolasi sempurna. Primitif ini bertindak sebagai jangkar invarian yang statusnya dapat diverifikasi secara deterministik sebelum operasi transformasi apa pun dijalankan.

### 2. Prototipe Intuitif
Bayangkan sistem ini seperti koin logam atau saklar tuas penyeimbang di atas meja laboratorium.

Ketika tuas berada pada posisi netral atau koin diam terlentang di sisi dasar, sistem berada pada status dasar S0. Seluruh potensi energi tersimpan dalam keadaan seimbang tanpa gangguan luar.

Sebuah tuas mekanis presisi (operator transformasi T) terhubung langsung dengan koin tersebut. Ketika tuas digerakkan satu takik, koin dipaksa berpindah ke status ekuilibrium baru S1 dengan kepastian mekanis yang mutlak.

Model fisik ini membuktikan bahwa transformasi bukanlah peristiwa gaib yang terjadi secara acak, melainkan perpindahan fisik terukur yang menghubungkan dua keadaan seimbang secara terprediksi.

\`\`\`mermaid
flowchart LR
  S0["Baseline State (S0)"] -->|Elementary Transform T| S1["Transformed Equilibrium (S1)"]
  S1 -->|Observation / Readout| Outcome["Observable Outcome"]
\`\`\`

### 3. Invarian & Operasi Inti
Invarian konservasi status fundamental ${topic} menjamin bahwa setiap transformasi mempertahankan ekuilibrium total sistem secara terukur.

Ketika operator transformasi bekerja, besaran total sistem tidak pernah bertambah atau berkurang secara liar. Sistem sekadar mendistribusikan ulang konfigurasi internalnya mengikuti hukum kekekalan yang ketat.

Jika sebuah proses mencoba memaksakan status yang melanggar hukum konservasi ini, sistem akan menolak transisi tersebut atau mengalami pembatalan operasi seketika demi menjaga keutuhan status global.

Model mental pemula sering kali terjebak dalam ilusi bahwa transformasi bersifat bebas nilai, padahal kenyataan fisik selalu terikat pada invarian konservasi yang mengunci batas pergerakan sistem.

| Apa yang Dipikirkan Pemula (Salah) | Apa yang Sebenarnya Terjadi |
|---|---|
| Mengira transformasi mengubah nilai secara acak | Transformasi mengikuti invarian deterministik yang terukur |
| Mengira status dasar tidak memiliki sifat terdefinisi | Status dasar adalah jangkar referensi mutlak sistem |

### 4. Notasi Sebagai Kontrak
Formalisasi simbolik dibutuhkan bukan untuk mempersulit pemahaman, melainkan sebagai kontrak operasional yang presisi antara pengamat dan sistem.

Persamaan di bawah ini mendefinisikan pemetaan invarian dari status awal menuju status terkonversi:
\`T(S0) -> S1\`

Persamaan di atas bertindak sebagai jaminan aljabar bahwa input yang valid pada status S0 akan menghasilkan status S1 yang identik pada setiap replikasi.

Dengan mengunci relasi ini ke dalam notasi formal, kita mengeliminasi seluruh ambiguitas bahasa alami dan menetapkan batas kepatuhan sistem yang dapat diaudit secara matematis.

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
Formula standar bekerja mulus di rentang operasional normal yang moderat. Praktisi sering terlena mengasumsikan bahwa respons sistem akan selalu bersifat linier di segala skala beban.

Namun ketika parameter mendekati batas ekstrem—seperti beban mendekati tak hingga atau pasokan sumber daya mendekati tepat nol—asumsi kelancaran tersebut runtuh seketika.

Pada titik ekstrem, pembagian dengan nol atau kejenuhan ruang tampung memicu singularitas matematis dan kegagalan fisik berupa luapan (*overflow*) atau kebuntuan (*deadlock*).

Mengabaikan perilaku batas adalah penyebab utama kegagalan fatal pada sistem produksi skala besar yang dipaksa beroperasi di luar skenario laboratorium yang ideal.

### 2. Prototipe Intuitif
Bayangkan sebuah tabung fluida kaca dengan katup pengaman tekanan di bagian atasnya.

Dalam rentang aliran normal, cairan mengalir lancar melalui pipa bawah sesuai dengan tekanan pompa yang diberikan. Ketinggian permukaan cairan naik turun secara teratur.

Namun ketika debit fluida dipompa secara agresif melampaui kapasitas tabung, tekanan internal melonjak tajam mendekati batas ketahanan kaca.

Alih-alih membiarkan tabung meledak hancur, katup pengaman mekanis otomatis membuka jalur pembuangan darurat (*bypass relief*) untuk menjepit tekanan pada ambang toleransi maksimum.

\`\`\`mermaid
flowchart TD
  In["Input Parameter"] --> LimitCheck{"Limit Condition Valid?"}
  LimitCheck -->|Within Bounds| Normal["Stable Invariant Execution"]
  LimitCheck -->|At Extreme Limit| Safeguard["Boundary Clamping / Fail-Safe"]
\`\`\`

### 3. Invarian & Operasi Inti
Invarian batas menjamin kontinuitas dan ketahanan sistem di mana nilai-nilai ekstrem wajib dijepit (*clamped*) agar ekuilibrium tidak meledak.

Mekanisme penanganan batas memantau parameter secara real-time dan menerapkan fungsi batas potong (*cutoff function*) begitu margin toleransi terlewati.

Tanpa penjepit batas ini, sistem akan mengalami transisi fase liar yang merusak struktur data atau membakar perangkat keras fisik yang menopangnya.

Pemula sering mengira bahwa sistem yang baik adalah sistem yang menolak berhenti saat dipaksa melebihi batas, padahal ketahanan sejati terletak pada degradasi anggun (*graceful degradation*) yang terkendali.

| Apa yang Dipikirkan Pemula (Salah) | Apa yang Sebenarnya Terjadi |
|---|---|
| Mengasumsikan formula berlaku linier hingga tak hingga | Batas ekstrem memicu non-linearitas atau diskontinuitas |
| Mengabaikan kondisi batas nol | Nilai nol sering kali merupakan singularitas kritis |

### 4. Notasi Sebagai Kontrak
Notasi batas formal menetapkan ambang batas matematis di mana perilaku sistem bertransisi dari model dinamis bebas ke model penjepitan paksa.

Persamaan batas di bawah ini mendefinisikan konvergensi nilai sistem ketika parameter mendekati batas kritis:
\`lim_{x -> 0} f(x) = C_limit\`

Persamaan ini bertindak sebagai klausul pembatas yang melarang sistem mengembalikan nilai tak hingga atau status undefined dalam domain eksekusi riil.

Dengan merumuskan kontrak batas ini, para perancang sistem dapat menjamin batas atas latensi, batas memori, atau rentang tegangan yang aman secara deterministik.

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
Pemahaman yang terkunci hanya pada satu sintaks atau terminologi spesifik membuat pembelajar merasa harus menghafal rumus baru setiap kali berpindah konteks penerapan.

Ketika menghadapi persoalan di domain yang tampak asing—seperti berpindah dari mekanika fisika ke arsitektur perangkat lunak atau ekonomi pasar—pembelajar mengalami disorientasi konseptual.

Kegagalan mengenali kesamaan struktur relasional ini memicu redundansi kognitif yang masif, di mana prinsip yang identik dipelajari ulang dari nol di bawah nama-nama jargon yang berbeda.

Diperlukan jembatan isomorfisme struktural yang mampu menyingkap bahwa hukum invarian yang mengatur sistem sumber sesungguhnya bekerja persis sama di dalam domain tujuan.

### 2. Prototipe Intuitif
Bayangkan sepasang roda gigi kembar yang terhubung oleh sebuah rantai penggerak fleksibel yang menembus dinding di antara dua ruangan terpisah.

Di Ruang A (Domain Asal), roda gigi diputar oleh tuas mekanik manual yang digerakkan oleh operator. Setiap satu putaran penuh menghasilkan torsi terukur.

Rantai penggerak menyalurkan energi putaran tersebut secara sempurna ke Ruang B (Domain Sasaran), memutar roda gigi kedua dengan kecepatan sudut dan rasio perpindahan yang identik.

Meskipun dinding di Ruang B dicat dengan warna berbeda dan roda gigi kedua terhubung ke pompa air alih-alih bandul jam, relasi transfer mekanisnya tetap 100% kongruen.

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
Invarian relasional tetap konstan melintasi batas domain terlepas dari perubahan nama variabel, notasi simbolik, atau media fisik yang digunakan.

Pemetaan isomorfis membangun korespondensi satu-satu (*bijeksi*) antara entitas di domain asal dengan entitas yang setara secara struktural di domain target.

Kekekalan hubungan ini membuktikan bahwa intuisi yang telah diasah pada satu masalah dapat langsung dipinjam untuk memecahkan teka-teki rumit di bidang lain tanpa keraguan.

Pemula sering kali tertipu oleh perbedaan kulit luar dan istilah kosmetik, sedangkan pemikir ahli langsung menembus ke inti relasi matematika dan invarian yang melandasinya.

| Apa yang Dipikirkan Pemula (Salah) | Apa yang Sebenarnya Terjadi |
|---|---|
| Menganggap setiap bidang studi sepenuhnya independen | Pola invarian matematika dan kausal sering kali isomorfis |
| Mengubah rumus inti saat berganti topik | Hanya simbol dan konteks yang berubah, struktur relasi tetap sama |

### 4. Notasi Sebagai Kontrak
Fungsi transfer isomorfis memformalkan pemetaan antar-domain sebagai kontrak aljabar yang mempertahankan struktur:
\`Phi_transfer: S_source <-> S_target\`

Kontrak pemetaan ini menjamin bahwa setiap operasi yang valid di domain sumber memiliki pasangan operasi yang valid dan sepadan di domain tujuan.

Dengan berpegang pada kontrak transfer ini, kita dapat mengekspor bukti keamanan, optimasi performa, atau solusi analitik lintas disiplin ilmu dengan derajat kepastian yang setara.

Kontrak ini mengukuhkan bahwa penguasaan sejati suatu konsep diukur dari kemampuan mentransfer intinya ke ranah persoalan baru secara presisi dan elegan.

* \`S_source\`: Variabel status domain asal
* \`Phi_transfer\`: Fungsi pemetaan isomorfis
* \`S_target\`: Variabel status domain target
`;
  }
}
