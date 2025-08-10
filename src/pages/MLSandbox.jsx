import React, { useState } from "react";
import VisGraph from "./VisGraph";

const API_URL = "https://ml-sandbox-backend.onrender.com/predict_readiness";
// const API_URL = "http://localhost:5000/predict_readiness";
// const API_URL = "https://ml-sandbox-backend.onrender.com/";

const studentOptions = [
  "6fb38d797b89746a1a6daa694c81f94d032f77691e036336ef484d2512f57d38",
  "7ab24aa966e087924d3778761f4da047706a08d4781f34cd6a0b40508ebf5faa",
  "30049d75a43893552dd2f1fd40f1a87c0c49b63fabe983f333715eda899b423a",
  "8f153d130ba3b154682dfe8c613bd98af935082b0608dbf378968270a82ae6a5",
  "20610ccfdb2590588f912336acc3a896613f7871e5917b07fb50fdc176be9e0a",
  "e955ba023baa507ccc4d066625ad019ef3d390f7a74a74de0bf858918928f509",
  "ff1c51c1664348b26fa9ad796151d362b914075533fd20f98be4c5c50f9d40f3",
  "4c2c1a4b2b2d90f0673fda006c5f6891428803104a51697f34f895b84a12e7f0",
  "06e47bfdf627fb8305aa68b856a22198627d751978e25eee9ed6b7f8942be41c",
  "19c88deddd4b5ceea582109e0cbed95cd524baeaaa83a05d5bc860ddfdf59ee3",
  "c2da245458b511080557dae98c5d88a123495bf521e8b0c93c6c73e1ba26e25d",
  "ce32fb4347a2cdbcefd26fbf620ee1f84f221e2eff91b4e99f97c8d89bf66006",
  "0425f6ee71b4f9625f2a4abab2e3b336c26c4c18d5399783d9dd2d7b3c36a800",
  "455f6fd333cccf3f4f31678cefa0c91cfdba154a16beeaf3295507d085029c1c",
  "de09043a9c62118fcdd14102c1f98e59a01d839505882e950f5f63ca34d84b4e",
  "abbd7026ec41437cc70986309d748a46581110d2567326654cdafe65db5b7043",
  "6ed398f76b34aec751ab771a475b03588959c7b83ecd5827e39474237f3b3c6d",
  "7fede89d5ad94755dd2ed94d9f7d93fb2fc3b85d497ea7bc991677026eef6fd5",
  "2f602b2d2bb69193aea1eb87edd556bdf974610a91412d11b83a5086d8945f82",
  "b1149b1693690842ad01fd88a5f4c279b577bc34faae7dcc41c836c1f838d06f",
  "19eafaa1bce75e261fcffbbf4f19be2c54e94b7202cf3d611728c0255c26fb06",
  "37038e57b17a2d8b4726a727d58dbdda02378e7691f17666595fbe1865b31e0c",
  "873fc84fafa6148c92c7330b13edb853ee980ce656ce18f5d6da99a1213eb430",
  "d74897fa18335caa66194de879038163b7089a6174658570b2fbc7b769f6ef00",
  "b68824cd7205d5d691c8803618d3ebe7cb41e2f382961c9475b14ba0e55fc54e",
  "7841afaec597f1f145feb247ba0a30b26de34caac35423d718ac84236a551483",
  "5883f027272942cdc68b8b3ba18161823db10871f62f02c70331aa4e41ed412c",
  "ec3cc8471e75dbb3316fcf7e9285cd8e7c970708ecab68a7caca464dd5f79c95",
  "31a830c08899d1763669b10ea7adbcb2f3891a5e561145fe82228c4e3cca4582",
  "b961c53e8901f1d9c7f3a3a2e0ec9b64ba98bf1f7b94f9dd1783bb536c149376"
];
const conceptOptions  = [
  "6.EE.1",
  "6.EE.2",
  "6.EE.5",
  "6.EE.7",
  "6.EE.9",
  "6.G.1",
  "6.G.2",
  "6.G.3",
  "6.G.4",
  "6.NS.1",
  "6.NS.2",
  "6.NS.3",
  "6.NS.4",
  "6.NS.6",
  "6.NS.7",
  "6.RP.1",
  "6.RP.3",
  "6.SP.4",
  "6.SP.5",
  "7.EE.1",
  "7.EE.2",
  "7.EE.3",
  "7.EE.4",
  "7.G.1",
  "7.G.2",
  "7.G.3",
  "7.G.4",
  "7.G.5",
  "7.G.6",
  "7.NS.1",
  "7.NS.2",
  "7.NS.3",
  "7.RP.1",
  "7.RP.2",
  "7.RP.3",
  "7.SP.2",
  "7.SP.3",
  "7.SP.4",
  "7.SP.5",
  "8.EE.1",
  "8.EE.2",
  "8.EE.3",
  "8.EE.4",
  "8.EE.5",
  "8.EE.6",
  "8.EE.7",
  "8.EE.8",
  "8.F.1",
  "8.F.2",
  "8.F.3",
  "8.F.4",
  "8.F.5",
  "8.G.1",
  "8.G.2",
  "8.G.3",
  "8.G.4",
  "8.G.5",
  "8.G.6",
  "8.G.7",
  "8.G.8",
  "8.NS.1",
  "8.NS.2",
  "8.SP.1",
  "8.SP.2",
  "8.SP.3",
  "A.APR.1",
  "A.CED.1",
  "A.CED.2",
  "A.CED.3",
  "A.CED.4",
  "A.REI.1",
  "A.REI.10",
  "A.REI.11",
  "A.REI.12",
  "A.REI.3.1",
  "A.REI.3",
  "A.REI.4",
  "A.REI.5",
  "A.REI.6",
  "A.SSE.1",
  "A.SSE.2",
  "A.SSE.3",
  "F.BF.1",
  "F.BF.2",
  "F.BF.3",
  "F.BF.4",
  "F.IF.1",
  "F.IF.2",
  "F.IF.3",
  "F.IF.4",
  "F.IF.6",
  "F.IF.7",
  "F.IF.8",
  "F.IF.9",
  "F.LE.1",
  "F.LE.4.1",
  "F.LE.4.2",
  "F.LE.5",
  "G.C.2",
  "G.C.3",
  "G.C.4",
  "G.C.5",
  "G.CO.10",
  "G.CO.11",
  "G.CO.12",
  "G.CO.2",
  "G.CO.3",
  "G.CO.4",
  "G.CO.5",
  "G.CO.6",
  "G.CO.8",
  "G.CO.9",
  "G.GMD.3",
  "G.GPE.4",
  "G.GPE.5",
  "G.GPE.6",
  "G.GPE.7",
  "G.MG.1",
  "G.MG.3",
  "G.SRT.2",
  "G.SRT.5",
  "G.SRT.8.1",
  "G.SRT.8",
  "N.Q.1",
  "N.RN.1",
  "N.RN.2",
  "N.RN.3",
  "S.CP.4",
  "S.CP.5",
  "S.ID.6"
];
export default function MLSandbox() {
  const [studentId, setStudentId] = useState("");
  const [targetCcss, setTargetCcss] = useState("");
  const [dok, setDok] = useState(2);
  const [result, setResult] = useState(null);
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [graphError, setGraphError] = useState(false);

const handlePredict = async () => {
  // Validate (dok can be 1–4; don't treat 1 as "missing")
  if (!studentId || !targetCcss || Number.isNaN(Number(dok))) {
    setError("Please fill in all fields.");
    return;
  }

  setLoading(true);
  setError(null);
  setResult(null);
  setGraphData(null);
  setGraphError(false);

  // Optional: cancel in-flight if user clicks twice
  const ac = new AbortController();
  const { signal } = ac;

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        student_id: studentId,
        target_ccss: targetCcss,
        normalized_dok: Number(dok),
      }),
      signal,
    });

    // Read raw text first so we can parse or show HTML errors
    const raw = await res.text();
    let data;
    try { data = raw ? JSON.parse(raw) : {}; } catch { data = { error: raw }; }

    if (!res.ok) {
      // Show backend message if present
      const msg = (data && data.error) ? data.error : `Server error ${res.status}`;
      throw new Error(msg);
    }

    // Expect: { readiness, probability, graph }
    setResult({ readiness: data.readiness, probability: data.probability });

    // Normalize graph shape
    const rawNodes = Array.isArray(data.graph?.nodes) ? data.graph.nodes : [];
    const rawEdges = Array.isArray(data.graph?.links)
      ? data.graph.links
      : Array.isArray(data.graph?.edges)
        ? data.graph.edges
        : [];

    if (rawNodes.length === 0) {
      console.warn("⚠️ Invalid or empty graph data:", data.graph);
      setGraphError(true);
      return;
    }

    // Build nodes with id/label fallbacks
    const nodes = rawNodes.map((n) => {
      const id = n.id ?? n.label;           // prefer n.id
      const label = n.label ?? n.id ?? id;  // display label
      return {
        id,
        color: label === targetCcss ? "red" : "#1f77b4",
        label,
        description: n.description ?? "No description",
        grade_levels: n.grade_levels ?? [],
        score: n.score,
      };
    });

    // Build links with source/target fallbacks
    const links = rawEdges.map((e) => ({
      source: e.source ?? e.from ?? e.src ?? e.start,
      target: e.target ?? e.to   ?? e.dst ?? e.end,
      label:  e.type   ?? e.label ?? "",
    }));

    setGraphData({ nodes, links });
  } catch (err) {
    console.error("❌ Request failed:", err);
    // Friendlier network message
    const msg = (err?.message?.includes("Failed to fetch"))
      ? "Backend unreachable (network/timeout). Try again or check server logs."
      : err.message || "Unexpected error";
    setError(msg);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold text-indigo-700">🧠 SRPM Sandbox</h2>

      {/* Form Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Student</label>
          <select
            className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
          >
            <option value="">Select a student</option>
            {studentOptions.map((id) => (
              <option key={id} value={id}>{id}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Target Concept</label>
          <input
            list="concepts"
            className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            value={targetCcss}
            onChange={(e) => setTargetCcss(e.target.value)}
            placeholder="e.g. 8.EE.2"
          />
          <datalist id="concepts">
            {conceptOptions.map((code) => (
              <option key={code} value={code} />
            ))}
          </datalist>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Depth of Knowledge</label>
          <select
            className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            value={dok}
            onChange={(e) => setDok(Number(e.target.value))}
          >
            {[1, 2, 3, 4].map((level) => (
              <option key={level} value={level}>DoK {level}</option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={handlePredict}
        disabled={loading}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md shadow"
      >
        {loading ? "Predicting..." : "Predict Readiness"}
      </button>

      {error && <p className="text-red-500 text-sm mt-2">❌ {error}</p>}

      {result && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold">📊 Prediction Result</h3>
          <p><strong>Probability:</strong> {(result.probability * 100).toFixed(2)}%</p>
          <p><strong>Ready:</strong> {result.readiness ? "✅ Yes" : "❌ No"}</p>
        </div>
      )}

      <div className="mt-6">
        <h4 className="text-md font-medium">🕸 Concept Subgraph</h4>
        {graphError && <p className="text-gray-500">No graph available for this concept.</p>}
        {graphData && <VisGraph graphData={graphData} />}
      </div>
    </div>
  );
}
