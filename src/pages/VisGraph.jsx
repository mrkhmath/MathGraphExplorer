import React, { useEffect, useRef } from "react";
import { Network } from "vis-network";
import { DataSet } from "vis-data";
import "vis-network/styles/vis-network.css";

export default function ConceptGraph({ graphData }) {
  const ref = useRef();

  useEffect(() => {
    if (!graphData?.nodes?.length) return;

    const filteredNodes = graphData.nodes.filter(
      (n) => n.label && n.grade_levels?.length > 0
    );

    const nodeSet = new DataSet(
      filteredNodes.map((n) => ({
        id: n.id,
        label: n.label,
        title: `
          Code: ${n.label}
          Score: ${n.score != null ? n.score.toFixed(2) : "N/A"}
          Grades: ${n.grade_levels.join(", ")}
          Description: ${n.description?.slice(0, 200) ?? "No description"}
        `,
        color: n.color || "#1f77b4",
        font: { size: 16 },
      }))
    );

    const edgeSet = new DataSet(
      graphData.links.map((l) => ({
        from: l.source,
        to: l.target,
        label: l.label ?? "",
        font: {
          align: "top",
          color: "gray",
          size: 12,
          background: "white",
          strokeWidth: 0,
        },
        arrows: "to",
        color: { color: "#777", highlight: "#d33", hover: "#f33" },
      }))
    );

    const options = {
      interaction: { hover: true, tooltipDelay: 100 },
      layout: {
    hierarchical: false, // ✅ Valid format
  },
      physics: false, // 🔒 disable ResizeObserver-triggering layout
      nodes: {
        shape: "dot",
        size: 20,
        borderWidth: 1,
      },
      edges: {
        smooth: false,
      },
    };

    const network = new Network(
      ref.current,
      { nodes: nodeSet, edges: edgeSet },
      options
    );

    return () => network.destroy();
  }, [graphData]);

  return (
    <div className="w-full h-[600px] rounded-lg border border-gray-300 bg-white shadow">
      <div
        ref={ref}
        className="w-full h-full"
        style={{ minHeight: "600px" }}
      />
      {!graphData?.nodes?.length && (
        <p className="text-gray-500 text-sm mt-2 text-center">
          No graph available for this concept.
        </p>
      )}
    </div>
  );
}
