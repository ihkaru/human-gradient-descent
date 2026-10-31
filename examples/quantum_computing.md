# Quantum Computing Foundations

A comprehensive curriculum on quantum information theory, superposition, entanglement, and algorithmic speedups.

## Qubits and Superposition
<!-- hgd:tier: 1_foundational_fluency -->
<!-- hgd:primer: "A classical bit is strictly either 0 or 1. A qubit is a quantum system that can exist in a simultaneous linear superposition of |0> and |1>. A Hadamard gate is a foundational quantum operation that transforms a definite state |0> into an equal superposition where both outcomes become equally likely upon measurement." -->
<!-- hgd:probe: "If a qubit initialized in state |0> is transformed by a Hadamard gate into an equal superposition, predict the probability distribution of measuring |0> versus |1>." -->
<!-- hgd:truth: "Measurement collapses the equal superposition (1/sqrt(2)|0> + 1/sqrt(2)|1>) into |0> with 50% probability and |1> with 50% probability." -->
<!-- hgd:worked: "Worked Solution: The Hadamard gate maps |0> to (|0> + |1>)/sqrt(2). The probability of measuring state |k> equals the squared amplitude |1/sqrt(2)|^2 = 1/2 = 50%. Thus, measuring yields 50% probability for |0> and 50% probability for |1>." -->
<!-- hgd:models: ["hadamard", "superposition", "equal probability", "50%", "collapse"] -->
In classical computing, a bit is strictly either 0 or 1. A quantum bit (qubit) is a two-state quantum-mechanical system described as a linear superposition:
$$|\psi\rangle = \alpha |0\rangle + \beta |1\rangle$$
Where $\alpha, \beta \in \mathbb{C}$ and $|\alpha|^2 + |\beta|^2 = 1$. The fundamental invariant is that measurement collapses the superposition into a definite state with probability $|\alpha|^2$ or $|\beta|^2$.

## Unitary Operations and Reversibility
<!-- hgd:tier: 2_boundary_perturbation -->
<!-- hgd:primer: "Classical computing permits irreversible operations, such as resetting a bit to 0, which destroys previous state information and dissipates heat. In quantum computing, all closed-system transformations are governed by unitary operators, which strictly preserve quantum state lengths and angles." -->
<!-- hgd:probe: "Predict why an irreversible classical operation like bit-erasure (reset to 0) cannot be represented as an isolated quantum logic gate." -->
<!-- hgd:truth: "Quantum operations must be unitary (U dagger U = I), which strictly preserves inner products and vector norms, guaranteeing 100% reversibility without entropy dissipation." -->
<!-- hgd:worked: "Worked Solution: Unitary operators U satisfy U dagger U = I, preserving the inner product <psi|phi> between all states. If two distinct states both collapsed to |0>, their distinctness would be destroyed, violating inner product conservation and unitarity." -->
<!-- hgd:models: ["unitary", "reversibility", "norm preservation", "inner product", "entropy"] -->
All quantum logic gates operating on closed systems must be represented by unitary operators $U^\dagger U = I$.
Because unitary transformations preserve the inner product and norm of vectors, all quantum computation without measurement is strictly reversible. No quantum gate can perform irreversible erasure of quantum information without increasing thermodynamic entropy.

## Quantum Entanglement and Non-Locality
<!-- hgd:prereqs: ["Qubits and Superposition"] -->
<!-- hgd:tier: 3_isomorphic_transfer -->
<!-- hgd:primer: "When two qubits are entangled, their joint state cannot be described as two independent qubits. Measuring one qubit instantaneously determines the state of the other, even if separated across galaxies, yet this correlation cannot be controlled by either party to send chosen signals." -->
<!-- hgd:probe: "If Alice and Bob share an entangled Bell state (|00> + |11>)/sqrt(2), predict whether Alice can transmit an instantaneous binary message to Bob by measuring her qubit." -->
<!-- hgd:truth: "Alice cannot transmit information faster than light because Bob's local marginal probability remains exactly 50/50 until classical measurement correlations are communicated." -->
<!-- hgd:worked: "Worked Solution: While Alice's measurement instantly fixes Bob's outcome, Alice cannot choose whether she measures 0 or 1. From Bob's perspective, his density matrix remains a random 50/50 mixture. Therefore, no information is transmitted until classical signals arrive (No-Signaling Theorem)." -->
<!-- hgd:models: ["no-signaling", "marginal probability", "bell state", "faster than light", "correlation"] -->
Entanglement occurs when a multi-qubit system cannot be factored into the tensor product of individual qubit states:
$$|\Phi^+\rangle = \frac{1}{\sqrt{2}}(|00\rangle + |11\rangle)$$
Measuring the first qubit immediately forces the state of the second qubit, regardless of spatial separation. The core invariant is that entanglement does not allow faster-than-light communication because local marginal probabilities remain invariant.

