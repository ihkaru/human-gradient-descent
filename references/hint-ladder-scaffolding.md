# Progressive Hint Ladder & Micro-Remediation

## 1. Scaffolding Doctrine

The Human Gradient Descent backward pass adheres to the **Minimal Necessary Intervention** principle. Giving away full solutions depresses neuroplastic engagement, while unguided frustration causes learner dropout.

The **Progressive Hint Ladder (PHL)** formalizes 4 graduated intervention tiers:

```
[User Forward Pass Attempt]
         │
    (Loss > 0.05)
         ▼
Tier 0: Reflective Question (Metacognitive Self-Check)
         │ (Still incorrect)
         ▼
Tier 1: Directional Clue (Focus Attention on Invariant)
         │ (Still incorrect)
         ▼
Tier 2: Constraint Narrowing (Eliminate Distractors)
         │ (Still incorrect)
         ▼
Tier 3: Minimal Worked Example (Scaffolded Walkthrough)
         │
    (Re-Attempt) ──► Mastery Reached (Weight Updated with Hint Penalty)
```

---

## 2. Tier Specifications

### Tier 0: Reflective Self-Check
* **Purpose**: Activates metacognition; prompts the learner to review their own reasoning without providing external clues.
* **Example**: *"Re-read step 2 of your calculation: what assumption did you make about array indexing when $n=0$?"*
* **Hint Weight Penalty**: $0\%$ (full credit if corrected).

### Tier 1: Directional Clue
* **Purpose**: Guides attention toward the missing variable, boundary condition, or governing rule.
* **Example**: *"Consider whether this operation preserves the loop invariant when the list has duplicate elements."*
* **Hint Weight Penalty**: $15\%$ ($\Delta \theta \times 0.85$).

### Tier 2: Constraint Narrowing
* **Purpose**: Narrows down the hypothesis space or explicitly eliminates invalid approaches.
* **Example**: *"This is not solvable in $O(1)$ space using recursion because of call stack overhead. Which iterative data structure allows constant-time lookups?"*
* **Hint Weight Penalty**: $35\%$ ($\Delta \theta \times 0.65$).

### Tier 3: Minimal Worked Example
* **Purpose**: Step-by-step procedural breakdown for an isomorphic toy scenario, demonstrating the exact reasoning pattern.
* **Rule**: Must use an **isomorphic toy instance**, never the exact active problem, forcing the learner to transfer the reasoning back to their attempt.
* **Hint Weight Penalty**: $60\%$ ($\Delta \theta \times 0.40$).

---

## 3. Micro-Remediation Injection

When loss is classified along a specific axis, the agent injects an atomic **Micro-Remediation** snippet:
* **Length**: Under 150 words.
* **Focus**: Targeted strictly to the failing axis (e.g., notation clarification if $l_{\text{notation}} > 0.5$, or prerequisite refresh if $l_{\text{prereq}} > 0.5$).
* **Action**: Immediate re-test on an isomorphic variant.
