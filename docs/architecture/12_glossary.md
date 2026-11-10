# 12. Glossary

> [!INFO] **Architecture Provenance & Freshness**
> - **Verified Commit**: `e613daf`
> - **Verified Timestamp**: `2026-11-03T07:34:00+07:00`
> - **Tracked Paths**: `src/`, `schemas/`, `phases/`
> - **Drift Status**: `verified`

| Term | Definition in Human Gradient Descent (HGD) |
|:---|:---|
| **Active Frontier** | The subset of competency nodes whose prerequisites have all reached mastery ($\theta \ge 0.95$), but the node itself is not yet mastered. |
| **Anti-Fatigue Circuit Breaker** | Ethical safety governor triggering neural consolidation pauses when cognitive thrashing or hurried guessing is detected. |
| **Backward Pass ($\Delta \Theta$)** | Scaffolding intervention where loss is attributed back to the parameter vector $\Theta$ via the Progressive Hint Ladder and micro-remediation. |
| **Bianshi Jiaoxue (Variation Theory)** | East Asian mathematics pedagogy systematically presenting conceptual multi-representations and procedural boundary perturbations. |
| **Checkpoint** | A designated milestone node in the DAG. Serves as a safe fallback anchor during divergence rollback. |
| **Cognitive Thrashing** | High-frequency, hurried guessing under time anxiety ($< 3\text{s}$) resulting in elevated error loss. |
| **Cognitive Weight ($\theta_i$)** | Scalar in $[0.0, 1.0]$ representing human mental model mastery of competency node $i$. |
| **Compositional Transparency** | Deconstructing complex concepts into transparent combinations of known primitives (analogous to base-10 counting: $10+1$). |
| **Conceptual Variation** | Presenting the same underlying invariant across disjoint representations (code, math symbols, diagrams, verbal rules). |
| **Divergence Event** | Catastrophic loss spike ($\mathcal{L} > 0.7$) or repeated prerequisite failure indicating a broken foundational schema, triggering a rollback. |
| **Forward Pass ($\hat{y}$)** | The learner's active predictive hypothesis submitted *before* reading explanatory text (Generation Effect). |
| **Procedural Variation** | Step-by-step perturbation of problem parameters to expose where the governing invariant holds or collapses. |
| **Progressive Hint Ladder (PHL)** | Scaffolding system of 4 graduated tiers: $T_0$ Reflective Question, $T_1$ Directional Clue, $T_2$ Constraint Narrowing, $T_3$ Worked Example. |
| **Rollback** | Moving the active frontier backward to a previously verified checkpoint to re-train foundational prerequisites. |
| **Shard** | Partitioned JSON file containing 20–50 competency nodes, keeping memory and token overhead bounded to $O(1)$. |
| **Time-Bounded Mode** | High-velocity sprint training mode with active countdown timers per node and automated timeout escalation. |
| **UILA (Universal Invariant Learning Architecture)** | The 5-block sequence (Anomaly, Prototype, Invariant, Contract, Boundary Stress-Test) initializing mental models prior to boundary prediction. |
| **Contrasting Cases** | A side-by-side comparative matrix contrasting beginner misconceptions directly against the true physical mental model. |
| **Depth Spiral** | Vertical curriculum expansion re-visiting an already mastered competency node with higher mathematical and engineering rigor. |
| **Knowledge Subway Map** | Interactive transit-line visualization of the curriculum DAG displaying Core tracks, Depth Spiral tracks, and Isomorphic Bridges. |
| **Cognitive Convergence Heatmap** | GitHub-style contribution matrix tracking daily training epochs, streaks, and invariant mastery levels using a 4-tier emerald scale. |
| **Working Memory Budget** | Limiting challenge prompts to $\le 50$ words ($\le 2-3$ seconds) to avoid overloading the phonological working memory buffer. |

---

## 12.2 Standar Taksonomi Istilah Pendidikan Teknis (Instructional Design & CBE Taxonomy)

Untuk mencegah kerancuan terminologis dan memastikan ketepatan akademik yang netral domain (tanpa mengikat sistem pada kata spesifik seperti "kuliah"):

| Entitas Sistem | Istilah Teknis Pendidikan Resmi | Istilah Kolokial yang Dihindari | Definisi Standar Instruksional |
|:---|:---|:---|:---|
| **Program Instance** (`curriculumId`) | **Program Pembelajaran** (*Learning Program*) | ❌ Kurikulum (terlalu luas) / Mata Kuliah | Paket ajar terstruktur untuk menguasai satu domain kompetensi tertentu secara utuh. |
| **Manifest Root** (`curriculum-manifest.json`) | **Cetak Biru Instruksional** (*Instructional Blueprint*) | ❌ RPS (terikat semester) / Daftar Isi | Dokumen desain instruksional yang memegang peta prasyarat global, pos checkpoint, dan kebijakan waktu. |
| **Relasi Graf** (`dag.nodes` & `dag.edges`) | **Peta Jalur Prasyarat Kompetensi** (*Prerequisite Learning Map*) | ❌ Bagan Materi / Pohon Bab | Graf asiklik (DAG) yang mengunci urutan kausal kompetensi hulu ke hilir. |
| **Simpul Kompetensi** (`CompetencyNode` di Shard) | **Unit Kompetensi** (*Competency Unit*) | ❌ Bab / Pertemuan Mingguan | Satuan terkecil yang mengisolasi dan menguji tepat satu invarian mekanistik tunggal (*monocentric*). |
| **Capaian Kognitif** (`cognitiveLevel`) | **Tingkat Capaian Kognitif** (*Cognitive Mastery Level*) | ❌ Level Nilai | Klasifikasi kemampuan kognitif berdasarkan Taksonomi Bloom (*understand* s.d. *create*). |
| **Konstruksi Mental** (Blok 1–4 UILA) | **Fase Pembentukan Skema Mental** (*Cognitive Schema Acquisition*) | ❌ Bahan Bacaan / Teori Pasif | Tahapan bertingkat membangun intuisi: Anomali $\to$ Prototipe Fisik $\to$ Invarian Kontras $\to$ Notasi Kontrak. |
| **Uji Batas** (Blok 5 / `forwardPass`) | **Asesmen Diagnostik Kasus Batas** (*Boundary Stress-Test Probe*) | ❌ Kuis / PR / Latihan Soal | Penyelidikan respon model mental terhadap kondisi batas ekstrem ($0, \infty$) dengan hipotesis kausal. |
| **Tangga Bantuan** (`backwardPass`) | **Perancah Progresif** (*Progressive Instructional Scaffolding*) | ❌ Kunci Jawaban / Bocoran | Intervensi minimal bertingkat (Refleksi $\to$ Arah $\to$ Batasan $\to$ Worked Example) sesuai ZPD Vygotsky. |
| **Vektor Bobot** ($\Theta \in [0.0, 1.0]$) | **Vektor Penguasaan Kompetensi** (*Competency Mastery Vector*) | ❌ Nilai Rapor / IPK | Nilai peluang penguasaan invarian riil yang diperbarui melalui proses gradient descent kognitif. |
