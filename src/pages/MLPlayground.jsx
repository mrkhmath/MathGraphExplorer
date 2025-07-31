// src/components/MlSandbox.jsx
import React, { useState } from 'react';
import axios from 'axios';

export default function MLPlayground() {
  const [file, setFile] = useState(null);
  const [concept, setConcept] = useState('');
  const [predictionResults, setPredictionResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleConceptChange = (e) => {
    setConcept(e.target.value);
  };

  const handleSubmit = async () => {
    if (!file || !concept) return alert('Please upload a file and enter a concept.');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('concept', concept);

    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/api/predict', formData);
      setPredictionResults(response.data);
    } catch (err) {
      console.error(err);
      alert('Prediction failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">ML Sandbox</h2>
      <input type="file" accept=".csv,.xlsx" onChange={handleFileChange} className="mb-2" />
      <input
        type="text"
        placeholder="Enter concept code (e.g. CCSS.Math.Content.HSA.REI.B.4)"
        value={concept}
        onChange={handleConceptChange}
        className="border p-2 w-full mb-2"
      />
      <button onClick={handleSubmit} className="bg-blue-500 text-white p-2 rounded">
        Predict Readiness
      </button>

      {loading && <p className="mt-4">Running predictions...</p>}

      {predictionResults && (
        <div className="mt-4">
          <h3 className="font-semibold">Results:</h3>
          <pre className="bg-gray-100 p-2 rounded text-sm overflow-x-auto">
            {JSON.stringify(predictionResults, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
