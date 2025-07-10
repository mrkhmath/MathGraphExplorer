// src/components/ConceptGraph.jsx

import React, { useState, useRef, useEffect, useMemo } from "react";
import GraphArea from "./GraphArea";
import NodeDetails from "./NodeDetails";

export default function ConceptGraph({ concepts }) {
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedEdgeType, setSelectedEdgeType] = useState("");
  const [gradeFilter, setGradeFilter] = useState([]);
  const [gradeInput, setGradeInput] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const wrapperRef = useRef(null);

  const allGrades = ["K", "1", "2", "3", "4", "5", "6", "7", "8", "9-12"];

  // Reset edge-type when node changes
  useEffect(() => setSelectedEdgeType(""), [selectedNode]);

  // Tag management
  const addGrade = (g) => {
    if (g && !gradeFilter.includes(g)) {
      setGradeFilter((prev) => [...prev, g]);
    }
  };
  const removeGrade = (g) =>
    setGradeFilter((prev) => prev.filter((x) => x !== g));

  // Combo-box open/close
  const onFocus = () => setDropdownOpen(true);
  const onBlur = () => setTimeout(() => setDropdownOpen(false), 100);

  // Autocomplete suggestions
  const suggestions = allGrades
    .filter((g) => !gradeFilter.includes(g))
    .filter((g) =>
      gradeInput === ""
        ? true
        : g.toLowerCase().startsWith(gradeInput.toLowerCase())
    );

  // Filter predicates
  const matchesAnyGrade = (c) =>
    gradeFilter.length === 0 ||
    c.grade_levels?.some((lvl) =>
      gradeFilter.some((g) =>
        g === "9-12" ? ["9", "10", "11", "12", "9-12"].includes(lvl) : lvl === g
      )
    );

  // Search predicate
  const matchesSearch = (c) => {
    if (!searchTerm) return false;
    const t = searchTerm.toLowerCase();
    return c.code?.toLowerCase().includes(t);
  };

  // Clear grades when searching
  useEffect(() => {
    if (searchTerm.trim()) setGradeFilter([]);
  }, [searchTerm]);

  // Determine displayed concepts
  let displayConcepts;
  if (searchTerm.trim()) {
    const matched = concepts.filter(matchesSearch).filter((c) => c.code);
    const relatedIds = new Set(matched.map((c) => c.id));
    matched.forEach((c) => {
      (c.inferredAlignmentsConnection?.edges || []).forEach((e) => {
        if (e?.node?.id) relatedIds.add(e.node.id);
      });
    });

    displayConcepts = concepts.filter((c) => relatedIds.has(c.id) && c.code);
  } else {
    displayConcepts = concepts.filter((c) => matchesAnyGrade(c) && c.code);
  }

  // Build nodes & edges
  const nodes = displayConcepts.map((c) => ({
    id: c.id,
    data: c,
    style: {
      label: { value: c.code },
      keyshape: {
        fill: getColorByType(c.label),
        stroke: "#666",
        size: getSizeByType(c.label),
      },
    },
  }));
  const validIds = new Set(nodes.map((n) => n.id));
  const edges = [];
  displayConcepts.forEach((src) => {
    // 1. Add INFERRED_ALIGNMENT edges
    (src.inferredAlignmentsConnection?.edges || []).forEach((e) => {
      const tgt = e.node;
      const alignmentType = e.properties?.alignmentType || "INFERRED_ALIGNMENT";

      if (validIds.has(src.id) && validIds.has(tgt?.id)) {
        edges.push({
          source: src.id,
          target: tgt.id,
          data: {
            type: alignmentType, // 👈 override the type label with alignmentType value
            confidence: e.properties?.confidence ?? 1.0,
          },
          style: {
            stroke: getEdgeColor(alignmentType),
          },
        });
      }
    });

    // 2. Add EXACT_MATCH edges
    (src.exactMatches || []).forEach((tgt) => {
      if (validIds.has(src.id) && validIds.has(tgt.id)) {
        edges.push({
          source: src.id,
          target: tgt.id,
          data: { type: "EXACT_MATCH", confidence: 1.0 },
          style: { stroke: getEdgeColor("EXACT_MATCH") },
        });
      }
    });

    // 3. Add IS_PART_OF edges
    (src.parts || []).forEach((tgt) => {
      if (validIds.has(src.id) && validIds.has(tgt.id)) {
        edges.push({
          source: src.id,
          target: tgt.id,
          data: { type: "IS_PART_OF", confidence: 1.0 },
          style: { stroke: getEdgeColor("IS_PART_OF") },
        });
      }
    });

    // 4. Add IS_CHILD_OF edges
    (src.children || []).forEach((tgt) => {
      if (validIds.has(src.id) && validIds.has(tgt.id)) {
        edges.push({
          source: src.id,
          target: tgt.id,
          data: { type: "IS_CHILD_OF", confidence: 1.0 },
          style: { stroke: getEdgeColor("IS_CHILD_OF") },
        });
      }
    });
  });

  // Graph event handlers
  const handleNodeClick = (evt) => {
    setSelectedNode(evt.item.getModel().data);
  };
  const handleCanvasClick = () => setSelectedNode(null);

  // Related edges and types
  const relatedEdges = useMemo(
    () =>
      selectedNode
        ? edges.filter((e) => e.data.type && e.source === selectedNode.id)
        : [],
    [edges, selectedNode]
  );
  const edgeTypes = useMemo(
    () => [...new Set(relatedEdges.map((e) => e.data.type))],
    [relatedEdges]
  );
  const connections = useMemo(
    () =>
      selectedEdgeType
        ? relatedEdges
            .filter((e) => e.data.type === selectedEdgeType)
            .map((e) => {
              const otherId =
                e.source === selectedNode.id ? e.target : e.source;
              const node = nodes.find((n) => n.id === otherId);
              return node
                ? { ...node.data, confidence: e.data.confidence }
                : null;
            })
            .filter(Boolean)
        : [],
    [relatedEdges, selectedEdgeType, selectedNode, nodes]
  );

  return (
    <div className="flex">
      {/* Graph Column */}
      <div className="w-3/4 h-[90vh]">
        {displayConcepts.length === 0 ? (
          <div className="p-4 text-gray-500">
            {searchTerm.trim()
              ? "No matches found."
              : "Please select grade(s) or search."}
          </div>
        ) : (
          <GraphArea
            nodes={nodes}
            edges={edges}
            onNodeClick={handleNodeClick}
            onCanvasClick={handleCanvasClick}
          />
        )}
      </div>

      {/* Sidebar Column */}
      <div className="w-1/4 h-[90vh] overflow-y-auto p-4 border-l bg-gray-50">
        {/* Grade Filter */}
        <h2 className="font-bold mb-2">Grade Filter</h2>
        <div className="flex flex-wrap gap-2 mb-2">
          {gradeFilter.map((g) => (
            <span
              key={g}
              className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full flex items-center"
            >
              {g}
              <button
                onClick={() => removeGrade(g)}
                className="ml-1 font-bold"
                aria-label={`Remove ${g}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <div className="relative mb-4" ref={wrapperRef}>
          <input
            type="text"
            value={gradeInput}
            onChange={(e) => setGradeInput(e.target.value)}
            onFocus={onFocus}
            onBlur={onBlur}
            placeholder="Click to select grade"
            className="w-full p-1 border rounded"
          />
          {dropdownOpen && suggestions.length > 0 && (
            <ul className="absolute top-full left-0 right-0 bg-white border rounded shadow max-h-40 overflow-auto z-10">
              {suggestions.map((g) => (
                <li
                  key={g}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    addGrade(g);
                    setGradeInput("");
                  }}
                  className="px-3 py-1 hover:bg-gray-200 cursor-pointer"
                >
                  {g}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Search by Code */}
        <h2 className="font-bold mb-2">Search by Code</h2>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by code"
          className="w-full mb-4 p-1 border rounded"
        />

        {/* Node Details */}
        <h2 className="font-bold mb-2">Node Details</h2>
        <NodeDetails selectedNode={selectedNode} />

        {/* Edge Types Select */}
        {selectedNode && (
          <>
            <h3 className="font-bold mt-4">Edge Types</h3>
            <select
              value={selectedEdgeType}
              onChange={(e) => setSelectedEdgeType(e.target.value)}
              className="w-full mb-4 p-1 border rounded"
            >
              <option value="">-- Select Edge Type --</option>
              {edgeTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            {/* Connections Table */}
            {selectedEdgeType && (
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr>
               
                  
                        <th className="border p-1 text-left">Code</th>
                        <th className="border p-1 text-left">Description</th>
                        <th className="border p-1 text-left">Grades</th>
                        <th className="border p-1 text-left">Confidence</th>
                   
                   
                  </tr>
                </thead>
                <tbody>
                  {connections.map((c) => (
                    <tr key={c.id}>
                      <td className="border p-1">{c.code}</td>
                      <td className="border p-1">{c.description}</td>
                      <td className="border p-1">
                        {c.grade_levels?.join(", ")}
                      </td>
                      <td className="border p-1">
                        {c.confidence !== undefined
                          ? c.confidence.toFixed(2)
                          : "–"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ——— Helpers ———
function getColorByType(type) {
  switch (type) {
    case "Cluster":
      return "#E3F2FD";
    case "Domain":
      return "#FFF9C4";
    case "Component":
      return "#D1C4E9";
    case "Standard":
      return "#C8E6C9";
    default:
      return "#F0F0F0";
  }
}
function getSizeByType(type) {
  switch (type) {
    case "Cluster":
      return 60;
    case "Domain":
      return 50;
    case "Standard":
      return 40;
    case "Component":
      return 30;
    default:
      return 20;
  }
}
function getEdgeColor(type) {
  switch (type) {
    case "EXACT_MATCH":
      return "#4CAF50";
    case "IS_CHILD_OF":
      return "#2196F3";
    case "INFERRED_ALIGNMENT":
      return "#9E9E9E";
    default:
      return "#BDBDBD";
  }
}
