import type { ExpansionPathways, ExpansionBranch, IsomorphicBridge } from "../types/uila.js";

export function parseExpansionPathways(
  annotations: Record<string, string>,
  title: string,
  nodeId: string
): ExpansionPathways {
  if (annotations.expansion) {
    try {
      const parsed = JSON.parse(annotations.expansion);
      if (typeof parsed === "object" && parsed !== null) {
        return parsed as ExpansionPathways;
      }
    } catch {}
  }

  const branches: ExpansionBranch[] = [
    {
      trackName: `${title} Rigorous Implementation`,
      targetNodeId: `${nodeId}-rigor`,
      description: `Deep dive into proofs, memory models, and edge performance for ${title}.`,
    },
    {
      trackName: `${title} Production Engineering`,
      targetNodeId: `${nodeId}-prod`,
      description: `Handling noisy environments, concurrency faults, and distributed failure modes.`,
    },
  ];

  const isomorphicBridges: IsomorphicBridge[] = [
    {
      domain: "General Dynamical Systems",
      targetNodeId: `hgd://general/dynamics/${title.toLowerCase().replace(/\s+/g, "-")}`,
      sharedInvariant: "Conservation and state equilibrium under boundary perturbation.",
    },
  ];

  return {
    depthLevel: 1,
    deeperSpiralNodeId: `${nodeId}-deep-spiral`,
    branches,
    isomorphicBridges,
  };
}
