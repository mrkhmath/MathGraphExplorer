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

  useEffect(() => setSelectedEdgeType(""), [selectedNode]);

  const addGrade = (g) => {
    if (g && !gradeFilter.includes(g)) {
      setGradeFilter((prev) => [...prev, g]);
    }
  };
  const removeGrade = (g) =>
    setGradeFilter((prev) => prev.filter((x) => x !== g));

  const onFocus = () => setDropdownOpen(true);
  const onBlur = () => setTimeout(() => setDropdownOpen(false), 100);

  const suggestions = allGrades
    .filter((g) => !gradeFilter.includes(g))
    .filter((g) =>
      gradeInput === ""
        ? true
        : g.toLowerCase().startsWith(gradeInput.toLowerCase())
    );

  const matchesAnyGrade = (c) =>
    gradeFilter.length === 0 ||
    c.grade_levels?.some((lvl) =>
      gradeFilter.some((g) =>
        g === "9-12" ? ["9", "10", "11", "12", "9-12"].includes(lvl) : lvl === g
      )
    );

  const matchesSearch = (c) => {
    if (!searchTerm) return false;
    const t = searchTerm.toLowerCase();
    return c.code?.toLowerCase().includes(t);
  };

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

  // Memoized nodes
  const nodes = useMemo(() => {
    return displayConcepts.map((c) => ({
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
  }, [displayConcepts]);

  // Memoized edges
  const edges = useMemo(() => {
    const validIds = new Set(displayConcepts.map((c) => c.id));
    const result = [];

    displayConcepts.forEach((src) => {
      (src.inferredAlignmentsConnection?.edges || []).forEach((e) => {
        console.log(e.properties.alignmentType)
        const tgt = e.node;
        const alignmentType = e.properties?.alignmentType || "INFERRED_ALIGNMENT";
        if (validIds.has(src.id) && validIds.has(tgt?.id)) {
          result.push({
            source: src.id,
            target: tgt.id,
            data: {
              type: alignmentType,
              confidence: e.properties?.confidence ?? 1.0,
            },
            style: {
              stroke: getEdgeColor(alignmentType),
            },
          });
        }
      });

      (src.exactMatches || []).forEach((tgt) => {
        if (validIds.has(src.id) && validIds.has(tgt.id)) {
          result.push({
            source: src.id,
            target: tgt.id,
            data: { type: "EXACT_MATCH", confidence: 1.0 },
            style: { stroke: getEdgeColor("EXACT_MATCH") },
          });
        }
      });

      (src.parts || []).forEach((tgt) => {
        if (validIds.has(src.id) && validIds.has(tgt.id)) {
          result.push({
            source: src.id,
            target: tgt.id,
            data: { type: "IS_PART_OF", confidence: 1.0 },
            style: { stroke: getEdgeColor("IS_PART_OF") },
          });
        }
      });

      (src.children || []).forEach((tgt) => {
        if (validIds.has(src.id) && validIds.has(tgt.id)) {
          result.push({
            source: src.id,
            target: tgt.id,
            data: { type: "IS_CHILD_OF", confidence: 1.0 },
            style: { stroke: getEdgeColor("IS_CHILD_OF") },
          });
        }
      });
    });

    return result;
  }, [displayConcepts]);

  // Memoized related data
  const relatedEdges = useMemo(() => {
    return selectedNode
      ? edges.filter((e) => e.data.type && e.source === selectedNode.id)
      : [];
  }, [edges, selectedNode]);

  const edgeTypes = useMemo(() => {
    return [...new Set(relatedEdges.map((e) => e.data.type))];
  }, [relatedEdges]);

  const connections = useMemo(() => {
    return selectedEdgeType
      ? relatedEdges
          .filter((e) => e.data.type === selectedEdgeType)
          .map((e) => {
            const otherId = e.source === selectedNode.id ? e.target : e.source;
            const node = nodes.find((n) => n.id === otherId);
            return node
              ? { ...node.data, confidence: e.data.confidence }
              : null;
          })
          .filter(Boolean)
      : [];
  }, [relatedEdges, selectedEdgeType, selectedNode, nodes]);

  const handleNodeClick = (evt) => {
    setSelectedNode(evt.item.getModel().data);
  };
  const handleCanvasClick = () => setSelectedNode(null);

  return (
    <div className="flex">
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

      <div className="w-1/4 h-[90vh] overflow-y-auto p-4 border-l bg-gray-50">
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

        <h2 className="font-bold mb-2">Search by Code</h2>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by code"
          className="w-full mb-4 p-1 border rounded"
        />

        <h2 className="font-bold mb-2">Node Details</h2>
        <NodeDetails selectedNode={selectedNode} />

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
