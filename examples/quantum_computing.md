# Quantum Computing Foundations

A comprehensive curriculum on quantum information theory, superposition, entanglement, and algorithmic speedups.

## Qubits and Superposition
<!-- hgd:tier: 1_foundational_fluency -->
<!-- hgd:probe: "If a qubit initialized in state |0> is transformed by a Hadamard gate, predict the probability distribution of measuring |0> versus |1>." -->
<!-- hgd:truth: "Measurement collapses the equal superposition (1/sqrt(2)|0> + 1/sqrt(2)|1>) into |0> with 50% probability and |1> with 50% probability." -->
<!-- hgd:models: ["hadamard", "superposition", "equal probability", "collapse"] -->
In classical computing, a bit is strictly either 0 or 1. A quantum bit (qubit) is a two-state quantum-mechanical system described as a linear superposition:
$$|\psi\rangle = \alpha |0\rangle + \beta |1\rangle$$
Where $\alpha, \beta \in \mathbb{C}$ and $|\alpha|^2 + |\beta|^2 = 1$. The fundamental invariant is that measurement collapses the superposition into a definite state with probability $|\alpha|^2$ or $|\beta|^2$.

## Unitary Operations and Reversibility
<!-- hgd:tier: 2_boundary_perturbation -->
<!-- hgd:probe: "Predict why an irreversible classical operation like bit-erasure (reset to 0) cannot be represented as an isolated quantum logic gate." -->
<!-- hgd:truth: "Quantum operations must be unitary (U dagger U = I), which strictly preserves inner products and vector norms, guaranteeing 100% reversibility without entropy dissipation." -->
<!-- hgd:models: ["unitary", "reversibility", "norm preservation", "entropy"] -->
All quantum logic gates operating on closed systems must be represented by unitary operators $U^\dagger U = I$.
Because unitary transformations preserve the inner product and norm of vectors, all quantum computation without measurement is strictly reversible. No quantum gate can perform irreversible erasure of quantum information without increasing thermodynamic entropy.

## Quantum Entanglement and Non-Locality
<!-- hgd:prereqs: ["Qubits and Superposition"] -->
<!-- hgd:tier: 3_isomorphic_transfer -->
<!-- hgd:probe: "If Alice and Bob share a Bell state (|00> + |11>)/sqrt(2), predict whether Alice can transmit an instantaneous binary message to Bob by measuring her qubit." -->
<!-- hgd:truth: "Alice cannot transmit information faster than light because Bob's local marginal probability remains exactly 50/50 until classical measurement correlations are communicated." -->
<!-- hgd:models: ["no-signaling", "marginal probability", "bell state", "faster than light"] -->
Entanglement occurs when a multi-qubit system cannot be factored into the tensor product of individual qubit states:
$$|\Phi^+\rangle = \frac{1}{\sqrt{2}}(|00\rangle + |11\rangle)$$
Measuring the first qubit immediately forces the state of the second qubit, regardless of spatial separation. The core invariant is that entanglement does not allow faster-than-light communication because local marginal probabilities remain invariant.

## Quantum No-Cloning Theorem
<!-- hgd:prereqs: ["Qubits and Superposition", "Unitary Operations and Reversibility"] -->
<!-- hgd:tier: 4_adversarial_dilemma -->
<!-- hgd:probe: "Predict what mathematical contradiction occurs if a unitary operator U clones an arbitrary unknown superposition state alpha|0> + beta|1>." -->
<!-- hgd:truth: "Linearity requires U(|psi>|0>) = alpha|00> + beta|11>, whereas a true copy requires (alpha|0> + beta|1>)(alpha|0> + beta|1>) containing cross-terms 2 alpha beta |01>, violating unitarity." -->
<!-- hgd:models: ["linearity", "cross terms", "arbitrary state", "contradiction"] -->
The no-cloning theorem states that it is impossible to create an identical copy of an arbitrary unknown quantum state:
$$U(|\psi\rangle |0\rangle) \neq |\psi\rangle |\psi\rangle$$
This follows directly from the linearity of quantum operators. Because cloning is prohibited, quantum error correction cannot simply duplicate qubits, but must instead distribute quantum information across entangled topological codes.

## Grover's Search and Quadratic Speedup
<!-- hgd:prereqs: ["Unitary Operations and Reversibility", "Quantum Entanglement and Non-Locality"] -->
<!-- hgd:tier: 3_isomorphic_transfer -->
<!-- hgd:probe: "Predict how Grover's diffusion operator amplifies the probability amplitude of the target state while suppressing non-target states." -->
<!-- hgd:truth: "Inverting the phase of the target state followed by inversion about the mean geometrically rotates the state vector toward the target basis in O(sqrt(N)) steps." -->
<!-- hgd:models: ["amplitude amplification", "inversion about mean", "geometric rotation", "quadratic speedup"] -->
Grover's algorithm searches an unstructured database of $N$ items in $O(\sqrt{N})$ operations, compared to classical $O(N)$.
It achieves this by iteratively applying the Grover diffusion operator:
$$G = (2|s\rangle\langle s| - I) O_\omega$$
The mechanism works via amplitude amplification: the phase of the target state is inverted, and then all amplitudes are inverted about the mean, geometrically rotating the state vector toward the target.
