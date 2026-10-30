# Mathematical Formulation of Human Gradient Descent

## 1. State Definition

Let $G = (V, E)$ be a Directed Acyclic Graph (DAG) representing the competency space of a curriculum with $|V| = D$ nodes.
The human learner's cognitive state is parameterized by a vector of weights:
$$\Theta = [\theta_1, \theta_2, \dots, \theta_D]^T \in [0.0, 1.0]^D$$

Where:
* $\theta_i = 0.0$: Complete absence of mental schema for competency $i$.
* $\theta_i = 1.0$: Absolute, error-free mastery of competency $i$.
* $\theta^* = 0.95$: Entrustment threshold for prerequisite clearance.

---

## 2. Forward Pass: Generative Prediction

Given a target node $i \in V$ with challenge context $x_i$, the learner executes a forward pass generating prediction $\hat{y}_i$:
$$\hat{y}_i = f_{\Theta}(x_i)$$

Unlike passive learning, the forward pass requires active generation before the target concept $y_i$ is revealed.

---

## 3. Loss Function: 5-Axis Diagnostic Loss Vector

The total loss is not a scalar binary, but a weighted dot product across the 5 diagnostic axes:
$$\mathbf{l}(\hat{y}_i, y_i) = \begin{bmatrix}
l_{\text{concept}} \\
l_{\text{prereq}} \\
l_{\text{notation}} \\
l_{\text{strategy}} \\
l_{\text{reasoning}}
\end{bmatrix} \in [0.0, 1.0]^5$$

The scalar loss is defined as:
$$\mathcal{L}(\hat{y}_i, y_i) = \mathbf{w}^T \mathbf{l}(\hat{y}_i, y_i)$$

Where standard default weights are:
$$\mathbf{w} = [0.35, 0.25, 0.10, 0.15, 0.15]^T, \quad \sum_{k=1}^5 w_k = 1.0$$

---

## 4. Backward Pass & Parameter Update

### 4.1 Gradient Attribution ($\nabla_\Theta \mathcal{L}$)
Loss is attributed along the DAG topology:
* If $l_{\text{prereq}} > 0$, negative gradient is propagated upstream:
  $$\frac{\partial \mathcal{L}}{\partial \theta_p} > 0 \quad \text{for } p \in \text{Parents}(i)$$
  This marks prerequisite parent node $p$ for immediate reinforcement.
* For the active node $i$, the primary gradient is directed against $\theta_i$.

### 4.2 Dynamic Learning Rate ($\alpha$)
The learning rate $\alpha \in [0.05, 0.5]$ is dynamically modulated based on cognitive load and consecutive successes:
$$\alpha_t = \alpha_{\text{base}} \cdot \left(1 + 0.1 \cdot \min(C_{\text{consecutive}}, 3)\right) \cdot (1 - 0.5 \cdot H_{\text{hint}})$$
Where $H_{\text{hint}} \in \{0.0, 0.25, 0.5, 0.75\}$ is the penalty for hint ladder assistance.

### 4.3 Weight Update Rule
$$\theta_i^{(t+1)} = \text{clip}\left(\theta_i^{(t)} + \alpha_t \cdot (1.0 - \mathcal{L}) - \delta_{\text{hint}}, 0.0, 1.0\right)$$

If $\mathcal{L} \approx 0.0$ (perfect response without hints), $\theta_i$ increases by $\alpha_t$.
If $\mathcal{L} > 0.5$ (severe error), $\theta_i$ degrades, triggering backward pass hint escalation.

---

## 5. Spaced Temporal Decay (Ebbinghaus Decay)

Memory decays over time following an exponential half-life:
$$\theta_i(t + \Delta t) = \theta_i(t) \cdot 2^{-\frac{\Delta t}{h_i}}$$

Where $h_i$ is the half-life in hours, dynamically expanded with successful reviews:
$$h_i^{(t+1)} = h_i^{(t)} \cdot 2.2^{\theta_i}$$
This guarantees long-term retention and periodic frontier re-testing.
