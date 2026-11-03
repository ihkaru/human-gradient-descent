import { describe, it, expect } from "bun:test";
import { parseGlossaryTerms } from "../src/compiler/glossary-builder.js";
import { MarkdownCurriculumCompiler } from "../src/compiler/markdown-compiler.js";
import { SchemaValidator } from "../src/validator/schema-validator.js";
import {
  attachGlossaryBadges,
  renderGlossaryPanel,
} from "../examples/reference-ui/glossary-popover.js";

describe("High School (SMA) Baseline & Glossary Suite", () => {
  it("parses glossary terms from explicit JSON annotation", () => {
    const annotations = {
      glossary: JSON.stringify([
        {
          term: "Qubit",
          definition: "Unit dasar informasi kuantum",
          highSchoolAnchor: "Analogi koin yang diputar di atas meja",
        },
      ]),
    };
    const terms = parseGlossaryTerms("", annotations, "Quantum Node");
    expect(terms).toBeDefined();
    expect(terms?.length).toBe(1);
    expect(terms?.[0].term).toBe("Qubit");
    expect(terms?.[0].highSchoolAnchor).toBe("Analogi koin yang diputar di atas meja");
  });

  it("parses glossary from Markdown table with High School anchors", () => {
    const markdown = `
### Glosarium & Jembatan Konsep SMA

| Istilah | Konsep Formal | Jembatan Konsep SMA |
|---|---|---|
| Gerbang Hadamard | Operasi unitary pembagi superposisi simetris | Seperti tuas penyentak yang menyenggol koin diam agar berputar seimbang di meja |
| Superposisi | Keadaan linear gabungan status kuantum | Potensi dinamis sebelum koin berhenti |
`;
    const terms = parseGlossaryTerms(markdown, {}, "Hadamard Node");
    expect(terms).toBeDefined();
    expect(terms?.length).toBe(2);
    expect(terms?.[0].term).toBe("Gerbang Hadamard");
    expect(terms?.[0].highSchoolAnchor).toContain("tuas penyentak");
    expect(terms?.[1].term).toBe("Superposisi");
  });

  it("parses glossary from Markdown bullet list with High School anchors", () => {
    const markdown = `
### Istilah Penting (Jembatan SMA)

- **io_uring**: Antarmuka asinkronus berbasis ring buffer di kernel Linux. *Jembatan SMA*: Sistem ban berjalan (conveyor belt) dua arah antara dapur dan pelayan.
- **SQE**: Submission Queue Entry. *Jembatan SMA*: Tiket pesanan baru yang ditaruh di ban berjalan.
`;
    const terms = parseGlossaryTerms(markdown, {}, "io_uring Node");
    expect(terms).toBeDefined();
    expect(terms?.length).toBe(2);
    expect(terms?.[0].term).toBe("io_uring");
    expect(terms?.[0].highSchoolAnchor).toContain("ban berjalan");
    expect(terms?.[1].term).toBe("SQE");
  });

  it("compiles markdown containing glossary and validates against NodeShard schema", () => {
    const compiler = new MarkdownCurriculumCompiler();
    const markdown = `# Quantum Mechanics Curriculum

Introduction to quantum mechanics.

## Qubits and Superposition
<!-- hgd:tier: 1_foundational_fluency -->
<!-- hgd:primer: "A qubit exists in superposition of |0> and |1>. Hadamard creates an equal 50:50 superposition upon collapse." -->
<!-- hgd:probe: "Predict: What is the probability distribution after measuring Hadamard superposition?" -->
<!-- hgd:truth: "Equal 50% probability for |0> and 50% for |1> by conservation of total probability." -->

### 1. Pangkal Anomali
Saklar klasik hanya bernilai 0 atau 1.

### 2. Prototipe Intuitif
Model koin diputar di atas meja.

### 3. Invarian & Operasi Inti
Total probabilitas bernilai 1.0.

| Pemula | Fakta |
|---|---|
| Simultan | Probabilistik |

### 4. Notasi Sebagai Kontrak
Formula: \`H|0> -> (|0>+|1>)/sqrt(2)\`
* \`H\`: Gerbang Hadamard

### Glosarium & Jembatan Konsep SMA

| Istilah | Konsep Formal | Jembatan Konsep SMA |
|---|---|---|
| Qubit | Unit informasi kuantum | Koin dinamis yang sedang diputar di atas meja |
| Gerbang Hadamard | Operator unitary penyeimbang | Tuas penyentak pemutar koin |
`;

    const { shards } = compiler.compile(markdown, {
      curriculumId: "quantum-test",
      title: "Quantum Test",
      domain: "Physics",
    });

    expect(shards.length).toBe(1);
    const node = shards[0].nodes[0];
    expect(node.glossary).toBeDefined();
    expect(node.glossary?.length).toBe(2);
    expect(node.glossary?.[0].term).toBe("Qubit");

    const validator = new SchemaValidator();
    const result = validator.validateShard(shards[0]);
    expect(result.valid).toBe(true);
  });

  it("attaches interactive glossary badges to text outside HTML tags", () => {
    const glossary = [
      {
        term: "Hadamard",
        definition: "Gerbang kuantum",
        highSchoolAnchor: "Tuas penyentak koin",
      },
      {
        term: "Qubit",
        definition: "Bit kuantum",
        highSchoolAnchor: "Koin berputar",
      },
    ];

    const inputHtml = "Ketika gerbang Hadamard bekerja pada Qubit terisolasi...";
    const badged = attachGlossaryBadges(inputHtml, glossary);

    expect(badged).toContain('class="glossary-term-badge"');
    expect(badged).toContain('data-term-key="hadamard"');
    expect(badged).toContain('data-term-key="qubit"');
  });

  it("renders a collapsible glossary panel with high school anchor tags", () => {
    const glossary = [
      {
        term: "io_uring",
        definition: "Linux asynchronous I/O",
        highSchoolAnchor: "Conveyor belt dua arah",
      },
    ];

    const panelHtml = renderGlossaryPanel(glossary);
    expect(panelHtml).toContain("Jembatan Konsep SMA & Glosarium");
    expect(panelHtml).toContain("Jembatan SMA");
    expect(panelHtml).toContain("Conveyor belt dua arah");
  });
});
