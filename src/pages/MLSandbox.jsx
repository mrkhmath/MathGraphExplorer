import React, { useState } from "react";
import VisGraph from "./VisGraph";

const API_URL = "http://localhost:5050/predict_readiness";

const studentOptions = ["000f6446a2f18b146741956807f5ec64c2a7ff539f4c7d733e37c6aa16799f16",
  "6e3f3790948a67fd8224c3da772ec02ca5c3e9d1387b147dd769f4cd40053a60",
  "11c98851b97cb03a917e6a324b800e98748455eb3b1785c88b52ff06acf280c3",
  "a15b7c767a4796b5470d093470a2585fc6b56041ab527d14cea52d3225dd4fdd",
  "58870f40ac9f79aaefa1eaf2cd961fb0f6d5d264614e8fcc066f5de544e7d6ae",
  "8bde30caacbb59cb02775e026181176ae95f5af09e1289f5649e53a998ddf2d6",
  "f55b2bd92843ab808f83ac419d54011d0f08c3606c721438a87965495a0c3ac9",
  "fb038de51851b4e82fc3e53869c7c30d55008e6c7fd9575b5101136c53a69a42",
  "eb9217e8dfdc69de587892e4ea6a8b59043ca6cbda7c2be7292c6c0a6f4d7858",
  "c55134ec935dfe333141d11b9173f93bf83113901bd99caa7423497b7a3323de",
  "bc9efcf2cf472152afd59e595ad94faad151944c595fa8c06d0ee34c26f59b10",
  "84675abb548d8bc46a5915310b1232290f51bdb3ba419858f6c677afb2050829",
  "6bdb11a640105afe1fef033961d20ccea1058a6c36f9cf9135ed180bb4b546c4",
  "e293f671e96e8c5b5835c849b4ca8a70ebfcec6b401507f4d6daada0ff2a1fa2",
  "bfa77f1d7d2b05a04a6070099eb62eef003608841e8b114b03e0a23d3abd0cae",
  "e309afe7c834efc3b6a5595f3b3501937e092720543a65b4bd04f3ff6c85ea18",
  "2a1adea34f93a97d6651083526747d61e37689bc80f48389f07fa57c0708b226",
  "8f153d130ba3b154682dfe8c613bd98af935082b0608dbf378968270a82ae6a5",
  "e955ba023baa507ccc4d066625ad019ef3d390f7a74a74de0bf858918928f509",
  "692fedcad860830219ad7a340ad33d677179c1e8f94042e5b0d12e88211f0d3c",
  "443316b4ed4bd975df700247226104f7e0c4ea07f47eeccef76143c85e7bc481",
  "4721e31790b292633d72ecb061f95c1b41a525a546d91d9e75d7f2cafac07ef8",
  "f1983dbabb42f36731f0b1863710bc9b2ec48b553fc06c9a2e05e1b6a6a5cdab",
  "4c2c1a4b2b2d90f0673fda006c5f6891428803104a51697f34f895b84a12e7f0",
  "a74f4a4063f97183eee482c42b77eda564b958f431e4b0d14d8430160e96b7ae",
  "371635a25b026860704567b1c784c0c1adc1e8394c653fa165e5b4fbfad53e02",
  "ba9bc9ce29c53187818f6258ac4925f7bd1a9e6c042f0829b832964dbbf64c00",
  "8a84f3297274592a4bfe2a00a0c6e8bf2d91c8357940a9ea08464e5ba7e2d562",
  "a4ecd3a43821c8983cbc199604557bb704b69164a5db672873e283b9652ff550",
  "6874e68354b1fe1c8ae66d0ac8f1b7fd9f11bd1e8b38d07ca7c40695738a5ff3",
  "e00394d904cd7718df52b55af065bae999c071d936310316964a59165f9039f1"
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
    if (!studentId || !targetCcss || !dok) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setGraphData(null);
    setGraphError(false);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student_id: studentId, target_ccss: targetCcss, normalized_dok: dok })
      });

      const data = await response.json();
      console.log("📦 API Response:", data);

      if (!response.ok) throw new Error(data.error || "Prediction failed");

      setResult({ readiness: data.readiness, probability: data.probability });

      if (!data.graph || !Array.isArray(data.graph.nodes) || !Array.isArray(data.graph.links) || data.graph.nodes.length === 0) {
        console.warn("⚠️ Invalid or empty graph data:", data.graph);
        setGraphError(true);
        return;
      }

      const nodes = data.graph.nodes.map((n) => ({
        id: n.label,
        color: n.label === targetCcss ? "red" : "#1f77b4",
        label: n.label,
        description: n.description ?? "No description",
        grade_levels: n.grade_levels ?? [],
        score: n.score,
      }));

      const links = data.graph.links.map((l) => ({
        source: l.source,
        target: l.target,
        label: l.type,
      }));

      setGraphData({ nodes, links });
    } catch (err) {
      console.error("❌ Request failed:", err);
      setError(err.message);
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