## Quantum No-Cloning Theorem
<!-- hgd:prereqs: ["Qubits and Superposition", "Unitary Operations and Reversibility"] -->
<!-- hgd:tier: 4_adversarial_dilemma -->
<!-- hgd:primer: "Classical data can be cloned endlessly (Ctrl+C, Ctrl+V). However, quantum mechanics requires all operations to be linear. If a cloning machine existed, it would have to clone both basis states and their linear combinations." -->
<!-- hgd:probe: "Predict what mathematical contradiction occurs if a unitary operator U clones an arbitrary unknown superposition state alpha|0> + beta|1>." -->
<!-- hgd:truth: "Linearity requires U(|psi>|0>) = alpha|00> + beta|11>, whereas a true copy requires (alpha|0> + beta|1>)(alpha|0> + beta|1>) containing cross-terms 2 alpha beta |01>, violating unitarity." -->
<!-- hgd:worked: "Worked Solution: By linearity, U(alpha|0> + beta|1>)|0> = alpha|00> + beta|11>. But a cloned state requires |psi>|psi> = alpha^2|00> + alpha beta|01> + alpha beta|10> + beta^2|11>. Equating the two yields cross-terms 2 alpha beta = 0, which fails for arbitrary superpositions." -->
<!-- hgd:models: ["linearity", "cross terms", "arbitrary state", "contradiction", "unitary"] -->
The no-cloning theorem states that it is impossible to create an identical copy of an arbitrary unknown quantum state:
$$U(|\psi\rangle |0\rangle) \neq |\psi\rangle |\psi\rangle$$
This follows directly from the linearity of quantum operators. Because cloning is prohibited, quantum error correction cannot simply duplicate qubits, but must instead distribute quantum information across entangled topological codes.

## Grover's Search and Quadratic Speedup
<!-- hgd:prereqs: ["Unitary Operations and Reversibility", "Quantum Entanglement and Non-Locality"] -->
<!-- hgd:tier: 3_isomorphic_transfer -->
<!-- hgd:primer: "Searching an unsorted list of N items classically requires N checks on average. Grover's algorithm uses quantum wave interference to amplify the probability amplitude of the correct item while destructively canceling incorrect items." -->
<!-- hgd:probe: "Predict how Grover's diffusion operator amplifies the probability amplitude of the target state while suppressing non-target states." -->
<!-- hgd:truth: "Inverting the phase of the target state followed by inversion about the mean geometrically rotates the state vector toward the target basis in O(sqrt(N)) steps." -->
<!-- hgd:worked: "Worked Solution: Step 1: The oracle flips the sign of the target state amplitude (phase inversion). Step 2: The diffusion operator reflects all amplitudes across their average mean. Because the target was negative, this reflection shoots its amplitude far above the mean, achieving quadratic speedup O(sqrt(N))." -->
<!-- hgd:models: ["amplitude amplification", "inversion about mean", "geometric rotation", "quadratic speedup", "oracle"] -->
Grover's algorithm searches an unstructured database of $N$ items in $O(\sqrt{N})$ operations, compared to classical $O(N)$.
It achieves this by iteratively applying the Grover diffusion operator:
$$G = (2|s\rangle\langle s| - I) O_\omega$$
The mechanism works via amplitude amplification: the phase of the target state is inverted, and then all amplitudes are inverted about the mean, geometrically rotating the state vector toward the target.
