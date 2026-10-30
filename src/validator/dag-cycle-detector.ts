import type { CurriculumManifest } from "../types/curriculum.js";

export interface DAGValidationResult {
  isValid: boolean;
  hasCycles: boolean;
  cycles: string[][];
  danglingEdges: { from: string; to: string; missingNode: string }[];
  selfLoops: string[];
  sccCount: number;
  topologicalOrder?: string[];
  diagnostics: string[];
}

export class DAGCycleDetector {
  /**
   * Validates a curriculum manifest DAG for acyclicity, dangling edges, and topological order.
   */
  public validateManifest(manifest: CurriculumManifest): DAGValidationResult {
    const nodeIds = manifest.dag.nodes.map((n) => n.id);
    const edges = manifest.dag.edges.map((e) => ({ from: e.from, to: e.to }));
    return this.validate(nodeIds, edges);
  }

  /**
   * Core algorithm validating nodes and directed edges (from -> to).
   * Runs in O(V + E) time using Tarjan's SCC and Kahn's topological sort.
   */
  public validate(
    nodeIds: string[],
    edges: { from: string; to: string }[]
  ): DAGValidationResult {
    const nodeSet = new Set(nodeIds);
    const danglingEdges: DAGValidationResult["danglingEdges"] = [];
    const selfLoops: string[] = [];
    const diagnostics: string[] = [];

    // 1. Check for dangling edges & self loops
    const validEdges: { from: string; to: string }[] = [];
    for (const edge of edges) {
      if (!nodeSet.has(edge.from)) {
        danglingEdges.push({ from: edge.from, to: edge.to, missingNode: edge.from });
        diagnostics.push(`[DANGLING EDGE] Prerequisite '${edge.from}' is not defined in nodes.`);
      }
      if (!nodeSet.has(edge.to)) {
        danglingEdges.push({ from: edge.from, to: edge.to, missingNode: edge.to });
        diagnostics.push(`[DANGLING EDGE] Target node '${edge.to}' is not defined in nodes.`);
      }
      if (edge.from === edge.to) {
        selfLoops.push(edge.from);
        diagnostics.push(`[SELF LOOP] Node '${edge.from}' depends on itself.`);
      }
      if (nodeSet.has(edge.from) && nodeSet.has(edge.to) && edge.from !== edge.to) {
        validEdges.push(edge);
      }
    }

    // 2. Build adjacency list
    const adj = new Map<string, string[]>();
    const inDegree = new Map<string, number>();
    for (const id of nodeIds) {
      adj.set(id, []);
      inDegree.set(id, 0);
    }

    for (const { from, to } of validEdges) {
      adj.get(from)!.push(to);
      inDegree.set(to, (inDegree.get(to) || 0) + 1);
    }

    // 3. Tarjan's Strongly Connected Components Algorithm - O(V + E)
    let index = 0;
    const indices = new Map<string, number>();
    const lowlink = new Map<string, number>();
    const onStack = new Set<string>();
    const stack: string[] = [];
    const sccs: string[][] = [];

    const strongConnect = (u: string) => {
      indices.set(u, index);
      lowlink.set(u, index);
      index++;
      stack.push(u);
      onStack.add(u);

      const neighbors = adj.get(u) || [];
      for (const v of neighbors) {
        if (!indices.has(v)) {
          strongConnect(v);
          lowlink.set(u, Math.min(lowlink.get(u)!, lowlink.get(v)!));
        } else if (onStack.has(v)) {
          lowlink.set(u, Math.min(lowlink.get(u)!, indices.get(v)!));
        }
      }

      if (lowlink.get(u) === indices.get(u)) {
        const scc: string[] = [];
        let w = "";
        do {
          w = stack.pop()!;
          onStack.delete(w);
          scc.push(w);
        } while (w !== u);
        sccs.push(scc);
      }
    };

    for (const id of nodeIds) {
      if (!indices.has(id)) {
        strongConnect(id);
      }
    }

    // 4. Extract cycle paths from non-trivial SCCs (> 1 node)
    const cycles: string[][] = [];
    for (const scc of sccs) {
      if (scc.length > 1) {
        const cycleTrace = this.traceCycle(scc, adj);
        cycles.push(cycleTrace);
        diagnostics.push(`[CYCLE DETECTED] Circular dependency: ${cycleTrace.join(" -> ")}`);
      }
    }

    // Self loops also count as cycles
    for (const self of selfLoops) {
      cycles.push([self, self]);
    }

    const hasCycles = cycles.length > 0;
    let topologicalOrder: string[] | undefined = undefined;

    // 5. Kahn's Algorithm for Topological Sort if acyclic
    if (!hasCycles && danglingEdges.length === 0) {
      const queue: string[] = [];
      const order: string[] = [];
      const tempInDegree = new Map(inDegree);

      for (const [id, deg] of tempInDegree.entries()) {
        if (deg === 0) {
          queue.push(id);
        }
      }

      while (queue.length > 0) {
        const curr = queue.shift()!;
        order.push(curr);
        for (const next of adj.get(curr) || []) {
          const newDeg = tempInDegree.get(next)! - 1;
          tempInDegree.set(next, newDeg);
          if (newDeg === 0) {
            queue.push(next);
          }
        }
      }

      if (order.length === nodeIds.length) {
        topologicalOrder = order;
      }
    }

    const isValid = !hasCycles && danglingEdges.length === 0 && selfLoops.length === 0;

    return {
      isValid,
      hasCycles,
      cycles,
      danglingEdges,
      selfLoops,
      sccCount: sccs.length,
      topologicalOrder,
      diagnostics,
    };
  }

  /**
   * Traces an explicit circular path within an SCC using simple BFS.
   */
  private traceCycle(sccNodes: string[], adj: Map<string, string[]>): string[] {
    const sccSet = new Set(sccNodes);
    const start = sccNodes[0];
    const queue: { current: string; path: string[] }[] = [{ current: start, path: [start] }];
    const visited = new Set<string>();

    while (queue.length > 0) {
      const { current, path } = queue.shift()!;
      for (const next of adj.get(current) || []) {
        if (!sccSet.has(next)) continue;
        if (next === start && path.length > 1) {
          return [...path, start];
        }
        if (!visited.has(next)) {
          visited.add(next);
          queue.push({ current: next, path: [...path, next] });
        }
      }
    }

    return [...sccNodes, sccNodes[0]];
  }
}
