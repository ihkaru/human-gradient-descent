# Quantum Computing Foundations

## Qubits and Superposition
In classical computing, a bit is strictly either 0 or 1. A quantum bit (qubit) is a two-state quantum-mechanical system described as a linear superposition:
$$|\psi\rangle = \alpha |0\rangle + \beta |1\rangle$$
Where $\alpha, \beta \in \mathbb{C}$ and $|\alpha|^2 + |\beta|^2 = 1$. The fundamental invariant is that measurement collapses the superposition into a definite state with probability $|\alpha|^2$ or $|\beta|^2$.

## Quantum Entanglement and Non-Locality
Entanglement occurs when a multi-qubit system cannot be factored into the tensor product of individual qubit states:
$$|\Phi^+\rangle = \frac{1}{\sqrt{2}}(|00\rangle + |11\rangle)$$
Measuring the first qubit immediately forces the state of the second qubit, regardless of spatial separation. The core invariant is that entanglement does not allow faster-than-light communication because local marginal probabilities remain invariant.

## Unitary Operations and Reversibility
All quantum logic gates operating on closed systems must be represented by unitary operators $U^\dagger U = I$.
Because unitary transformations preserve the inner product and norm of vectors, all quantum computation without measurement is strictly reversible. No quantum gate can perform irreversible erasure of quantum information without increasing thermodynamic entropy.

## Quantum No-Cloning Theorem
The no-cloning theorem states that it is impossible to create an identical copy of an arbitrary unknown quantum state:
$$U(|\psi\rangle |0\rangle) \neq |\psi\rangle |\psi\rangle$$
This follows directly from the linearity of quantum operators. Because cloning is prohibited, quantum error correction cannot simply duplicate qubits, but must instead distribute quantum information across entangled topological codes.

## Grover's Search and Quadratic Speedup
Grover's algorithm searches an unstructured database of $N$ items in $O(\sqrt{N})$ operations, compared to classical $O(N)$.
It achieves this by iteratively applying the Grover diffusion operator:
$$G = (2|s\rangle\langle s| - I) O_\omega$$
The mechanism works via amplitude amplification: the phase of the target state is inverted, and then all amplitudes are inverted about the mean, geometrically rotating the state vector toward the target.
